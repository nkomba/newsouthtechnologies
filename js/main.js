/**
 * Sticky Navigation - Keeps navbar visible on scroll
 */
function initStickyNav() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });
}

/**
 * Slider Interaction — Width-Based
 */
function initSlider() {
    const sliderInput = document.getElementById('sliderInput');
    const layerModern = document.getElementById('layerModern');
    const sliderHandle = document.getElementById('sliderHandle');

    if (!sliderInput || !layerModern || !sliderHandle) {
        return;
    }

    sliderInput.addEventListener('input', (e) => {
        const val = Math.min(100, Math.max(0, parseInt(e.target.value)));
        
        layerModern.style.width = `${val}%`;
        sliderHandle.style.left = `${val}%`;
    });

    // Initialize at 50%
    layerModern.style.width = '50%';
    sliderHandle.style.left = '50%';
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.getElementById('main-nav');

    if (!toggleBtn || !navLinks) {
        return;
    }

    toggleBtn.addEventListener('click', () => {
        const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
        
        toggleBtn.setAttribute('aria-expanded', String(!isOpen));
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        });
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navLinks = document.getElementById('main-nav');
            const mobileToggle = document.querySelector('.mobile-toggle');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
}

/**
 * Blog Category Filter
 */
function initBlogFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (filterButtons.length === 0 || blogCards.length === 0) {
        return;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const clickedCategory = button.getAttribute('data-category');

            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter cards
            blogCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (clickedCategory === 'all' || cardCategory === clickedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Initialize all components on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initMobileMenu();       // Uncomment if mobile menu is needed
    initSmoothScroll();
    initStickyNav();         // Uncomment if sticky nav is needed
    initBlogFilter();
});