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
 * Slider Interaction — Width-Based with Milestones & ROI
 */
function initSlider() {
    const sliderInput = document.getElementById('sliderInput');
    const layerModern = document.getElementById('layerModern');
    const sliderHandle = document.getElementById('sliderHandle');
    const milestonePopup = document.getElementById('milestonePopup');
    const agencySizeSelect = document.getElementById('agencySize');
    const annualSavingsEl = document.getElementById('annualSavings');
    const riskReductionEl = document.getElementById('riskReduction');
// --- Show/hide instructional overlay on first drag ---
var instructionOverlay = document.getElementById('sliderInstruction');
var hintPulse = document.querySelector('.slider-hint-pulse');
var hasInteracted = false;
// --- Touch gesture support for mobile ---
var touchStartX = 0;
var touchCurrentX = 0;

sliderContainer.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
}, { passive: true });

sliderContainer.addEventListener('touchmove', function(e) {
    touchCurrentX = e.touches[0].clientX;
    
    var containerWidth = sliderInput.parentElement.offsetWidth;
    var offsetX = touchCurrentX - touchStartX;
    var newValue = parseInt(sliderInput.value) + Math.round((offsetX / containerWidth) * 100);
    
    newValue = Math.min(100, Math.max(0, newValue));
    sliderInput.value = newValue;
    
    // Trigger the same input event handlers
    sliderInput.dispatchEvent(new Event('input'));
}, { passive: true });

sliderContainer.addEventListener('touchend', function() {
    if (Math.abs(touchCurrentX - touchStartX) > 10) {
        // Significant drag happened
        sliderInput.dispatchEvent(new Event('change'));
    }
});
// --- Keyboard navigation (arrow keys) ---
sliderInput.addEventListener('keydown', function(e) {
    var oldValue = parseInt(this.value);
    var newValue = oldValue;
    
    switch(e.key) {
        case 'ArrowLeft':
            newValue = Math.max(0, oldValue - 5);
            e.preventDefault();
            break;
        case 'ArrowRight':
            newValue = Math.min(100, oldValue + 5);
            e.preventDefault();
            break;
        case 'Home':
            newValue = 0;
            e.preventDefault();
            break;
        case 'End':
            newValue = 100;
            e.preventDefault();
            break;
    }
    
    if (newValue !== oldValue) {
        this.value = newValue;
        this.dispatchEvent(new Event('input'));
        
        // Add focus-visible class temporarily
        sliderHandle.classList.add('focus-visible');
        setTimeout(function() {
            sliderHandle.classList.remove('focus-visible');
        }, 200);
    }
});
// --- Snap-to-grid for milestones ---
var SNAP_THRESHOLD = 8; // Distance in % to snap
var SNAP_ENABLED = true;

sliderInput.addEventListener('input', function(e) {
    var rawVal = parseInt(e.target.value);
    var snappedVal = rawVal;
    
    if (SNAP_ENABLED) {
        // Find nearest milestone
        milestones.forEach(function(m) {
            if (Math.abs(m.pos - rawVal) <= SNAP_THRESHOLD) {
                snappedVal = m.pos;
            }
        });
    }
    
    // Only update if changed
    if (snappedVal !== rawVal) {
        sliderInput.value = snappedVal;
    }
    
    // ... rest of update logic using snappedVal
    var val = snappedVal;
    layerModern.style.width = val + '%';
    sliderHandle.style.left = val + '%';
    updateMilestone(val);
    updateROI(val);
});
sliderInput.addEventListener('input', function(e) {
    // Remove overlays after first interaction
    if (!hasInteracted && Math.abs(parseInt(e.target.value) - 50) > 5) {
        hasInteracted = true;
        if (instructionOverlay) instructionOverlay.classList.add('hide');
        if (hintPulse) hintPulse.style.opacity = '0';
    }
    // ... rest of existing input handler
});
// --- Haptic feedback on milestone arrival ---
var lastMilestone = -1;

function updateMilestone(value) {
    if (!milestonePopup) return;
    
    var m = findClosestMilestone(value);
    // ... existing update logic
    
    // Vibrate on milestone hit (mobile only)
    if (m.pos !== lastMilestone && navigator.vibrate) {
        navigator.vibrate(50); // 50ms vibration
        lastMilestone = m.pos;
    }
}
// Wire up snap toggle
var snapToggle = document.getElementById('snapToggle');
if (snapToggle) {
    snapToggle.addEventListener('change', function(e) {
        SNAP_ENABLED = e.target.checked;
    });
}

// Hide hint after 5 seconds if not interacted
setTimeout(function() {
    if (!hasInteracted) {
        if (instructionOverlay) instructionOverlay.classList.add('hide');
        if (hintPulse) hintPulse.style.opacity = '0';
    }
}, 5000);
    // Exit if core slider elements don't exist (not on this page)
    if (!sliderInput || !layerModern || !sliderHandle) return;

    // --- Milestone definitions ---
    const milestones = [
        { pos: 0,   phase: "Phase 0 — Baseline",    risk: "HIGH",    cost: "$2.4M/yr" },
        { pos: 25,  phase: "Phase 1 — Assess",      risk: "MEDIUM",  cost: "$1.8M/yr" },
        { pos: 50,  phase: "Phase 2 — Migrate",     risk: "MEDIUM",  cost: "$1.2M/yr" },
        { pos: 75,  phase: "Phase 3 — Govern",      risk: "LOW",     cost: "$700K/yr" },
        { pos: 100, phase: "Phase 4 — Modernized",  risk: "MINIMAL", cost: "$400K/yr" }
    ];

    // --- Budget tiers for ROI ---
    const budgetTiers = {
        small:  { budget: 15000000,  savingsPct: 0.15, riskBase: 0.40 },
        medium: { budget: 60000000,  savingsPct: 0.18, riskBase: 0.55 },
        large:  { budget: 250000000, savingsPct: 0.22, riskBase: 0.65 }
    };

    // --- Helper: find nearest milestone ---
    function findClosestMilestone(value) {
        return milestones.reduce(function(prev, curr) {
            return Math.abs(curr.pos - value) < Math.abs(prev.pos - value) ? curr : prev;
        });
    }

    // --- Helper: update milestone popup ---
    function updateMilestone(value) {
        if (!milestonePopup) return;

        var m = findClosestMilestone(value);
        milestonePopup.querySelector('.milestone-phase').textContent = m.phase;
        milestonePopup.querySelector('.milestone-risk').textContent = 'Risk Level: ' + m.risk;
        milestonePopup.querySelector('.milestone-cost').textContent = 'Est. Cost: ' + m.cost;

        // Position popup directly above the handle
        var containerWidth = sliderInput.parentElement.offsetWidth;
        milestonePopup.style.left = (containerWidth * value / 100) + 'px';

        milestonePopup.classList.add('visible');
    }

    // --- Helper: update ROI calculator ---
    function updateROI(value) {
        if (!agencySizeSelect || !annualSavingsEl || !riskReductionEl) return;

        var tier = budgetTiers[agencySizeSelect.value] || budgetTiers.medium;
        var progress = value / 100;

        var savings = tier.budget * tier.savingsPct * progress;
        var riskReduction = Math.round(tier.riskBase * progress * 100);

        annualSavingsEl.textContent = savings.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });
        riskReductionEl.textContent = riskReduction + '%';
    }

    // --- Main slider input handler ---
    sliderInput.addEventListener('input', function(e) {
        var val = Math.min(100, Math.max(0, parseInt(e.target.value)));

        // Move layers and handle (core slider visual)
        layerModern.style.width = val + '%';
        sliderHandle.style.left = val + '%';

        // Update milestone popup
        updateMilestone(val);

        // Update ROI calculator
        updateROI(val);
    });

    // --- ROI selector change handler ---
    if (agencySizeSelect) {
        agencySizeSelect.addEventListener('change', function() {
            updateROI(parseInt(sliderInput.value));
        });
    }
    var valueTooltip = document.getElementById('valueTooltip');

sliderInput.addEventListener('input', function(e) {
    var val = parseInt(e.target.value);
    
    if (valueTooltip) {
        valueTooltip.textContent = val + '% transformed';
        valueTooltip.classList.add('visible');
    }
    
    // ... rest of handler
});

// Hide tooltip when stopped
sliderInput.addEventListener('change', function() {
    if (valueTooltip) {
        setTimeout(function() {
            valueTooltip.classList.remove('visible');
        }, 1500);
    }
    // ... rest of change handler
});

    // --- Hide popup 3 seconds after user stops dragging ---
    var popupTimeout;
    sliderInput.addEventListener('change', function() {
        clearTimeout(popupTimeout);
        popupTimeout = setTimeout(function() {
            if (milestonePopup) milestonePopup.classList.remove('visible');
        }, 3000);
    });
var resetBtn = document.getElementById('resetSliderBtn');
if (resetBtn) {
    resetBtn.addEventListener('click', function() {
        sliderInput.value = 50;
        sliderInput.dispatchEvent(new Event('input'));
        sliderInput.dispatchEvent(new Event('change'));
        
        if (instructionOverlay) instructionOverlay.classList.remove('hide');
        if (hintPulse) hintPulse.style.opacity = '0.8';
        hasInteracted = false;
    });
}
    // --- Initialize at 50% ---
    layerModern.style.width = '50%';
    sliderHandle.style.left = '50%';
    updateMilestone(50);
    updateROI(50);
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.getElementById('main-nav');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!isOpen));
        navLinks.classList.toggle('active');
    });

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
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

            const navLinks = document.getElementById('main-nav');
            const mobileToggle = document.querySelector('.mobile-toggle');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
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
    if (filterButtons.length === 0 || blogCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const clickedCategory = button.getAttribute('data-category');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            blogCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                card.style.display = (clickedCategory === 'all' || cardCategory === clickedCategory) ? 'block' : 'none';
            });
        });
    });
}

/**
 * Initialize all components on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initMobileMenu();
    initSmoothScroll();
    initStickyNav();
    initBlogFilter();
});