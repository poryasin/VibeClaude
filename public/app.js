const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const hint = document.getElementById('hint');
const counter = document.getElementById('counter');
const message = document.getElementById('message');
const muteButton = document.getElementById('mute-button');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const plants = [];
const stars = [];
let plantCount = 0;
let lastPlantTime = 0;
let hintTimeout;
let hasInteracted = false;

const messages = [
    "this is your space",
    "nothing you make here is wrong",
    "you can come back anytime",
    "it's okay to just watch",
    "there's no hurry",
    "each one is different",
    "they grow at their own pace",
    "this is enough",
    "you're doing fine",
    "breathing is enough for now",
    "small things matter",
    "you don't need permission to rest"
];

// Initialize stars
for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2,
        alpha: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005
    });
}

// Background Music System
class BackgroundMusic {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.isMuted = false;

        // 🔵 REPLACE THIS URL WITH YOUR MUSIC FILE
        this.musicUrl = '/in the sea (extended).mp4'; // Local file in public folder
    }

    init() {
        if (this.audio) return;

        console.log('🎵 Initializing music system...');
        console.log('📁 Music file:', this.musicUrl);

        this.audio = new Audio();
        this.audio.src = this.musicUrl;
        this.audio.loop = true;
        this.audio.volume = 0; // Start silent
        this.audio.preload = 'auto';

        // Add audio to DOM for debugging
        this.audio.id = 'background-music';
        this.audio.style.display = 'none';
        document.body.appendChild(this.audio);
        console.log('🔊 Audio element added to DOM');

        this.audio.addEventListener('canplaythrough', () => {
            console.log('✅ Music loaded and ready to play!');
            console.log('📏 Duration:', this.audio.duration, 'seconds');
        });

        this.audio.addEventListener('error', (e) => {
            console.log('❌ ERROR loading music!');
            console.log('Error:', e);
            console.log('Error code:', this.audio.error);
            console.log('Network state:', this.audio.networkState);
        });

        this.audio.addEventListener('loadeddata', () => {
            console.log('✅ Music data loaded');
        });

        this.audio.addEventListener('loadstart', () => {
            console.log('⏳ Starting to load music...');
        });
    }

    start() {
        console.log('▶️ Start button clicked!');

        if (!this.audio) {
            this.init();
        }

        if (!this.isPlaying) {
            this.isPlaying = true;
            console.log('▶️ Attempting to play music...');

            // Fade in volume
            this.fadeIn();

            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('✅ Music is now playing!');
                }).catch(e => {
                    console.log('❌ Play failed!');
                    console.log('Error:', e);
                    console.log('Message:', e.message);
                });
            }

            this.updateMuteButton();
        } else {
            console.log('⚠️ Music already playing');
        }
    }

    stop() {
        if (this.isPlaying) {
            this.fadeOut();
            setTimeout(() => {
                this.audio.pause();
                this.isPlaying = false;
            }, 3000);
            this.updateMuteButton();
        }
    }

    fadeIn() {
        const targetVolume = this.isMuted ? 0 : 0.5; // Volume at 50%
        const duration = 3000; // 3 second fade in
        const steps = 30;
        const increment = targetVolume / steps;
        const stepDuration = duration / steps;
        let currentStep = 0;

        console.log('🔊 Fading music in to volume:', targetVolume);

        const fade = setInterval(() => {
            currentStep++;
            if (currentStep >= steps) {
                this.audio.volume = targetVolume;
                clearInterval(fade);
                console.log('✅ Music volume:', targetVolume);
            } else {
                this.audio.volume = currentStep * increment;
            }
        }, stepDuration);
    }

    fadeOut() {
        const duration = 3000; // 3 second fade out
        const startVolume = this.audio.volume;
        const steps = 50;
        const decrement = startVolume / steps;
        const stepDuration = duration / steps;
        let currentStep = 0;

        const fade = setInterval(() => {
            currentStep++;
            if (currentStep >= steps) {
                this.audio.volume = 0;
                clearInterval(fade);
            } else {
                this.audio.volume = startVolume - (currentStep * decrement);
            }
        }, stepDuration);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;

        if (this.isMuted) {
            this.fadeOut();
            console.log('Music muted');
        } else {
            this.fadeIn();
            console.log('Music unmuted');
        }

        this.updateMuteButton();
    }

    updateMuteButton() {
        if (!this.isPlaying) {
            muteButton.classList.remove('muted');
            muteButton.setAttribute('aria-label', 'Play Music');
        } else if (this.isMuted) {
            muteButton.classList.add('muted');
            muteButton.setAttribute('aria-label', 'Unmute');
        } else {
            muteButton.classList.remove('muted');
            muteButton.setAttribute('aria-label', 'Mute');
        }
    }

    setMusicUrl(url) {
        this.musicUrl = url;
        if (this.audio) {
            const wasPlaying = this.isPlaying;
            this.audio.src = url;
            if (wasPlaying) {
                this.audio.play();
            }
        }
    }
}

// Initialize background music
const backgroundMusic = new BackgroundMusic();
backgroundMusic.updateMuteButton(); // Set initial button state

class Plant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.age = 0;
        this.maxAge = 200 + Math.random() * 150;
        this.stemHeight = 0;
        this.maxStemHeight = 40 + Math.random() * 80;
        this.petalCount = Math.floor(Math.random() * 3) + 4;
        this.petalSize = 0;
        this.maxPetalSize = 8 + Math.random() * 12;
        this.hue = Math.random() * 60 + 200;
        this.swayOffset = Math.random() * Math.PI * 2;
        this.glowIntensity = 0;
        this.leaves = [];
        this.leafCount = Math.floor(Math.random() * 2) + 2;

        for (let i = 0; i < this.leafCount; i++) {
            this.leaves.push({
                height: (i + 1) * (this.maxStemHeight / (this.leafCount + 1)),
                side: i % 2 === 0 ? -1 : 1,
                size: 0
            });
        }
    }

    update() {
        if (this.age < this.maxAge) {
            this.age++;

            const growthProgress = this.age / this.maxAge;
            this.stemHeight = this.maxStemHeight * Math.min(growthProgress * 2, 1);

            if (growthProgress > 0.4) {
                this.petalSize = this.maxPetalSize * Math.min((growthProgress - 0.4) * 1.6, 1);
            }

            this.leaves.forEach(leaf => {
                if (this.stemHeight > leaf.height) {
                    leaf.size = Math.min(leaf.size + 0.1, 8);
                }
            });

            if (growthProgress > 0.6) {
                this.glowIntensity = Math.min((growthProgress - 0.6) * 2.5, 0.6);
            }
        }
    }

    draw(time) {
        const sway = Math.sin(time * 0.001 + this.swayOffset) * 3;

        // Stem
        ctx.strokeStyle = `hsla(${this.hue - 30}, 40%, 35%, 0.8)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.quadraticCurveTo(
            this.x + sway * 0.5,
            this.y - this.stemHeight * 0.5,
            this.x + sway,
            this.y - this.stemHeight
        );
        ctx.stroke();

        // Leaves
        this.leaves.forEach(leaf => {
            if (leaf.size > 0) {
                const leafY = this.y - leaf.height;
                const leafX = this.x + sway * (leaf.height / this.stemHeight) + leaf.side * 8;

                ctx.fillStyle = `hsla(${this.hue - 30}, 45%, 40%, 0.6)`;
                ctx.beginPath();
                ctx.ellipse(leafX, leafY, leaf.size, leaf.size * 0.6, leaf.side * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Flower
        if (this.petalSize > 0) {
            const flowerX = this.x + sway;
            const flowerY = this.y - this.stemHeight;

            // Glow
            if (this.glowIntensity > 0) {
                const gradient = ctx.createRadialGradient(flowerX, flowerY, 0, flowerX, flowerY, this.maxPetalSize * 2);
                gradient.addColorStop(0, `hsla(${this.hue}, 70%, 70%, ${this.glowIntensity * 0.4})`);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(flowerX - this.maxPetalSize * 2, flowerY - this.maxPetalSize * 2,
                    this.maxPetalSize * 4, this.maxPetalSize * 4);
            }

            // Petals
            for (let i = 0; i < this.petalCount; i++) {
                const angle = (Math.PI * 2 / this.petalCount) * i + time * 0.0002;
                const px = flowerX + Math.cos(angle) * this.petalSize * 0.7;
                const py = flowerY + Math.sin(angle) * this.petalSize * 0.7;

                ctx.fillStyle = `hsla(${this.hue}, 60%, 65%, 0.7)`;
                ctx.beginPath();
                ctx.arc(px, py, this.petalSize, 0, Math.PI * 2);
                ctx.fill();
            }

            // Center
            ctx.fillStyle = `hsla(${this.hue + 20}, 70%, 75%, 0.9)`;
            ctx.beginPath();
            ctx.arc(flowerX, flowerY, this.petalSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function showMessage(msg) {
    message.textContent = msg;
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 4000);
}

function hideHint() {
    hint.classList.remove('show');
}

function updateCounter() {
    if (plantCount > 0) {
        counter.textContent = `${plantCount} ${plantCount === 1 ? 'seed' : 'seeds'} planted`;
    }
}

canvas.addEventListener('click', (e) => {
    const now = Date.now();

    hasInteracted = true;        // ✅ บอกว่าผู้ใช้เคยคลิกแล้ว
    hideHint();                  // ซ่อนทันที
    hint.classList.remove('show');

    if (now - lastPlantTime < 300) return;
    lastPlantTime = now;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    plants.push(new Plant(x, y));
    plantCount++;
    updateCounter();

    if (plantCount === 1 || plantCount === 5 || plantCount === 12 || plantCount === 25) {
        const msgIndex = Math.floor(Math.random() * messages.length);
        showMessage(messages[msgIndex]);
    }

    clearTimeout(hintTimeout);
});


function resetHintTimer() {
    clearTimeout(hintTimeout);

    if (plantCount === 0 && !hasInteracted) {
        hintTimeout = setTimeout(() => {
            hint.classList.add('show');
        }, 2000);
    }
}


canvas.addEventListener('mousemove', () => {
    hideHint();
    resetHintTimer();
});

function animate() {
    const time = Date.now();

    ctx.fillStyle = 'rgba(10, 10, 20, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    stars.forEach(star => {
        star.alpha += Math.sin(time * star.twinkleSpeed) * 0.002;
        star.alpha = Math.max(0.1, Math.min(0.7, star.alpha));

        ctx.fillStyle = `rgba(200, 180, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Update and draw plants
    plants.forEach(plant => {
        plant.update();
        plant.draw(time);
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Music button functionality - click to start/pause
muteButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Don't plant when clicking music button

    if (!backgroundMusic.isPlaying) {
        backgroundMusic.start();
    } else {
        backgroundMusic.toggleMute();
    }
});

resetHintTimer();
animate();