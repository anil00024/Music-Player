 // DOM Elements
 const musicContainer = document.querySelector('.container');
 const playBtn = document.getElementById('play-btn');
 const prevBtn = document.getElementById('prev-btn');
 const nextBtn = document.getElementById('next-btn');
 const audio = document.createElement('audio');
 const progressContainer = document.querySelector('.progress-container');
 const progress = document.querySelector('.progress');
 const currentTimeEl = document.querySelector('.current-time');
 const durationEl = document.querySelector('.duration');
 const title = document.querySelector('.song-title');
 const artist = document.querySelector('.song-artist');
 const album = document.querySelector('.song-album');
 const coverImage = document.querySelector('.player-img');
 const volumeSlider = document.querySelector('.volume-slider');
 const fileInput = document.getElementById('file-input');
 const playlistContainer = document.querySelector('.playlist');

 // State Variables
 let songs = [
     {
         name: 'Mukkala Mukkabla',
         artist: 'A. R. Rahman',
         album: 'Soundtrack',
         path: 'song1.mp3'
     },
     {
         name: 'Jai Hoo',
         artist: 'A. R. Rahman',
         album: 'Slumdog Millionaire',
         path: 'song2.mp3'
     },
     {
         name: 'Take It Easy',
         artist: 'A. R. Rahman',
         album: 'Eagles',
         path: 'song3.mp3'
     }
 ];
 let songIndex = 0;
 let isPlaying = false;

 // Initialize Player
 function initPlayer() {
     // Load first song
     loadSong(songs[songIndex]);
     
     // Update playlist
     updatePlaylist();
     
     // Set initial volume
     audio.volume = volumeSlider.value;
 }

 // Load song details
 function loadSong(song) {
     title.textContent = song.name;
     artist.textContent = song.artist;
     album.textContent = song.album;
     audio.src = song.path;
 }

 // Play song
 function playSong() {
     musicContainer.classList.add('play');
     coverImage.classList.add('play');
     playBtn.textContent = '⏸';
     isPlaying = true;
     audio.play();
 }

 // Pause song
 function pauseSong() {
     musicContainer.classList.remove('play');
     coverImage.classList.remove('play');
     playBtn.textContent = '▶';
     isPlaying = false;
     audio.pause();
 }

 // Previous song
 function prevSong() {
     songIndex--;
     if (songIndex < 0) {
         songIndex = songs.length - 1;
     }
     loadSong(songs[songIndex]);
     updateActiveSong();
     playSong();
 }

 // Next song
 function nextSong() {
     songIndex++;
     if (songIndex > songs.length - 1) {
         songIndex = 0;
     }
     loadSong(songs[songIndex]);
     updateActiveSong();
     playSong();
 }

 // Update progress bar
 function updateProgress(e) {
     const { duration, currentTime } = e.srcElement;
     
     // Update progress bar width
     const progressPercent = (currentTime / duration) * 100;
     progress.style.width = `${progressPercent}%`;
     
     // Update time displays
     currentTimeEl.textContent = formatTime(currentTime);
     if (duration) {
         durationEl.textContent = formatTime(duration);
     }
 }

 // Format time to MM:SS
 function formatTime(seconds) {
     if (isNaN(seconds)) return '00:00';
     
     const mins = Math.floor(seconds / 60);
     const secs = Math.floor(seconds % 60);
     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
 }

 // Set progress on click
 function setProgress(e) {
     const width = this.clientWidth;
     const clickX = e.offsetX;
     const duration = audio.duration;
     
     audio.currentTime = (clickX / width) * duration;
 }

 // Update playlist UI
 function updatePlaylist() {
     playlistContainer.innerHTML = '';
     
     songs.forEach((song, index) => {
         const playlistItem = document.createElement('div');
         playlistItem.classList.add('playlist-item');
         if (index === songIndex) {
             playlistItem.classList.add('active');
         }
         
         playlistItem.innerHTML = `
             <div class="song-details">
                 <div class="song-name">${song.name}</div>
                 <div class="song-artist-small">${song.artist}</div>
             </div>
             <div class="remove-song">✕</div>
         `;
         
         // Play song when clicked
         playlistItem.addEventListener('click', function(e) {
             if (!e.target.classList.contains('remove-song')) {
                 songIndex = index;
                 loadSong(songs[songIndex]);
                 updateActiveSong();
                 playSong();
             }
         });
         
         // Remove song
         const removeBtn = playlistItem.querySelector('.remove-song');
         removeBtn.addEventListener('click', function() {
             if (songs.length > 1) {
                 songs.splice(index, 1);
                 updatePlaylist();
                 
                 // If the current song was removed, play next song
                 if (index === songIndex) {
                     if (songIndex >= songs.length) {
                         songIndex = 0;
                     }
                     loadSong(songs[songIndex]);
                     if (isPlaying) {
                         playSong();
                     }
                 } else if (index < songIndex) {
                     songIndex--;
                 }
                 updateActiveSong();
             } else {
                 alert('Playlist must contain at least one song!');
             }
         });
         
         playlistContainer.appendChild(playlistItem);
     });
 }

 // Update active song in playlist
 function updateActiveSong() {
     document.querySelectorAll('.playlist-item').forEach((item, index) => {
         if (index === songIndex) {
             item.classList.add('active');
         } else {
             item.classList.remove('active');
         }
     });
 }

 // Add file to playlist
 function addSongToPlaylist(file) {
     const songURL = URL.createObjectURL(file);
     const songName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
     
     const newSong = {
         name: songName,
         artist: 'Unknown Artist',
         album: 'Unknown Album',
         path: songURL
     };
     
     songs.push(newSong);
     updatePlaylist();
 }

 // Event Listeners
 playBtn.addEventListener('click', () => {
     if (isPlaying) {
         pauseSong();
     } else {
         playSong();
     }
 });

 prevBtn.addEventListener('click', prevSong);
 nextBtn.addEventListener('click', nextSong);

 audio.addEventListener('timeupdate', updateProgress);
 audio.addEventListener('ended', nextSong);

 progressContainer.addEventListener('click', setProgress);

 volumeSlider.addEventListener('input', () => {
     audio.volume = volumeSlider.value;
 });

 fileInput.addEventListener('change', (e) => {
     const files = Array.from(e.target.files);
     files.forEach(file => {
         if (file.type.startsWith('audio/')) {
             addSongToPlaylist(file);
         }
     });
     fileInput.value = '';
 });

 // Initialize the player
 initPlayer();