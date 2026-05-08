chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['isEnabled'], (result) => {
    if (result.isEnabled === undefined) {
      chrome.storage.local.set({ isEnabled: true });
    }
  });
});
