// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to fetch and load HTML components
function loadComponent(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        });
}

// Function to load videos from JSON
function loadVideos(category, containerId) {
    fetch('../videos.json')
        .then(response => response.json())
        .then(data => {
            const videos = data[category];
            if (videos) {
                const videoGrid = document.getElementById(containerId);
                videos.forEach(video => {
                    const videoContainer = document.createElement('div');
                    videoContainer.classList.add('video-container');
                    if (video.url.includes('tiktok')) {
                        videoContainer.classList.add('tiktok-video');
                    }

                    let embedUrl = '';
                    if (video.url.includes('youtube.com/shorts')) {
                        const videoId = video.url.split('/').pop().split('?')[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    } else if (video.url.includes('youtu.be')) {
                        const videoId = video.url.split('/').pop().split('?')[0];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    } else if (video.url.includes('youtube.com/watch')) {
                        const videoId = new URL(video.url).searchParams.get('v');
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    } else if (video.url.includes('tiktok')) {
                        // TikTok embedding is more complex and might require their oEmbed API
                        // For now, we'll just link to the video
                        embedUrl = video.url;
                    }

                    videoContainer.innerHTML = `
                        <h3>${video.title}</h3>
                        <div class="video-wrapper">
                            <iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                        <p>${video.description}</p>
                    `;
                    videoGrid.appendChild(videoContainer);
                });
            }
        });
}

// Load header, footer, and side menu
window.addEventListener('DOMContentLoaded', () => {
    // Correctly determine the base path for component files
    const basePath = window.location.pathname.includes('/trump-rallies/') || 
                     window.location.pathname.includes('/2020-election/') || 
                     window.location.pathname.includes('/ashley-biden-diary/') || 
                     window.location.pathname.includes('/biden-family/') || 
                     window.location.pathname.includes('/biden-harris-admin/') || 
                     window.location.pathname.includes('/economic-boom/') || 
                     window.location.pathname.includes('/fake-news/') || 
                     window.location.pathname.includes('/foreign-policy/') || 
                     window.location.pathname.includes('/hunter-biden-laptop/') || 
                     window.location.pathname.includes('/immigration/') || 
                     window.location.pathname.includes('/judicial-appointments/') || 
                     window.location.pathname.includes('/kamala-harris/') || 
                     window.location.pathname.includes('/trump-legal-cases/') ? '..' : '.';

    loadComponent(`${basePath}/header.html`, 'header');
    loadComponent(`${basePath}/side-menu.html`, 'side-menu-container');
    loadComponent(`${basePath}/footer.html`, 'footer');

    // Load videos based on the current page
    const path = window.location.pathname;
    const category = path.split('/').filter(Boolean).pop();
    if (category) {
        loadVideos(category, 'video-grid');
    }
});
