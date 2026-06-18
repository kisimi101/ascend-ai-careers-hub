const SUPABASE_URL = "https://jpsixrrcftxctghpzuhj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwc2l4cnJjZnR4Y3RnaHB6dWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjg5ODEsImV4cCI6MjA3ODIwNDk4MX0.a1vfCuIWKDn2IuBMZTnztoYemWfevxksARs0sYFCnGE";
const CAREERNOW_WEB_URL = "https://www.careernow.xyz";

const $ = (id) => document.getElementById(id);
const statusEl = () => $("status");
function setStatus(msg, isError = false) { const el = statusEl(); el.textContent = msg || ""; el.className = "status" + (isError ? " err" : ""); }

async function getStored() {
  return await chrome.storage.local.get(["cn_session", "cn_profile", "cn_resume", "cn_resume_meta"]);
}

async function refreshUI() {
  const { cn_session, cn_profile, cn_resume_meta } = await getStored();
  if (cn_session?.access_token) {
    $("signed-out").style.display = "none";
    $("signed-in").style.display = "block";
    $("p-name").textContent = cn_profile?.full_name || cn_profile?.email || "Profile";
    $("p-email").textContent = cn_profile?.email || "";
    $("p-resume").textContent = cn_resume_meta?.updated_at
      ? `Latest resume: ${new Date(cn_resume_meta.updated_at).toLocaleDateString()}`
      : "No resume saved — open Resume Builder";
  } else {
    $("signed-out").style.display = "block";
    $("signed-in").style.display = "none";
  }
}

async function authFetch(path) {
  const { cn_session } = await getStored();
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${cn_session.access_token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

async function loadProfileAndResume(session) {
  const [profileRows, resumeRows] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&id=eq.${session.user.id}`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.access_token}` },
    }).then((r) => r.ok ? r.json() : []),
    fetch(`${SUPABASE_URL}/rest/v1/resume_drafts?select=data,updated_at&user_id=eq.${session.user.id}&order=updated_at.desc&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.access_token}` },
    }).then((r) => r.ok ? r.json() : []),
  ]);
  const profile = profileRows?.[0] || null;
  const resume = resumeRows?.[0]?.data || null;
  const resume_meta = resumeRows?.[0] ? { updated_at: resumeRows[0].updated_at } : null;
  await chrome.storage.local.set({ cn_profile: profile, cn_resume: resume, cn_resume_meta: resume_meta });
  return { profile, resume };
}

$("signin").addEventListener("click", async () => {
  const email = $("email").value.trim();
  const password = $("password").value;
  if (!email || !password) { setStatus("Enter email and password", true); return; }
  setStatus("Signing in…");
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error_description || e?.msg || "Invalid login"); }
    const session = await res.json();
    await chrome.storage.local.set({ cn_session: session });
    await loadProfileAndResume(session);
    setStatus("Signed in");
    await refreshUI();
  } catch (e) { setStatus(e.message || "Sign-in failed", true); }
});

$("open-app").addEventListener("click", () => chrome.tabs.create({ url: `${CAREERNOW_WEB_URL}/auth` }));

$("signout").addEventListener("click", async () => {
  await chrome.storage.local.remove(["cn_session", "cn_profile", "cn_resume", "cn_resume_meta"]);
  await refreshUI();
});

$("reload-data").addEventListener("click", async () => {
  const { cn_session } = await getStored();
  if (!cn_session) return;
  setStatus("Refreshing…");
  await loadProfileAndResume(cn_session);
  setStatus("Up to date");
  await refreshUI();
});

$("clear-cache").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const host = new URL(tab.url).hostname;
  const all = await chrome.storage.local.get(null);
  const k = `cn_map_${host}`;
  if (all[k]) await chrome.storage.local.remove(k);
  setStatus(`Cleared map for ${host}`);
});

function buildPayload(profile, resume) {
  const p = profile || {}; const r = resume || {}; const pi = r.personalInfo || {};
  const fullName = pi.fullName || p.full_name || "";
  const [firstName, ...rest] = fullName.split(" ");
  return {
    firstName, lastName: rest.join(" "), fullName,
    email: pi.email || p.email || "",
    phone: pi.phone || "",
    location: pi.location || "",
    linkedin: pi.linkedin || "",
    website: pi.website || "",
    summary: pi.summary || "",
    skills: Array.isArray(r.skills) ? r.skills.join(", ") : "",
    currentCompany: r.experience?.[0]?.company || "",
    currentTitle: r.experience?.[0]?.position || "",
    school: r.education?.[0]?.institution || "",
    degree: r.education?.[0]?.degree || "",
    coverLetter: r.__coverLetter || "",
  };
}

// Build a plain-text resume blob (base64) suitable for upload to file inputs.
function buildResumeFile(resume) {
  if (!resume) return null;
  const pi = resume.personalInfo || {};
  const lines = [];
  lines.push(pi.fullName || "Resume");
  lines.push([pi.email, pi.phone, pi.location].filter(Boolean).join(" · "));
  if (pi.linkedin) lines.push(pi.linkedin);
  lines.push("");
  if (pi.summary) { lines.push("SUMMARY"); lines.push(pi.summary); lines.push(""); }
  if (resume.experience?.length) {
    lines.push("EXPERIENCE");
    for (const e of resume.experience) {
      lines.push(`${e.position || ""} — ${e.company || ""} (${e.duration || ""})`);
      if (e.description) lines.push(e.description);
      lines.push("");
    }
  }
  if (resume.education?.length) {
    lines.push("EDUCATION");
    for (const e of resume.education) lines.push(`${e.degree || ""}, ${e.institution || ""} (${e.year || ""})`);
    lines.push("");
  }
  if (resume.skills?.length) { lines.push("SKILLS"); lines.push(resume.skills.join(", ")); }
  const text = lines.join("\n");
  const b64 = btoa(unescape(encodeURIComponent(text)));
  const safeName = (pi.fullName || "resume").replace(/[^a-z0-9]+/gi, "_");
  return { name: `${safeName}_Resume.txt`, mime: "text/plain", base64: b64 };
}

async function callSmartMatch(action, extra) {
  const { cn_session, cn_resume } = await getStored();
  if (!cn_resume) throw new Error("No resume found — build one in CareerNow first.");
  const res = await fetch(`${SUPABASE_URL}/functions/v1/smart-match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${cn_session.access_token}`,
    },
    body: JSON.stringify({ action, resumeData: cn_resume, ...extra }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "AI request failed");
  return data;
}

function scoreClass(n) { return n >= 75 ? "score-good" : n >= 50 ? "score-mid" : "score-low"; }

$("score").addEventListener("click", async () => {
  const jd = $("jd").value.trim();
  if (!jd) { setStatus("Paste a job description first", true); return; }
  setStatus("Scoring…"); $("score").disabled = true;
  try {
    const r = await callSmartMatch("readiness", { jobDescription: jd });
    $("score-card").style.display = "block";
    const num = $("score-num"); num.textContent = r.score ?? "—"; num.className = "score-num " + scoreClass(r.score || 0);
    $("score-verdict").textContent = r.verdict || "";
    const ul = $("score-tips"); ul.innerHTML = "";
    (r.tips || []).slice(0, 3).forEach((t) => { const li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
    setStatus("");
  } catch (e) { setStatus(e.message, true); } finally { $("score").disabled = false; }
});

$("letter").addEventListener("click", async () => {
  const jd = $("jd").value.trim();
  if (!jd) { setStatus("Paste a job description first", true); return; }
  setStatus("Writing cover letter…"); $("letter").disabled = true;
  try {
    const r = await callSmartMatch("single-cover-letter", { jobDescription: jd });
    const { cn_resume } = await getStored();
    cn_resume.__coverLetter = r.letter || "";
    await chrome.storage.local.set({ cn_resume });
    setStatus("Cover letter ready — click Autofill to insert it.");
  } catch (e) { setStatus(e.message, true); } finally { $("letter").disabled = false; }
});

$("fill").addEventListener("click", async () => {
  setStatus("Filling…");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) { setStatus("No active tab", true); return; }
  try {
    const { cn_profile, cn_resume } = await getStored();
    const payload = buildPayload(cn_profile, cn_resume);
    const resumeFile = buildResumeFile(cn_resume);
    const host = new URL(tab.url).hostname;
    const mapKey = `cn_map_${host}`;
    const cached = (await chrome.storage.local.get(mapKey))[mapKey] || {};

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "CN_AUTOFILL", payload, resumeFile, fieldMap: cached, host,
    });
    if (response?.ok) {
      setStatus(`Filled ${response.filled} field${response.filled === 1 ? "" : "s"}${response.attached ? " + resume" : ""}`);
      if (response.learned && Object.keys(response.learned).length) {
        await chrome.storage.local.set({ [mapKey]: { ...cached, ...response.learned } });
      }
    } else {
      setStatus(response?.error || "Could not autofill on this page", true);
    }
  } catch (e) { setStatus("This page isn't a supported application form.", true); }
});

refreshUI();