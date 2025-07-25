/* ===== OPTIMIZED PARTICLE SYSTEM ===== */

// Create colorful floating particles with performance optimizations
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const colors = ['purple', 'blue', 'pink', 'cyan', 'violet'];
    let particleCount = 0;
    const MAX_PARTICLES = 8; // Reduced from 15 for better performance
    
    // Use requestAnimationFrame for better performance
    function createParticle() {
        if (particleCount >= MAX_PARTICLES) return;
        
        const particle = document.createElement('div');
        particle.className = `particle ${colors[Math.floor(Math.random() * colors.length)]}`;
        
        // Random size between 4px and 7px (reduced range)
        const size = Math.random() * 3 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random horizontal position
        particle.style.left = Math.random() * 100 + '%';
        
        // Fixed animation duration for consistency
        particle.style.animationDuration = '16s';
        
        // Random delay
        particle.style.animationDelay = Math.random() * 3 + 's';
        
        // Performance optimizations
        particle.style.willChange = 'transform, opacity';
        particle.style.transform = 'translateZ(0)'; // Hardware acceleration
        
        particlesContainer.appendChild(particle);
        particleCount++;
        
        // Remove particle after animation with cleanup
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                particleCount--;
            }
        }, 18000); // Reduced timeout
    }
    
    // Create initial particles with staggered timing
    for (let i = 0; i < 6; i++) {
        setTimeout(createParticle, i * 1000);
    }
    
    // Continue creating particles less frequently
    setInterval(createParticle, 2000); // Increased interval
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
});
