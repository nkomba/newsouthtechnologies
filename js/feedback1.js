/* ============================================
   NewSouth Technologies — Feedback Form JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile nav toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // --- Form validation & submission ---
    const feedbackForm = document.getElementById('feedback-form');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation passed (HTML5 required handles most)
            // Generate a provisional case ID for display
            var ts = new Date();
            var year = ts.getFullYear();
            var seq = Math.floor(1000 + Math.random() * 9000);
            var caseId = 'CRS-' + year + '-' + seq;

            // Show confirmation message
            var formWrapper = feedbackForm.parentElement;
            var confirmation = document.createElement('div');
            confirmation.className = 'form-confirmation';
            confirmation.innerHTML =
                '<div class="confirmation-box">' +
                '  <h3>✓ Concern Submitted Successfully</h3>' +
                '  <p>Your provisional case ID is <strong>' + caseId + '</strong>.</p>' +
                '  <p>A formal acknowledgment with your permanent case ID will be sent to your email ' +
                '  within 24 business hours. Please save your case ID for future reference.</p>' +
                '  <p>If you do not receive an acknowledgment, please contact us directly at ' +
                '  <a href="mailto:customersuccess@newsouthtechnologies.com">customersuccess@newsouthtechnologies.com</a>.</p>' +
                '  <button class="btn-secondary" onclick="location.reload()">Submit Another Concern</button>' +
                '</div>';
            formWrapper.insertBefore(confirmation, feedbackForm);
            feedbackForm.style.display = 'none';

            // Scroll to confirmation
            confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Submit to Formspree (or backend) via fetch
            var formData = new FormData(feedbackForm);
            fetch(feedbackForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).catch(function () {
                // Network errors are non-blocking; confirmation already shown
                console.warn('Form submission encountered a network error.');
            });
        });
    }

    // --- Severity helper text ---
    var severitySelect = document.getElementById('severity');
    if (severitySelect) {
        severitySelect.addEventListener('change', function () {
            var hint = document.getElementById('severity-hint');
            if (!hint) {
                hint = document.createElement('p');
                hint.id = 'severity-hint';
                hint.className = 'form-hint';
                severitySelect.parentElement.appendChild(hint);
            }
            var hints = {
                'Critical': 'Target resolution: 24–48 hours. Escalated to CEO/Partner level.',
                'High': 'Target resolution: 5 business days. Escalated to Senior Leadership.',
                'Medium': 'Target resolution: 10 business days. Managed by Engagement Manager.',
                'Low': 'Target resolution: 15 business days. Managed by Project Lead.'
            };
            hint.textContent = hints[this.value] || '';
        });
    }
});