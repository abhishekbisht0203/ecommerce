// animations.js

// GSAP Animations and helpers

// Heart pop animation for wishlist
window.animateHeartPop = function(element) {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(element, 
            { scale: 1 }, 
            { scale: 1.5, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" }
        );
    } else {
        // Fallback CSS animation
        element.style.transform = 'scale(1.5)';
        element.style.transition = 'transform 0.15s ease-in-out';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
};

// Initialize animations on DOM load
document.addEventListener("DOMContentLoaded", () => {
    // Card hover effects using GSAP (optional if not fully handled by CSS)
    if (typeof gsap !== 'undefined') {
        const cards = document.querySelectorAll('.card-hover');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -5, duration: 0.3, ease: "power2.out", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)" });
            });
        });
    }
});
