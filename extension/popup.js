const SUPABASE_URL = "https://jpsixrrcftxctghpzuhj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwc2l4cnJjZnR4Y3RnaHB6dWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2Mjg5ODEsImV4cCI6MjA3ODIwNDk4MX0.a1vfCuIWKDn2IuBMZTnztoYemWfevxksARs0sYFCnGE";
const CAREERNOW_WEB_URL = "https://www.careernow.xyz";

const $ = (id) => document.getElementById(id);
const statusEl = () => $("status");

function setStatus(msg, isError = false) {
  const el = statusEl();
  el.textContent = msg || "";
  el.className = "status" + (isError ? " err" : "");
}

async function getStored() {
  return await chrome.storage.local.get(["cn_session", "cn_profile", "cn_resume"]);
}

async function refreshUI() {
  const { cn_session, cn_profile } = await getStored();
  if (cn_session?.access_token) {
    $("signed-out").style.display = "none";
    $("signed-in").style.display = "block";
    $("p-name").textContent = cn_profile?.full_name || cn_profile?.email || "Profile";
    $("p-email").textContent = cn_profile?.email || "";
  } else {
    $("signed-out").style.display = "block";
    $("signed-in").style.display = "none";
  }
}

async function fetchProfile(session) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?select=*&id=eq.${session.user.id}`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.access_token}` } }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

async function fetchLatestResume(session) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/resume_drafts?select=data,updated_at&user_id=eq.${session.user.id}&order=updated_at.desc&limit=1`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.access_token}` } }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0]?.data || null;
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
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error_description || e?.msg || "Invalid login");
    }
    const session = await res.json();
    const profile = await fetchProfile(session);
    const resume = await fetchLatestResume(session);
    await chrome.storage.local.set({ cn_session: session, cn_profile: profile, cn_resume: resume });
    setStatus("Signed in");
    await refreshUI();
  } catch (e) {
    setStatus(e.message || "Sign-in failed", true);
  }
});

$("open-app").addEventListener("click", () => {
  chrome.tabs.create({ url: `${CAREERNOW_WEB_URL}/auth` });
});

$("signout").addEventListener("click", async () => {
  await chrome.storage.local.remove(["cn_session", "cn_profile", "cn_resume"]);
  await refreshUI();
});

$("fill").addEventListener("click", async () => {
  setStatus("Filling…");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) { setStatus("No active tab", true); return; }
  try {
    const { cn_profile, cn_resume } = await getStored();
    const payload = buildAutofillPayload(cn_profile, cn_resume);
    const response = await chrome.tabs.sendMessage(tab.id, { type: "CN_AUTOFILL", payload });
    if (response?.ok) {
      setStatus(`Filled ${response.filled} field${response.filled === 1 ? "" : "s"}`);
    } else {
      setStatus(response?.error || "Could not autofill on this page", true);
    }
  } catch (e) {
    setStatus("This page isn't a supported application form.", true);
  }
});

function buildAutofillPayload(profile, resume) {
  const p = profile || {};
  const r = resume || {};
  const pi = r.personalInfo || {};
  const fullName = pi.fullName || p.full_name || "";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ");
  return {
    firstName, lastName, fullName,
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
  };
}

refreshUI();