document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollReveal();
    initMessageReveal();
});

// Particle System
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Resize handler
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
            this.size = Math.random() * 2 + 0.5; // Small, elegant size
            this.speedX = Math.random() * 0.5 - 0.25; // Slow movement
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(197, 160, 89, ${Math.random() * 0.5 + 0.1})`; // Gold with alpha
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around screen
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
        const particleCount = Math.min(width * 0.1, 100); // Responsive count
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

// Scroll Reveal Observer
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Message Reveal Interaction
function initMessageReveal() {
    const revealBtn = document.getElementById('reveal-message-btn');
    const messageContainer = document.getElementById('hidden-message');
    const closeBtn = document.getElementById('close-message-btn');
    
    if (revealBtn && messageContainer) {
        revealBtn.addEventListener('click', () => {
            // Trigger Confetti
            triggerConfetti();
            
            // Show Message
            messageContainer.classList.remove('hidden');
            messageContainer.classList.add('visible');
        });
        
        closeBtn.addEventListener('click', () => {
            messageContainer.classList.remove('visible');
            setTimeout(() => {
                messageContainer.classList.add('hidden');
            }, 500); // Wait for fade out if we added one (CSS handles this roughly)
        });
    }
}

function triggerConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        // launch a few confetti from the left edge
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#C5A059', '#E0E0E0', '#FFFFFF'] // Gold, Silver, White
        });
        // and launch a few from the right edge
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#C5A059', '#E0E0E0', '#FFFFFF']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}
