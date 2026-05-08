chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['isYoutubeEnabled', 'isFacebookEnabled'], (result) => {
    let updates = {};
    if (result.isYoutubeEnabled === undefined) updates.isYoutubeEnabled = true;
    if (result.isFacebookEnabled === undefined) updates.isFacebookEnabled = true;
    if (Object.keys(updates).length > 0) {
      chrome.storage.local.set(updates);
    }
  });
});
