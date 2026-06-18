// CareerNow Autofill — content script
// Maps form fields → profile keys via a scoring heuristic, with a per-site cache
// keyed by stable field signatures so repeat applications fill instantly.

(function () {
  const FIELD_RULES = [
    { key: "firstName",      patterns: [/first[\s_-]?name/i, /given[\s_-]?name/i, /\bfname\b/i] },
    { key: "lastName",       patterns: [/last[\s_-]?name/i, /family[\s_-]?name/i, /surname/i, /\blname\b/i] },
    { key: "fullName",       patterns: [/full[\s_-]?name/i, /^name$/i, /your name/i, /legal name/i] },
    { key: "email",          patterns: [/e[\s_-]?mail/i] },
    { key: "phone",          patterns: [/phone/i, /mobile/i, /telephone/i, /\btel\b/i] },
    { key: "location",       patterns: [/location/i, /\bcity\b/i, /address/i, /where.*based/i] },
    { key: "linkedin",       patterns: [/linkedin/i, /linked[\s_-]?in/i] },
    { key: "website",        patterns: [/website/i, /portfolio/i, /personal site/i, /github/i, /\burl\b/i] },
    { key: "currentCompany", patterns: [/current.*(company|employer)/i, /^company$/i, /employer/i] },
    { key: "currentTitle",   patterns: [/current.*(title|position|role)/i, /job title/i, /^title$/i] },
    { key: "school",         patterns: [/school/i, /university/i, /college/i, /institution/i, /education/i] },
    { key: "degree",         patterns: [/degree/i, /qualification/i] },
    { key: "coverLetter",    patterns: [/cover letter/i, /why.*(interested|join|work)/i, /tell us about/i, /additional info/i, /motivation/i] },
    { key: "summary",        patterns: [/summary/i, /about you/i, /bio/i] },
    { key: "skills",         patterns: [/skills/i] },
  ];

  function isFillable(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (el.disabled || el.readOnly) return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    if (el instanceof HTMLInputElement) {
      const t = (el.type || "text").toLowerCase();
      return ["text", "email", "tel", "url", "search", ""].includes(t);
    }
    return el instanceof HTMLTextAreaElement;
  }

  function isFileInput(el) {
    return el instanceof HTMLInputElement && (el.type || "").toLowerCase() === "file" && !el.disabled;
  }

  function labelTextFor(el) {
    const parts = [];
    if (el.id) {
      const lbl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (lbl) parts.push(lbl.innerText);
    }
    const wrappingLabel = el.closest("label");
    if (wrappingLabel) parts.push(wrappingLabel.innerText);
    const aria = el.getAttribute("aria-label"); if (aria) parts.push(aria);
    const ariaBy = el.getAttribute("aria-labelledby");
    if (ariaBy) ariaBy.split(/\s+/).forEach((id) => { const n = document.getElementById(id); if (n) parts.push(n.innerText); });
    parts.push(el.getAttribute("placeholder") || "");
    parts.push(el.getAttribute("name") || "");
    parts.push(el.getAttribute("id") || "");
    parts.push(el.getAttribute("data-automation-id") || ""); // Workday
    parts.push(el.getAttribute("data-qa") || "");
    return parts.filter(Boolean).join(" | ");
  }

  function matchKey(label) {
    for (const rule of FIELD_RULES) if (rule.patterns.some((re) => re.test(label))) return rule.key;
    return null;
  }

  // Stable signature for cache: prefer id/name/automation-id; fall back to a label hash.
  function fieldSignature(el) {
    const id = el.getAttribute("data-automation-id") || el.id || el.getAttribute("name") || "";
    if (id) return `${el.tagName.toLowerCase()}#${id}`;
    const label = labelTextFor(el).slice(0, 80).trim().toLowerCase().replace(/\s+/g, " ");
    return `${el.tagName.toLowerCase()}@${label}`;
  }

  function setNativeValue(el, value) {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    if (setter) setter.call(el, value); else el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
  }

  function flashField(el, color = "#c2410c") {
    const prev = el.style.boxShadow;
    el.style.transition = "box-shadow 0.3s";
    el.style.boxShadow = `0 0 0 2px ${color}`;
    setTimeout(() => { el.style.boxShadow = prev; }, 900);
  }

  function attachFile(input, file) {
    try {
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.dispatchEvent(new Event("input", { bubbles: true }));
      flashField(input, "#16a34a");
      return true;
    } catch (e) {
      console.error("CareerNow: file attach failed", e);
      return false;
    }
  }

  function decodeBase64ToFile(meta) {
    if (!meta) return null;
    try {
      const bin = atob(meta.base64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new File([arr], meta.name, { type: meta.mime || "application/octet-stream" });
    } catch (e) { console.error("CareerNow: decode resume failed", e); return null; }
  }

  function autofill({ payload, resumeFile, fieldMap }) {
    const inputs = Array.from(document.querySelectorAll("input, textarea")).filter(isFillable);
    const used = new Set();
    const learned = {};
    let filled = 0;

    // Pass 1 — replay cache
    for (const el of inputs) {
      const sig = fieldSignature(el);
      const key = fieldMap?.[sig];
      if (!key) continue;
      if (used.has(key) && key !== "skills") continue;
      const value = payload[key];
      if (!value || el.value) continue;
      setNativeValue(el, value); flashField(el); used.add(key); filled++;
    }

    // Pass 2 — heuristic match for the rest
    for (const el of inputs) {
      if (el.value) continue;
      const label = labelTextFor(el);
      const key = matchKey(label);
      if (!key) continue;
      if (used.has(key) && key !== "skills") continue;
      const value = payload[key];
      if (!value) continue;
      setNativeValue(el, value); flashField(el); used.add(key); filled++;
      learned[fieldSignature(el)] = key;
    }

    // Fallback for a generic "name" field
    if (!used.has("firstName") && !used.has("lastName") && !used.has("fullName") && payload.fullName) {
      const candidate = inputs.find((el) => /name/i.test(labelTextFor(el)) && !el.value);
      if (candidate) { setNativeValue(candidate, payload.fullName); flashField(candidate); filled++; learned[fieldSignature(candidate)] = "fullName"; }
    }

    // File inputs — attach resume to ones that look like resume/cv uploads
    let attached = false;
    const file = decodeBase64ToFile(resumeFile);
    if (file) {
      const fileInputs = Array.from(document.querySelectorAll('input[type="file"]')).filter(isFileInput);
      for (const fi of fileInputs) {
        if (fi.files && fi.files.length) continue;
        const label = labelTextFor(fi);
        if (/resume|cv|curriculum|attach/i.test(label) || fileInputs.length === 1) {
          if (attachFile(fi, file)) { attached = true; break; }
        }
      }
    }

    return { filled, attached, learned };
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type !== "CN_AUTOFILL") return false;
    try {
      const { filled, attached, learned } = autofill(msg);
      sendResponse({ ok: true, filled, attached, learned });
    } catch (e) {
      sendResponse({ ok: false, error: e?.message || "Autofill failed" });
    }
    return true;
  });
})();