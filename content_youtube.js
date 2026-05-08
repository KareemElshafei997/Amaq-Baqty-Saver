let isExtensionEnabled = true;

chrome.storage.local.get(['isYoutubeEnabled'], (result) => {
    isExtensionEnabled = result.isYoutubeEnabled !== false;
    if (isExtensionEnabled) {
        injectScript();
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.isYoutubeEnabled !== undefined) {
        isExtensionEnabled = changes.isYoutubeEnabled.newValue;
        if (isExtensionEnabled) {
            injectScript();
        } else {
            window.postMessage({ type: 'AMAQ_SAVER_STATE_CHANGED', enabled: false }, '*');
        }
    }
});

function injectScript() {
    if (document.getElementById('amaq-youtube-injector')) {
        window.postMessage({ type: 'AMAQ_SAVER_STATE_CHANGED', enabled: true }, '*');
        return;
    }

    const script = document.createElement('script');
    script.id = 'amaq-youtube-injector';
    script.src = chrome.runtime.getURL('inject_youtube.js');
    (document.head || document.documentElement).appendChild(script);
}
