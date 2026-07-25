/**
 * ACCESSIBLE BEFORE/AFTER COMPARISON COMPONENT
 * WCAG 2.1 AA / Section 508 compliant.
 *
 * Renders the Before/After states as real HTML content panels (no images of
 * text), toggled with an ARIA radio group:
 * - role="radiogroup" wraps two role="radio" controls (Before / After)
 * - Roving tabindex: only the checked radio is in the tab order
 * - Arrow keys (Left/Up = previous, Right/Down = next), Home/End, Space/Enter select
 * - One polite live region announces the new state (no duplicate announcements)
 * - The inactive panel is hidden from the accessibility tree (aria-hidden + CSS)
 * - Dispatches a `comparison:change` CustomEvent so other UI (e.g. the ROI
 *   calculator) can react to mouse OR keyboard selection.
 */

(function () {
    'use strict';

    const ANNOUNCE = {
        before: 'Before state shown. Legacy system: fragmented workflows, manual compliance, audit-trail gaps.',
        after: 'After state shown. Modern system: unified data, automated governance, complete audit trails.'
    };

    const STATES = ['before', 'after'];

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    }

    function setup() {
        const ctx = getCtx();
        if (!ctx) {
            console.warn('Accessible comparison: required elements not found');
            return;
        }

        STATES.forEach(function (state) {
            ctx.radios[state].addEventListener('click', function () {
                select(ctx, state, { focus: true });
            });
            ctx.radios[state].addEventListener('keydown', function (e) {
                onKeydown(ctx, state, e);
            });
        });

        // Initialize from whichever radio is marked checked in the markup (default before).
        // No announce/event on load — the panels are synced either way, and this
        // lets the ROI card keep its "full potential" default until the user acts.
        select(ctx, currentState(ctx.radios), { announce: false, focus: false });
    }

    function getCtx() {
        const group = document.getElementById('comparison-radiogroup');
        const radios = {
            before: document.getElementById('btn-before'),
            after: document.getElementById('btn-after')
        };
        const panels = {
            before: document.getElementById('panel-before'),
            after: document.getElementById('panel-after')
        };
        if (!group || !radios.before || !radios.after || !panels.before || !panels.after) return null;
        return {
            group: group,
            radios: radios,
            panels: panels,
            announcer: document.getElementById('comparison-announcer')
        };
    }

    function currentState(radios) {
        return radios.after.getAttribute('aria-checked') === 'true' ? 'after' : 'before';
    }

    function onKeydown(ctx, state, e) {
        const idx = STATES.indexOf(state);
        let next = null;
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                next = STATES[(idx + 1) % STATES.length];
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                next = STATES[(idx - 1 + STATES.length) % STATES.length];
                e.preventDefault();
                break;
            case 'Home':
                next = STATES[0];
                e.preventDefault();
                break;
            case 'End':
                next = STATES[STATES.length - 1];
                e.preventDefault();
                break;
            case ' ':
            case 'Enter':
                next = state;
                e.preventDefault();
                break;
            default:
                return;
        }
        select(ctx, next, { focus: true });
    }

    function select(ctx, newState, opts) {
        opts = opts || {};
        const announce = opts.announce !== false;
        const focus = opts.focus === true;
        if (STATES.indexOf(newState) === -1) return;

        const wasChecked = ctx.radios[newState].getAttribute('aria-checked') === 'true';

        // Update radio checked state + roving tabindex for BOTH radios.
        STATES.forEach(function (s) {
            const isTarget = s === newState;
            ctx.radios[s].setAttribute('aria-checked', String(isTarget));
            ctx.radios[s].setAttribute('tabindex', isTarget ? '0' : '-1');
            // Show the matching panel; hide the other from view and the a11y tree.
            ctx.panels[s].classList.toggle('is-active', isTarget);
            ctx.panels[s].setAttribute('aria-hidden', String(!isTarget));
        });

        if (focus) ctx.radios[newState].focus();

        if (wasChecked && !opts.force) return;

        if (announce && ctx.announcer) {
            ctx.announcer.textContent = ANNOUNCE[newState];
        }

        ctx.group.dispatchEvent(new CustomEvent('comparison:change', {
            bubbles: true,
            detail: { state: newState }
        }));
    }

    // ---- Public programmatic API (reads state from the DOM; no recursion) ----
    window.AccessibleComparison = {
        showBefore: function () { const c = getCtx(); if (c) select(c, 'before', { focus: false }); },
        showAfter: function () { const c = getCtx(); if (c) select(c, 'after', { focus: false }); },
        toggle: function () {
            const c = getCtx();
            if (!c) return;
            select(c, currentState(c.radios) === 'before' ? 'after' : 'before', { focus: false });
        },
        getState: function () {
            const c = getCtx();
            return c ? currentState(c.radios) : null;
        }
    };

    init();
})();
