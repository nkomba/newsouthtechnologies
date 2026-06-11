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

// Also add CSS for .sticky class in style.css:
/*
.navbar.sticky {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: var(--color-white);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 1000;
}
*/

/**
 * Slider Interaction — Width-Based (Industry Standard)
 * Fixed: Clamps values 0-100, no gaps at extremes
 */
function initSlider() {
    const sliderInput = document.getElementById('sliderInput');
    const layerModern = document.getElementById('layerModern');
    const sliderHandle = document.getElementById('sliderHandle');

    if (!sliderInput || !layerModern || !sliderHandle) {
        console.error("Slider elements NOT FOUND!");
        return;
    }

    sliderInput.addEventListener('input', (e) => {
        // Clamp value between 0 and 100
        let val = parseInt(e.target.value);
        if (val < 0) val = 0;
        if (val > 100) val = 100;
        
        // Set width and handle position as exact percentage strings
        layerModern.style.width = `${val}%`;
        sliderHandle.style.left = `${val}%`;
        
        console.log(`📊 Slider value: ${val}%`);
    });

    // Initialize at 50%
    layerModern.style.width = '50%';
    sliderHandle.style.left = '50%';
}

// (Keep existing functions: initMobileMenu, initSmoothScroll, initStickyNav below)
/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.getElementById('main-nav');
    const nav = document.querySelector('.navbar');

    if (!toggleBtn || !navLinks) {
        console.warn("Mobile menu elements not found.");
        return;
    }

    toggleBtn.addEventListener('click', () => {
        const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
        
        // Toggle classes
        toggleBtn.setAttribute('aria-expanded', !isOpen);
        navLinks.classList.toggle('active');
        
        // Optional: Add close behavior when clicking outside or a link
        if (!isOpen) {
            // Animate hamburger if needed
        }
    });

    // Close menu when a link is clicked (optional but good UX)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        });
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
/**
 * Blog Category Filter Functionality
 */
/**
 * Blog Category Filter - Debug Version
 */
function initBlogFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    // DEBUG: Log what we found
    console.log("--- Blog Filter Init ---");
    console.log("Buttons found:", filterButtons.length);
    console.log("Cards found:", blogCards.length);

    // Safety Check: If nothing found, stop here
    if (filterButtons.length === 0 || blogCards.length === 0) {
        console.warn("Could not find filter buttons or blog cards. Are you on the blog page?");
        return;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Stop link jump
            
            const clickedCategory = button.getAttribute('data-category');
            console.log("Clicked category:", clickedCategory);

            // 1. Update Active State on Buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Filter Cards
            let visibleCount = 0;

            blogCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Logic: Show if "All" is selected OR if categories match
                if (clickedCategory === 'all' || cardCategory === clickedCategory) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            console.log(`Showing ${visibleCount} cards.`);
        });
    });
}



document.addEventListener('DOMContentLoaded', () => {
    initSlider();
  //  initMobileMenu();
    initSmoothScroll();
   // initStickyNav();
function initMobileMenu() {
    // 1. Find elements
    const btn = document.querySelector('.mobile-toggle');
    const menu = document.getElementById('main-nav');

    // DEBUG: Log what we found
    console.log("Mobile Menu Init Started");
    console.log("Button found:", btn);
    console.log("Menu found:", menu);

    // If either is missing, stop and alert
    if (!btn || !menu) {
        console.error("CRITICAL ERROR: Button or Menu NOT FOUND!");
        return; 
    }

    // 2. Force a test click immediately to see if logic works
    // (Remove this line in production, keep it for debugging)
    setTimeout(() => {
        console.log("Simulating click...");
        menu.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        alert("DEBUG: If you see this, JS is working! But manual click might still fail.");
    }, 1000); // Runs 1 second after load

    // 3. Attach the real click listener
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = menu.classList.contains('active');
        
        console.log("CLICK DETECTED! Toggling from", isOpen ? "OPEN" : "CLOSED");
        
        if (isOpen) {
            menu.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        } else {
            menu.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        }
    });

    console.log("Event Listener Attached Successfully");
}    
    // Initialize Blog Filter (Only runs if on blog page)
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const target = button.dataset.category;
                
                // Update UI
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter Cards
                document.querySelectorAll('.blog-card').forEach(card => {
                    if (target === 'all' || card.dataset.category === target) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});
