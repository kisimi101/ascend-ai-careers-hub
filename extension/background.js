// Service worker — keeps the extension alive for messaging.
chrome.runtime.onInstalled.addListener(() => {
  console.log("CareerNow Autofill installed");
});

// Allow popup/content scripts to ping background if needed.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "CN_PING") {
    sendResponse({ ok: true });
    return true;
  }
  return false;
});