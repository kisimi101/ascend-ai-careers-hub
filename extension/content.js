// CareerNow Autofill — content script
// Strategy: score every visible form field by label/placeholder/name/aria,
// then map the highest-scoring field per profile key. Dispatch input + change
// events so React/Vue/Angular state updates correctly.

(function () {
  const FIELD_RULES = [
    { key: "firstName",      patterns: [/first[\s_-]?name/i, /given[\s_-]?name/i, /\bfname\b/i] },
    { key: "lastName",       patterns: [/last[\s_-]?name/i, /family[\s_-]?name/i, /surname/i, /\blname\b/i] },
    { key: "fullName",       patterns: [/full[\s_-]?name/i, /^name$/i, /your name/i, /legal name/i] },
    { key: "email",          patterns: [/e[\s_-]?mail/i] },
    { key: "phone",          patterns: [/phone/i, /mobile/i, /telephone/i, /\btel\b/i] },
    { key: "location",       patterns: [/location/i, /\bcity\b/i, /address/i, /where.*based/i] },
    { key: "linkedin",       patterns: [/linkedin/i, /linked[\s_-]?in/i] },
    { key: "website",        patterns: [/website/i, /portfolio/i, /personal site/i, /github/i, /url/i] },
    { key: "currentCompany", patterns: [/current.*(company|employer)/i, /^company$/i, /employer/i] },
    { key: "currentTitle",   patterns: [/current.*(title|position|role)/i, /job title/i, /^title$/i] },
    { key: "school",         patterns: [/school/i, /university/i, /college/i, /institution/i, /education/i] },
    { key: "degree",         patterns: [/degree/i, /qualification/i] },
    { key: "summary",        patterns: [/cover letter/i, /summary/i, /about you/i, /tell us about/i, /why.*interested/i] },
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

  function labelTextFor(el) {
    const parts = [];
    if (el.id) {
      const lbl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (lbl) parts.push(lbl.innerText);
    }
    const wrappingLabel = el.closest("label");
    if (wrappingLabel) parts.push(wrappingLabel.innerText);
    const aria = el.getAttribute("aria-label");
    if (aria) parts.push(aria);
    const ariaBy = el.getAttribute("aria-labelledby");
    if (ariaBy) {
      ariaBy.split(/\s+/).forEach((id) => {
        const n = document.getElementById(id);
        if (n) parts.push(n.innerText);
      });
    }
    parts.push(el.getAttribute("placeholder") || "");
    parts.push(el.getAttribute("name") || "");
    parts.push(el.getAttribute("id") || "");
    parts.push(el.getAttribute("data-automation-id") || ""); // Workday
    parts.push(el.getAttribute("data-qa") || "");
    return parts.filter(Boolean).join(" | ");
  }

  function matchKey(label) {
    for (const rule of FIELD_RULES) {
      if (rule.patterns.some((re) => re.test(label))) return rule.key;
    }
    return null;
  }

  function setNativeValue(el, value) {
    const proto = el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    if (setter) setter.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
  }

  function flashField(el) {
    const prev = el.style.boxShadow;
    el.style.transition = "box-shadow 0.3s";
    el.style.boxShadow = "0 0 0 2px #c2410c";
    setTimeout(() => { el.style.boxShadow = prev; }, 900);
  }

  function autofill(payload) {
    const inputs = Array.from(document.querySelectorAll("input, textarea")).filter(isFillable);
    const used = new Set();
    let filled = 0;

    // First pass: exact key matches
    for (const el of inputs) {
      const label = labelTextFor(el);
      const key = matchKey(label);
      if (!key) continue;
      if (used.has(key) && key !== "skills") continue;
      const value = payload[key];
      if (!value || el.value) continue;
      setNativeValue(el, value);
      flashField(el);
      used.add(key);
      filled++;
    }

    // Fallback: a "name" field with neither first nor last filled → use fullName
    if (!used.has("firstName") && !used.has("lastName") && !used.has("fullName") && payload.fullName) {
      const candidate = inputs.find((el) => /name/i.test(labelTextFor(el)) && !el.value);
      if (candidate) {
        setNativeValue(candidate, payload.fullName);
        flashField(candidate);
        filled++;
      }
    }

    return filled;
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type !== "CN_AUTOFILL") return false;
    try {
      const filled = autofill(msg.payload || {});
      sendResponse({ ok: true, filled });
    } catch (e) {
      sendResponse({ ok: false, error: e?.message || "Autofill failed" });
    }
    return true;
  });
})();