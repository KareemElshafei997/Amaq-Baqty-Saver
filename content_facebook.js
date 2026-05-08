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

function preventFacebookAutoplay() {
    if (observer) return; // Already observing

    observer = new MutationObserver((mutations) => {
        if (!isExtensionEnabled) return;
        
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.dataset.amaqHandled) {
                video.dataset.amaqHandled = 'true';
                
                if (video.hasAttribute('autoplay')) {
                    video.removeAttribute('autoplay');
                }
                
                // Pause automatically triggered play events
                video.addEventListener('play', (e) => {
                    if (!video.dataset.userClicked && isExtensionEnabled) {
                        video.pause();
                    }
                });

                // Detect user interaction to allow playing
                const interactElement = video.closest('div[role="button"]') || video.closest('div[data-video-id]') || video.parentElement;
                if (interactElement) {
                    interactElement.addEventListener('click', () => {
                        video.dataset.userClicked = 'true';
                    }, true);
                }
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
