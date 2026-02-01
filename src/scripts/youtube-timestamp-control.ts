// YouTube Timestamp Control
// This script enables clicking on timestamp links to control YouTube video playback
// Works with @astro-community/astro-embed-youtube which uses lite-youtube web component

/**
 * Parse timestamp from format HH:MM:SS or MM:SS to seconds
 */
function parseTimestamp(timestamp: string): number {
  const parts = timestamp.split(':').map(Number);
  
  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    // SS
    return parts[0];
  }
  
  return 0;
}

/**
 * Get the lite-youtube element and its video ID
 */
function getLiteYouTube(): HTMLElement | null {
  return document.querySelector('lite-youtube');
}

/**
 * Get or wait for the iframe inside lite-youtube
 */
function getYouTubeIframe(): HTMLIFrameElement | null {
  const liteYouTube = getLiteYouTube();
  if (!liteYouTube) return null;
  return liteYouTube.querySelector('iframe');
}

/**
 * Activate the lite-youtube player at a specific timestamp
 * lite-youtube loads the iframe when clicked, we need to trigger it with the start parameter
 */
function playAtTimestamp(seconds: number) {
  const liteYouTube = getLiteYouTube();
  
  if (!liteYouTube) {
    console.log('No lite-youtube element found');
    return;
  }

  const videoId = liteYouTube.getAttribute('videoid');
  if (!videoId) {
    console.log('No video ID found on lite-youtube element');
    return;
  }

  // Check if iframe already exists (video was already activated)
  let iframe = getYouTubeIframe();
  
  if (iframe && iframe.contentWindow) {
    // Video is already playing, we need to seek using the iframe src
    // The postMessage API requires enablejsapi=1 which lite-youtube doesn't add by default
    // So we'll update the iframe src directly with the new start time
    const currentSrc = iframe.src;
    const url = new URL(currentSrc);
    url.searchParams.set('start', seconds.toString());
    url.searchParams.set('autoplay', '1');
    
    // Only reload if we're actually changing the time significantly
    // to avoid unnecessary reloads
    iframe.src = url.toString();
    
    console.log(`Seeking to ${seconds} seconds by updating iframe src`);
  } else {
    // Video not yet activated - update the params to include start time and activate
    liteYouTube.setAttribute('params', `start=${seconds}&autoplay=1`);
    
    // Trigger the click to load the iframe
    (liteYouTube as any).click();
    
    console.log(`Starting video at ${seconds} seconds`);
  }

  // Scroll to video
  liteYouTube.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Set up click handlers for timestamp links
 */
function setupTimestampLinks() {
  // Find all links that match the timestamp pattern
  const timestampLinks = document.querySelectorAll('a[href^="#timestamp-"]');
  
  if (timestampLinks.length === 0) {
    return;
  }

  timestampLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      
      const href = (link as HTMLAnchorElement).getAttribute('href');
      if (!href) return;

      // Extract timestamp from href (e.g., #timestamp-00:01:56)
      const timestampMatch = href.match(/#timestamp-(\d{2}:\d{2}:\d{2})/);
      
      if (timestampMatch) {
        const timestamp = timestampMatch[1];
        const seconds = parseTimestamp(timestamp);
        
        console.log(`Seeking to ${timestamp} (${seconds} seconds)`);
        playAtTimestamp(seconds);
      }
    });
  });
  
  console.log(`YouTube timestamp control: Set up ${timestampLinks.length} timestamp links`);
}

/**
 * Initialize everything when DOM is ready
 */
function init() {
  // Check if we're on a page with both YouTube video and timestamp links
  const hasYouTube = getLiteYouTube() || document.querySelector('iframe[src*="youtube.com"]');
  const hasTimestamps = document.querySelector('a[href^="#timestamp-"]');
  
  if (!hasYouTube || !hasTimestamps) {
    return;
  }

  setupTimestampLinks();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
