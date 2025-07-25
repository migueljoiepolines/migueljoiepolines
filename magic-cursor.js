document.addEventListener('DOMContentLoaded', () => {
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        const body = document.body;
        body.classList.add('magic-cursor');

        const wand = document.createElement('div');
        wand.className = 'magic-wand';
        body.appendChild(wand);

        let lastX = 0;
        let lastY = 0;
        let isMoving = false;
        let animationFrameId;

        window.addEventListener('mousemove', (e) => {
            lastX = e.clientX;
            lastY = e.clientY;
            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(updateWandPosition);
            }
        });

        function updateWandPosition() {
            if (!isMoving) return;
            
            wand.style.left = `${lastX}px`;
            wand.style.top = `${lastY}px`;
            
            // Create a sparkle on move
            createSparkle(lastX, lastY);

            isMoving = false;
        }

        function createSparkle(x, y) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            body.appendChild(sparkle);

            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;

            // Randomize the direction the sparkle flies out to
            const tx = (Math.random() - 0.5) * 150;
            const ty = (Math.random() - 0.5) * 150;
            sparkle.style.setProperty('--tx', `${tx}px`);
            sparkle.style.setProperty('--ty', `${ty}px`);

            // Remove the sparkle from the DOM after the animation finishes
            sparkle.addEventListener('animationend', () => {
                sparkle.remove();
            });
        }
    }
});
