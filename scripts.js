console.log("YT Music OBS Mode enabled");

document.documentElement.dataset.obsMode = "true";


function replaceThumbnailWithImage() {
  // Target class of thumbnail: 'image style-scope ytmusic-player-bar'
  // Source URL: document.getElementById("song-image").children[0].children[0].src

  document.getElementsByClassName("image style-scope ytmusic-player-bar")[0].src = document.getElementById("song-image").children[0].children[0].src.replace(/\.jpg\?.*/, ".jpg");
}

function setupArtist() {
  const artistElement = document.getElementsByClassName("byline style-scope ytmusic-player-bar complex-string")[0];
  const artists = artistElement.title.replace(/ • .*/, "");

  // Clear existing content 'safely'
  while (artistElement.hasChildNodes()) {
    artistElement.removeChild(artistElement.firstChild);
  }

  artistElement.textContent = artists
}

var lastTitle = "";
function setupScrollingTitles() {
    const titles = document.getElementsByClassName("title style-scope ytmusic-player-bar");

    const title = titles[0];
    const titleText = title.title ? title.title : title.text.runs[0].text;
    
    // Prevent duplicate setup
    if (lastTitle === titleText) {
      return;
    }
    
    lastTitle = titleText;

    // Create wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "obs-scroll-wrapper";

    // Create moving text
    const inner = document.createElement("div");
    inner.className = "obs-scroll-inner";
    inner.textContent = titleText;

    wrapper.appendChild(inner);

    // Clear existing
    while (title.hasChildNodes()) {
      title.removeChild(title.firstChild);
    }
    console.log(title);

    title.appendChild(wrapper);
    
    // Wait 300ms to ensure DOM updates before fixing attribute
    setTimeout(() => {
      title.removeAttribute("is-empty");
      
      const overflow =
        inner.scrollWidth > wrapper.clientWidth;

      if (overflow) {
        const distance =
            inner.scrollWidth - wrapper.clientWidth;

        inner.style.setProperty(
            "--scroll-distance",
            `-${distance}px`
        );

        // Optional:
        // Scale duration based on text length
        const duration = Math.max(distance / 25, 8);

        inner.style.animationDuration =
            `${duration}s`;

        inner.classList.add("animate");
      }
    }, 300);

    setupArtist();
    replaceThumbnailWithImage();
}

function ensureSongMode() {
  const songModeButton = document.getElementsByClassName("song-button style-scope ytmusic-av-toggle")[0];
  if (songModeButton.getAttribute("aria-pressed") === "true")
      return;
  document.getElementsByClassName("song-button style-scope ytmusic-av-toggle")[0].click();
}

// Initial
ensureSongMode();
setupScrollingTitles();
setupScrollingTitles();
setupScrollingTitles();

// YTMusic is SPA-based, so observe changes
const observer = new MutationObserver(() => {
    setupScrollingTitles();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});