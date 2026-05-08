document.addEventListener('DOMContentLoaded', () => {
    const toggleMaster = document.getElementById('toggle-master');
    const toggleYoutube = document.getElementById('toggle-youtube');
    const toggleFacebook = document.getElementById('toggle-facebook');
    const appVersionSpan = document.getElementById('app-version');
    const updateBanner = document.getElementById('update-banner');

    const manifestData = chrome.runtime.getManifest();
    const currentVersion = manifestData.version;
    appVersionSpan.textContent = currentVersion;

    fetch('https://raw.githubusercontent.com/KareemElshafei997/Amaq-Baqty-Saver/main/manifest.json', { cache: "no-store" })
        .then(response => response.json())
        .then(data => {
            if (data.version && data.version !== currentVersion) {
                updateBanner.classList.remove('hidden');
            }
        })
        .catch(err => console.log('Error checking for updates:', err));

    function updateMasterToggle() {
        toggleMaster.checked = toggleYoutube.checked && toggleFacebook.checked;
    }

    chrome.storage.local.get(['isYoutubeEnabled', 'isFacebookEnabled'], (result) => {
        toggleYoutube.checked = result.isYoutubeEnabled !== false; 
        toggleFacebook.checked = result.isFacebookEnabled !== false;
        updateMasterToggle();
    });

    toggleMaster.addEventListener('change', () => {
        const isChecked = toggleMaster.checked;
        toggleYoutube.checked = isChecked;
        toggleFacebook.checked = isChecked;
        
        chrome.storage.local.set({ 
            isYoutubeEnabled: isChecked,
            isFacebookEnabled: isChecked
        });
    });

    toggleYoutube.addEventListener('change', () => {
        chrome.storage.local.set({ isYoutubeEnabled: toggleYoutube.checked });
        updateMasterToggle();
    });

    toggleFacebook.addEventListener('change', () => {
        chrome.storage.local.set({ isFacebookEnabled: toggleFacebook.checked });
        updateMasterToggle();
    });
});
