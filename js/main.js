/**
 * New South Technologies - Main JavaScript
 * 
 * Modules:
 * 1. Slider Interaction (Legacy <-> Modern)
 * 2. Mobile Navigation Toggle
 * 3. Smooth Scrolling for Anchors
 * 4. Sticky Navbar Effect
 */

document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initMobileMenu();
    initSmoothScroll();
    initStickyNav();
});

/**
 * 1. Slider Interaction
 * Controls the split-screen clip-path based on range input.
 */
function initSlider() {
    const sliderInput = document.getElementById('sliderInput');
    const layerModern = document.getElementById('layerModern');
    const layerLegacy = document.getElementById('layerLegacy');
    const container = document.getElementById('sliderContainer');

    // Exit if elements are missing (e.g., on pages without the slider)
    if (!sliderInput || !layerModern || !layerLegacy || !container) {
        console.warn('Slider elements not found. Skipping initialization.');
        return;
    }

    const updateSlider = () => {
        const val = sliderInput.value;
        
        // Update clip-path for the "Modern" layer (reveals from right)
        // Format: polygon(startX 0, 100% 0, 100% 100%, startX 100%)
        layerModern.style.clipPath = `polygon(${val}% 0, 100% 0, 100% 100%, ${val}% 100%)`;
        
        // Update clip-path for the "Legacy" layer (reveals from left)
        // Format: polygon(0 0, endX 0, endX 100%, 0 100%)
        layerLegacy.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
    };

    // Initialize position
    updateSlider();

    // Event Listener
    sliderInput.addEventListener('input', updateSlider);
}

/**
 * 2. Mobile Menu Toggle
 * Toggles the 'open' class on the navbar for mobile view.
 */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.navbar');
    const navLinks = document.getElementById('main-nav');

    if (!toggleBtn || !nav || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        
        // Toggle State
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('open');

        // Optional: Close menu when a link is clicked
        if (!isExpanded) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('open');
                    toggleBtn.setAttribute('aria-expanded', 'false');
                }, { once: true });
            });
        }
    });
}

/**
 * 3. Smooth Scrolling
 * Handles anchor links for smooth scrolling behavior.
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Ignore if it's just "#" or an external link
            if (href === '#' || href.startsWith('#!')) return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for sticky header
                const headerOffset = 80; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 4. Sticky Navbar Effect
 * Adds a shadow/background opacity when scrolling past the hero.
 */
function initStickyNav() {
    const navbar = document.querySelector('.navbar');
    const hero = document.getElementById('hero');
    
    if (!navbar) return;

    // Throttle scroll events for performance
    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroHeight = hero ? hero.offsetHeight : 0;

                if (scrollY > heroHeight - 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check in case page loads scrolled
    handleScroll();
}