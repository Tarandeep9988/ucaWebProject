// --- script.js ---

// Global variables
let playlists = [];
let currentSongs = [];
let currentIndex = 0;
let audio = new Audio();

// DOM elements
const playlistContainer = document.querySelector(".playlist-cards");
const songListContainer = document.querySelector(".song-list");
const nowPlayingImg = document.querySelector(".current-song-card img");
const nowPlayingTitle = document.querySelector(".song-title");
const nowPlayingArtist = document.querySelector(".song-artist");
const playBtn = document.querySelector(".play img");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const progressBar = document.querySelector(".progress-bar");

// ---------- Load playlists ----------
async function loadPlaylists() {
  try {
    const res = await fetch("playlists.json");
    playlists = await res.json();
    displayPlaylists();
  } catch (error) {
    console.error("Error loading playlists:", error);
  }
}

// ---------- Display playlists ----------
function displayPlaylists() {
  playlistContainer.innerHTML = "";
  playlists.forEach((playlist) => {
    const card = document.createElement("div");
    card.classList.add("playlist-card");
    card.innerHTML = `
      <img src="${playlist.cover}" alt="${playlist.name}">
      <p>${playlist.name}</p>
      <small>${playlist.genre}</small>
    `;
    card.addEventListener("click", () => loadSongs(playlist.songsPath, playlist.cover));
    playlistContainer.appendChild(card);
  });
}

// ---------- Load songs from JSON ----------
async function loadSongs(songsPath, coverImg) {
  try {
    const res = await fetch(songsPath);
    currentSongs = await res.json();
    displaySongs(currentSongs, coverImg);
  } catch (error) {
    console.error("Error loading songs:", error);
  }
}

// ---------- Display songs in sidebar ----------
function displaySongs(songs, coverImg) {
  songListContainer.innerHTML = "";
  songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.classList.add("song-card");
    card.innerHTML = `
      <p class="song-title">${song.title}</p>
      <p class="song-artist">${song.artist}</p>
    `;
    card.addEventListener("click", () => playSong(index, coverImg));
    songListContainer.appendChild(card);
  });
}

// ---------- Play selected song ----------
function playSong(index, coverImg) {
  currentIndex = index;
  const song = currentSongs[index];

  audio.src = song.path;
  audio.play();

  nowPlayingImg.src = coverImg || "./images/music.svg";
  nowPlayingTitle.textContent = song.title;
  nowPlayingArtist.textContent = song.artist;

  playBtn.src = "./images/pause.svg";
}

// ---------- Play/Pause toggle ----------
playBtn.addEventListener("click", () => {
  if (!audio.src) return; // no song loaded yet
  if (audio.paused) {
    audio.play();
    playBtn.src = "./images/pause.svg";
  } else {
    audio.pause();
    playBtn.src = "./images/play.svg";
  }
});

// ---------- Next song ----------
nextBtn.addEventListener("click", () => {
  if (currentSongs.length === 0) return;
  currentIndex = (currentIndex + 1) % currentSongs.length;
  playSong(currentIndex);
});

// ---------- Previous song ----------
prevBtn.addEventListener("click", () => {
  if (currentSongs.length === 0) return;
  currentIndex = (currentIndex - 1 + currentSongs.length) % currentSongs.length;
  playSong(currentIndex);
});

// ---------- Progress bar update ----------
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
  }
});

// ---------- Seek in song ----------
progressBar.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

// ---------- Auto play next ----------
audio.addEventListener("ended", () => {
  nextBtn.click();
});

// ---------- Init ----------
loadPlaylists();
