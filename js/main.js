document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
});
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initMobileMenu();
    initSmoothScroll();
    initStickyNav();
});

/**
 * Slider Interaction — Width-Based (Industry Standard)
 * Logic: Sliding RIGHT increases Modern (Teal) area
 */
function initSlider() {
    const sliderInput = document.getElementById('sliderInput');
    const layerModern = document.getElementById('layerModern');
    const sliderHandle = document.getElementById('sliderHandle');

    // Debug: Check if elements exist
    if (!sliderInput || !layerModern || !sliderHandle) {
        console.error("Slider elements NOT FOUND!");
        return;
    }

    console.log("✅ Slider initialized successfully!");

    sliderInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value); // 0 to 100
        
        // Update Modern layer width
        layerModern.style.width = `${val}%`;
        
        // Update Handle position
        sliderHandle.style.left = `${val}%`;
        
        // Debug logging
        console.log(`📊 Slider value: ${val}%`);
    });

    // Initialize at 50%
    layerModern.style.width = '50%';
    sliderHandle.style.left = '50%';
}

// (Keep existing functions: initMobileMenu, initSmoothScroll, initStickyNav below)
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.getElementById('main-nav');

    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.getElementById('main-nav');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.querySelector('.mobile-toggle').setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
}