let isExtensionEnabled = true;

chrome.storage.local.get(['isFacebookEnabled'], (result) => {
    isExtensionEnabled = result.isFacebookEnabled !== false;
    if (isExtensionEnabled) {
        preventFacebookAutoplay();
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.isFacebookEnabled !== undefined) {
        isExtensionEnabled = changes.isFacebookEnabled.newValue;
        if (isExtensionEnabled) {
            preventFacebookAutoplay();
        } else {
            allowFacebookAutoplay();
        }
    }
});

let observer = null;
let lastUserInteraction = 0;

window.addEventListener('click', () => {
    lastUserInteraction = Date.now();
}, true);

function preventFacebookAutoplay() {
    if (observer) return;

    observer = new MutationObserver((mutations) => {
        if (!isExtensionEnabled) return;
        
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.dataset.amaqHandled) {
                video.dataset.amaqHandled = 'true';
                
                if (video.hasAttribute('autoplay')) {
                    video.removeAttribute('autoplay');
                }
                
                video.addEventListener('play', (e) => {
                    if (!video.dataset.userClicked && isExtensionEnabled) {
                        // If play is triggered within 1.5 seconds of a click, assume user intended to play
                        if (Date.now() - lastUserInteraction < 1500) {
                            video.dataset.userClicked = 'true';
                        } else {
                            video.pause();
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function allowFacebookAutoplay() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        delete video.dataset.amaqHandled;
        delete video.dataset.userClicked;
    });
}
