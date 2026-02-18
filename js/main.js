document.addEventListener('DOMContentLoaded', () => {
    initParticles();

    // Initialize LightGallery for the finale
    lightGallery(document.getElementById('lightgallery'), {
        plugins: [lgZoom, lgThumbnail],
        speed: 500,
    });

    initStageSystem();
});

// --- STAGE SYSTEM LOGIC ---
function initStageSystem() {
    // DOM Elements
    const btnStartMission = document.getElementById('start-mission-btn');
    const btnNextCard = document.getElementById('next-card-btn');
    const btnReplay = document.getElementById('replay-btn');

    const stageIntro = document.getElementById('stage-intro');
    const stageBriefing = document.getElementById('stage-briefing');
    const stageCelebration = document.getElementById('stage-celebration');

    const cards = document.querySelectorAll('.mission-card');

    let currentCardIndex = 0;

    // Transition: Intro -> Briefing
    if (btnStartMission) {
        btnStartMission.addEventListener('click', () => {
            switchStage(stageIntro, stageBriefing);
        });
    }

    // Interaction: Briefing Cards (Sequential)
    if (btnNextCard) {
        btnNextCard.addEventListener('click', () => {
            // If there are more cards to show
            if (currentCardIndex < cards.length - 1) {
                // Animate current card out
                cards[currentCardIndex].classList.remove('active');
                cards[currentCardIndex].classList.add('exit');

                // Increment index
                currentCardIndex++;

                // Animate next card in
                setTimeout(() => {
                    cards[currentCardIndex].classList.add('active');
                }, 300); // Slight delay for overlap effect

                // Change button text on last card
                if (currentCardIndex === cards.length - 1) {
                    btnNextCard.textContent = "Complete Mission >>";
                }
            } else {
                // All cards done, Transition: Briefing -> Celebration
                switchStage(stageBriefing, stageCelebration);
                triggerCelebration();
            }
        });
    }

    // Transition: Replay (Reset)
    if (btnReplay) {
        btnReplay.addEventListener('click', () => {
            // Reset Cards
            cards.forEach((card, index) => {
                card.classList.remove('active', 'exit');
                if (index === 0) card.classList.add('active');
            });
            currentCardIndex = 0;
            btnNextCard.textContent = "Next Directive >>";

            // Go back to Intro
            switchStage(stageCelebration, stageIntro);
        });
    }
}

function switchStage(currentStage, nextStage) {
    // Fade out current
    if (currentStage) {
        currentStage.classList.remove('active');
    }

    // Wait for transition, then show next
    setTimeout(() => {
        if (nextStage) {
            nextStage.classList.add('active');
        }
    }, 600);
}

function triggerCelebration() {
    // Fire Confetti
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#D4AF37', '#1A253A', '#FFFFFF']
        });
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#D4AF37', '#1A253A', '#FFFFFF']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// --- PARTICLE SYSTEM (Unchanged) ---
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            // Particles: Dark Navy with low opacity for subtle contrast on cream background
            this.color = `rgba(26, 37, 58, ${Math.random() * 0.3 + 0.1})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
            if (this.y > height) this.y = 0;
            if (this.y < 0) this.y = height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        const particleCount = Math.min(width * 0.1, 100);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();
}
