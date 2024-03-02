const playBtn = document.getElementById("play-button");
const muteBtn = document.getElementById("volume-icon");
const fullscreenBtn = document.getElementById("expand-button");
const player = document.querySelector(".player");
const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const speedSelect = document.querySelector(".player-speed");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const currentTime = document.querySelector(".time-elapsed");
const videoduration = document.querySelector(".time-duration");

// Play & Pause ----------------------------------- //
function showPlayIcon() {
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
}

function tooglePlay() {
  if (video.paused) {
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.setAttribute("title", "Pause");
    video.play();
  } else {
    showPlayIcon();
    video.pause();
  }
}

// Progress Bar ---------------------------------- //

function getDisplayTime(time) {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(Math.ceil(time % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateProgress(e) {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentTime.textContent = getDisplayTime(video.currentTime) + " / ";
}

function setProgress(e) {
  const percent = e.offsetX / progressRange.clientWidth;
  video.currentTime = percent * video.duration;
}

function loadVideoDuration() {
  videoduration.textContent = getDisplayTime(video.duration);
  updateProgress();
}

// Volume Controls --------------------------- //
let lastVolume = 1;

function updateVolume(e) {
  let p = e.offsetX / volumeRange.clientWidth;
  if (p > 0.95) {
    p = 1;
  } else if (p < 0.1) {
    p = 0;
  }
  volumeBar.style.width = `${p * 100}%`;
  video.volume = p;

  muteBtn.className = "fa-solid";
  if (p > 0.7) {
    muteBtn.classList.add("fa-volume-up");
  } else if (p < 0.7 && p > 0) {
    muteBtn.classList.add("fa-volume-down");
  } else if (p === 0) {
    muteBtn.classList.add("fa-volume-off");
  }
  lastVolume = p;
}

function toogleMute() {
  if (video.volume || !video.muted) {
    console.log("Hopsa");
    video.volume = 0;
    video.muted = true;
    volumeBar.style.width = `${0}%`;
    muteBtn.classList.add("fa-volume-xmark");
    muteBtn.setAttribute("title", "Unmute");
  } else {
    video.muted = false;
    muteBtn.classList.remove("fa-volume-xmark");
    muteBtn.setAttribute("title", "Mute");
    video.volume = lastVolume === 0 ? 0.1 : lastVolume;
    volumeBar.style.width = `${video.volume * 100}%`;
  }
}

// Change Playback Speed -------------------- //
function changeVideoSpeed() {
  video.playbackRate = speedSelect.value;
}

// Fullscreen ------------------------------- //
let isFullscreen = false;
function switchToFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
  video.classList.add("video-fullscreen");
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
  video.classList.remove("video-fullscreen");
}

playBtn.addEventListener("click", tooglePlay);
muteBtn.addEventListener("click", toogleMute);
video.addEventListener("ended", showPlayIcon);
video.addEventListener("timeupdate", updateProgress);
video.addEventListener("loadedmetadata", loadVideoDuration);
progressRange.addEventListener("click", setProgress);
volumeRange.addEventListener("click", updateVolume);
speedSelect.addEventListener("change", changeVideoSpeed);
fullscreenBtn.addEventListener("click", () => {
  if (!isFullscreen) {
    switchToFullscreen(player);
  } else {
    closeFullscreen();
  }

  isFullscreen = !isFullscreen;
});
