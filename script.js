// Fixed tick sound looping issue and enables background music

let tickSound = new Audio('path/to/tick-sound.mp3');
let backgroundMusic = new Audio('path/to/background-music.mp3');

function playTickSound() {
    if (!tickSound.paused) {
        tickSound.currentTime = 0; // restart sound if it's still playing
    }
    tickSound.play();
}

function playBackgroundMusic() {
    backgroundMusic.loop = true; // loop background music
    backgroundMusic.play();
}

// Call functions as needed. For example:
// playBackgroundMusic();
// setInterval(playTickSound, 1000);