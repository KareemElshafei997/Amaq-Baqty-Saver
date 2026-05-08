document.addEventListener('DOMContentLoaded', () => {
    const toggleCheckbox = document.getElementById('toggle-extension');
    const statusText = document.getElementById('status-text');

    // Load current state
    chrome.storage.local.get(['isEnabled'], (result) => {
        const isEnabled = result.isEnabled !== false; // Default is true
        toggleCheckbox.checked = isEnabled;
        updateStatusText(isEnabled);
    });

    // Listen for toggle changes
    toggleCheckbox.addEventListener('change', () => {
        const isEnabled = toggleCheckbox.checked;
        chrome.storage.local.set({ isEnabled: isEnabled }, () => {
            updateStatusText(isEnabled);
        });
    });

    function updateStatusText(isEnabled) {
        statusText.textContent = isEnabled ? 'الإضافة مفعلة' : 'الإضافة معطلة';
        statusText.style.color = isEnabled ? '#00d2ff' : '#94a3b8';
    }
});
