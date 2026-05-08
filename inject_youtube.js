(function() {
    let enabled = true;

    window.addEventListener('message', (event) => {
        if (event.source !== window) return;
        if (event.data && event.data.type === 'AMAQ_SAVER_STATE_CHANGED') {
            enabled = event.data.enabled;
        }
    });

    function setQuality() {
        if (!enabled) return;
        
        const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        if (player && typeof player.setPlaybackQualityRange === 'function') {
            // "tiny" corresponds to 144p on YouTube
            player.setPlaybackQualityRange('tiny', 'tiny'); 
            
            if (typeof player.setPlaybackQuality === 'function') {
                player.setPlaybackQuality('tiny');
            }
        }
        
        try {
            const now = Date.now();
            window.localStorage.setItem('yt-player-quality', JSON.stringify({
                data: 'tiny',
                expiration: now + 86400000,
                creation: now
            }));
        } catch (e) {}
    }

    setInterval(setQuality, 2000);
    
    window.addEventListener('yt-navigate-finish', setQuality);
    
    // Initial call
    setQuality();
})();
