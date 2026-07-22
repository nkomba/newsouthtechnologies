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

    // --- Hide popup 3 seconds after user stops dragging ---
    var popupTimeout;
    sliderInput.addEventListener('change', function() {
        clearTimeout(popupTimeout);
        popupTimeout = setTimeout(function() {
            if (milestonePopup) milestonePopup.classList.remove('visible');
        }, 3000);
    });

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