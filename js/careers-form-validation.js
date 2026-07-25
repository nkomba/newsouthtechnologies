/**
 * CAREERS FORM VALIDATION
 * Handles resume file size validation and form submission
 */

(function() {
    'use strict';

    // Configuration
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    // Elements
    const form = document.getElementById('careers-application');
    const resumeInput = document.getElementById('resume');
    const resumeWarning = document.getElementById('resume-limit');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('errorMessage');

    /**
     * Validate file size when file is selected
     */
    if (resumeInput) {
        resumeInput.addEventListener('change', handleFileSelection);
    }

    /**
     * Handle file selection and validate size
     */
    function handleFileSelection(event) {
        const file = event.target.files[0];

        if (file) {
            const fileSizeBytes = file.size;
            const fileSizeMB = fileSizeBytes / (1024 * 1024);

            if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
                // Invalid file size
                resumeWarning.hidden = false;
                resumeInput.value = ''; // Clear the invalid selection
                resumeInput.setCustomValidity(`File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
            } else {
                // Valid file size
                resumeWarning.hidden = true;
                resumeInput.setCustomValidity('');
            }
        }
    }

    /**
     * Handle form submission
     */
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Client-side validation first
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Disable submit button to prevent double-submission
            const submitBtn = document.getElementById('submit-application');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                const formData = new FormData(form);
                
                // Send to Cloudflare Worker endpoint
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    form.reset();
                    successMessage.hidden = false;
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Server error
                    throw new Error('Server returned error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Show error message
                errorMessage.hidden = false;
                errorMessage.scrollIntoView({ behavior: 'smooth' });
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
            }
        });
    }

    // Clean up: hide messages when starting new submission
    if (form) {
        form.addEventListener('reset', () => {
            successMessage.hidden = true;
            errorMessage.hidden = true;
            resumeWarning.hidden = true;
        });
    }

})();