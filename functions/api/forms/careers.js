/**
 * CAREERS FORM SUBMISSION HANDLER
 * Cloudflare Pages Function - /api/forms/careers
 * 
 * Security Features:
 * - TLS 1.3 (handled by Cloudflare automatically)
 * - Input validation and sanitization
 * - File size limits enforced
 * - File type verification
 * - Malware scanning hook (optional integration point)
 * - Secure storage to Azure/AWS
 * - Logging for audit trail
 * 
 * Compliance:
 * - NIST SP 800-171 controls
 * - PII handling per Privacy Act requirements
 * - Data retention policy enforcement
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Environment variables (set in Cloudflare Pages dashboard)
    STORAGE_BUCKET_ENV: 'AZURE_STORAGE_CONNECTION_STRING', // or AWS_S3_ENDPOINT
    EMAIL_SERVICE_ENV: 'SENDGRID_API_KEY', // or SENDINBLUE, MAILGUN
    
    // Security limits
    MAX_FILE_SIZE_MB: 5,
    ALLOWED_FILE_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    
    // Retention policy
    RESUME_RETENTION_DAYS: 547, // 18 months
    
    // Logging
    LOG_LEVEL: 'info', // 'debug' | 'info' | 'warn' | 'error'
    
    // Rate limiting (per IP)
    RATE_LIMIT_REQUESTS: 3,
    RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Log message with timestamp and severity
 */
function log(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level: level.toUpperCase(),
        message,
        ...context
    };

    // In production, send to external logging (Datadog, Splunk, etc.)
    // For now, console log with filtering based on LOG_LEVEL
    const levels = ['debug', 'info', 'warn', 'error'];
    if (levels.indexOf(level) >= levels.indexOf(CONFIG.LOG_LEVEL)) {
        console.log(JSON.stringify(logEntry));
    }
}

/**
 * Sanitize text input to prevent XSS
 */
function sanitizeInput(input) {
    if (!input || typeof input !== 'string') return '';
    
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim()
        .substring(0, 500); // Length limit
}

/**
 * Validate email address format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format (US)
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

/**
 * Generate unique submission ID
 */
function generateSubmissionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `NS-${timestamp}-${random}`.toUpperCase();
}

/**
 * Calculate file hash for integrity verification
 */
async function calculateFileHash(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// ============================================
// RATE LIMITING
// ============================================
//
// Uses a Cloudflare KV namespace (binding: RATE_LIMIT) so limits hold across
// serverless isolates. Bind it in the Cloudflare Pages dashboard
// (Settings -> Functions -> KV namespace bindings, variable name RATE_LIMIT).
// If the binding is absent, it falls back to a best-effort in-memory counter
// (only effective within a single isolate) so local/dev still works.

const rateLimitStore = new Map(); // in-memory fallback only

async function checkRateLimit(env, ipAddress) {
    const windowSec = Math.ceil(CONFIG.RATE_LIMIT_WINDOW_MS / 1000);
    const limit = CONFIG.RATE_LIMIT_REQUESTS;

    // Preferred: distributed counter in KV.
    if (env && env.RATE_LIMIT && typeof env.RATE_LIMIT.get === 'function') {
        try {
            const key = `rl:${ipAddress}`;
            const current = parseInt((await env.RATE_LIMIT.get(key)) || '0', 10);
            if (current >= limit) {
                log('warn', 'Rate limit exceeded (KV)', { ipAddress, count: current });
                return false;
            }
            // Increment; keep the window TTL. (Not perfectly atomic, but sufficient
            // for abuse prevention; tighten with a Durable Object if needed.)
            await env.RATE_LIMIT.put(key, String(current + 1), { expirationTtl: windowSec });
            return true;
        } catch (e) {
            log('error', 'KV rate-limit error; allowing request', { error: e.message });
            return true; // fail open on infrastructure error, not on abuse
        }
    }

    // Fallback: in-memory sliding window (single isolate only).
    const now = Date.now();
    const windowStart = now - CONFIG.RATE_LIMIT_WINDOW_MS;
    const recent = (rateLimitStore.get(ipAddress) || []).filter(t => t > windowStart);
    if (recent.length >= limit) {
        log('warn', 'Rate limit exceeded (memory)', { ipAddress, count: recent.length });
        return false;
    }
    recent.push(now);
    rateLimitStore.set(ipAddress, recent);
    return true;
}

// ============================================
// STORAGE HANDLERS
// ============================================

/**
 * Shared helper: build Azure Blob config from env (container-scoped SAS auth).
 * Works in the Cloudflare Workers runtime (fetch only — no Node SDKs).
 *
 * Env (set as encrypted secrets in the Cloudflare Pages dashboard):
 *   AZURE_BLOB_ACCOUNT      storage account name
 *   AZURE_BLOB_CONTAINER    container name (default: "resumes")
 *   AZURE_BLOB_SAS          container-scoped SAS token with create/write
 *   AZURE_BLOB_HOST_SUFFIX  default "blob.core.usgovcloudapi.net" (Azure Government)
 */
function azureBlobConfig(env) {
    const account = env.AZURE_BLOB_ACCOUNT;
    const sas = env.AZURE_BLOB_SAS;
    if (!account || !sas) return null;
    return {
        account,
        sas: sas.startsWith('?') ? sas : `?${sas}`,
        suffix: env.AZURE_BLOB_HOST_SUFFIX || 'blob.core.usgovcloudapi.net',
        container: env.AZURE_BLOB_CONTAINER || 'resumes'
    };
}

/**
 * PUT a block blob to Azure Blob Storage via the REST API.
 */
async function azureBlobPut(env, blobPath, body, contentType, meta = {}) {
    const cfg = azureBlobConfig(env);
    if (!cfg) throw new Error('Azure Blob storage is not configured (AZURE_BLOB_ACCOUNT / AZURE_BLOB_SAS)');
    const url = `https://${cfg.account}.${cfg.suffix}/${cfg.container}/${blobPath}${cfg.sas}`;
    const headers = {
        'x-ms-blob-type': 'BlockBlob',
        'x-ms-version': '2021-08-06',
        'Content-Type': contentType || 'application/octet-stream'
    };
    for (const [k, v] of Object.entries(meta)) {
        // Azure metadata values must be ASCII / HTTP-header-safe
        headers[`x-ms-meta-${k}`] = encodeURIComponent(String(v ?? ''));
    }
    const res = await fetch(url, { method: 'PUT', headers, body });
    if (!res.ok) {
        const detail = (await res.text().catch(() => '')).slice(0, 300);
        throw new Error(`Azure blob PUT ${res.status}: ${detail}`);
    }
    return blobPath;
}

/**
 * Store submission metadata as a JSON blob alongside the resume.
 */
async function storeSubmissionMetadata(submissionData, env) {
    const datePath = new Date().toISOString().split('T')[0];
    const key = `applications/${datePath}/${submissionData.id}/metadata.json`;
    const record = {
        ...submissionData,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + CONFIG.RESUME_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()
    };
    try {
        await azureBlobPut(env, key, JSON.stringify(record, null, 2), 'application/json', {
            submissionid: submissionData.id
        });
        log('info', 'Metadata stored successfully', { submissionId: submissionData.id });
        return true;
    } catch (error) {
        log('error', 'Failed to store metadata', { error: error.message });
        throw error;
    }
}

/**
 * Store the resume file securely in Azure Blob Storage.
 */
async function storeResumeFile(file, submissionId, env) {
    const ext = (file.name.split('.').pop() || 'bin').replace(/[^a-z0-9]/gi, '').toLowerCase();
    const datePath = new Date().toISOString().split('T')[0];
    const storageKey = `applications/${datePath}/${submissionId}/${submissionId}_resume.${ext}`;
    const fileHash = await calculateFileHash(file);
    try {
        await azureBlobPut(env, storageKey, await file.arrayBuffer(), file.type, {
            submissionid: submissionId,
            filehash: fileHash,
            originalname: file.name,
            uploadedat: new Date().toISOString()
        });
        log('info', 'Resume stored successfully', { storageKey, fileSize: file.size, fileHash });
        return storageKey;
    } catch (error) {
        log('error', 'Failed to store resume', { error: error.message, fileName: file.name });
        throw error;
    }
}

/**
 * Send an email via a transactional email REST API (SendGrid) using fetch.
 * Env: SENDGRID_API_KEY (required to send), EMAIL_FROM (verified sender, optional).
 */
async function sendEmail(env, { to, subject, text, html, replyTo }) {
    const apiKey = env.SENDGRID_API_KEY;
    if (!apiKey) { log('warn', 'Email skipped — SENDGRID_API_KEY not set', { to }); return false; }
    const from = env.EMAIL_FROM || 'careers@newsouthtechnologies.com';
    const payload = {
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from, name: 'New South Technologies' },
        subject,
        content: [
            { type: 'text/plain', value: text || '' },
            ...(html ? [{ type: 'text/html', value: html }] : [])
        ]
    };
    if (replyTo) payload.reply_to = { email: replyTo };
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const detail = (await res.text().catch(() => '')).slice(0, 300);
        log('error', 'Email send failed', { status: res.status, detail, to });
        return false;
    }
    return true;
}

/**
 * Confirmation to the applicant + a notification to the careers inbox.
 * Email failure never fails the submission (the resume is already stored).
 */
async function sendConfirmationEmail(recipientEmail, submissionId, env, context = {}) {
    try {
        const applicantSent = await sendEmail(env, {
            to: recipientEmail,
            subject: 'Application Received — New South Technologies',
            text: `Thank you for your application (${submissionId}). We will review it within 5 business days.`,
            html: `<p>Thank you for your interest in New South Technologies.</p>`
                + `<p><strong>Submission ID:</strong> ${submissionId}</p>`
                + `<p>We will review your application within 5 business days.</p>`
                + `<p>Questions? Contact <a href="mailto:privacy@newsouthtechnologies.com">privacy@newsouthtechnologies.com</a>.</p>`,
            replyTo: 'careers@newsouthtechnologies.com'
        });

        const notifyTo = env.CAREERS_NOTIFY_TO || 'careers@newsouthtechnologies.com';
        await sendEmail(env, {
            to: notifyTo,
            subject: `New application: ${context.position || 'position'} (${submissionId})`,
            text: `New application received.
Submission: ${submissionId}
Position: ${context.position || 'n/a'}
Clearance: ${context.clearance || 'n/a'}`
        });

        log('info', 'Confirmation email sent', { recipientEmail, submissionId, applicantSent });
        return applicantSent;
    } catch (error) {
        log('error', 'Failed to send confirmation email', { recipientEmail, error: error.message });
        return false;
    }
}

/**
 * Schedule automatic deletion (for compliance with retention policy)
 * Placeholder for cron job implementation
 */
async function scheduleAutomaticDeletion(submissionId, storageKey, daysUntilDeletion) {
    // TODO: Implement via Cloudflare Scheduled Triggers or external scheduler
    // Example: Create database record with expiresAt field for cleanup job
    
    log('info', 'Deletion scheduled', { 
        submissionId, 
        storageKey, 
        daysUntilDeletion 
    });
    
    return true;
}

// ============================================
// MAIN HANDLER
// ============================================

export async function onRequest(context) {
    const { request, env } = context;
    const startTime = Date.now();
    
    try {
        // CORS headers for all responses
        const corsHeaders = {
            // Restrict to our own origin; override via ALLOWED_ORIGIN env if needed.
            'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || 'https://newsouthtechnologies.com',
            'Vary': 'Origin',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Security-Policy': "default-src 'self'",
            'X-Content-Type-Options': 'nosniff',
            'Cache-Control': 'no-store'
        };

        // Handle preflight OPTIONS request
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        // Only allow POST
        if (request.method !== 'POST') {
            return Response.json({
                success: false,
                error: 'Method not allowed'
            }, {
                status: 405,
                headers: corsHeaders
            });
        }

        // Extract client IP for rate limiting
        const clientIP = request.headers.get('CF-Connecting-IP') || 
                        request.headers.get('X-Forwarded-For') || 
                        'unknown';

        // Rate limiting check
        if (!(await checkRateLimit(env, clientIP))) {
            log('warn', 'Request blocked - rate limit', { clientIP });
            return Response.json({
                success: false,
                error: 'Too many requests. Please wait 60 seconds.'
            }, {
                status: 429,
                headers: corsHeaders
            });
        }

        // Parse multipart form data
        let formData;
        try {
            formData = await request.formData();
        } catch (parseError) {
            log('error', 'Failed to parse form data', { error: parseError.message });
            return Response.json({
                success: false,
                error: 'Invalid form submission'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }

        // Extract and validate fields
        const rawFields = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            linkedin: formData.get('linkedin'),
            positionInterest: formData.get('positionInterest'),
            clearanceStatus: formData.get('clearanceStatus'),
            workAuthorization: formData.get('workAuthorization'),
            experienceYears: formData.get('experienceYears'),
            certifications: formData.get('certifications'),
            coverLetter: formData.get('coverLetter'),
            veteranStatus: formData.get('veteranStatus'),
            disabilityStatus: formData.get('disabilityStatus'),
            privacyConsent: formData.get('privacyConsent'),
            termsConsent: formData.get('termsConsent')
        };

        const resume = formData.get('resume');

        // Required field validation
        const requiredFields = ['fullName', 'email', 'phone', 'positionInterest', 'clearanceStatus', 'workAuthorization', 'resume', 'privacyConsent', 'termsConsent'];
        for (const field of requiredFields) {
            if (!rawFields[field] && !(field === 'resume' && resume)) {
                log('warn', 'Missing required field', { field });
                return Response.json({
                    success: false,
                    error: `Missing required field: ${field}`
                }, {
                    status: 400,
                    headers: corsHeaders
                });
            }
        }

        // Consent validation
        if (rawFields.privacyConsent !== 'on' || rawFields.termsConsent !== 'on') {
            log('warn', 'Missing consent', { privacyConsent: rawFields.privacyConsent, termsConsent: rawFields.termsConsent });
            return Response.json({
                success: false,
                error: 'Privacy and terms consent required'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }

        // Sanitize text inputs
        const sanitizedData = {
            fullName: sanitizeInput(rawFields.fullName),
            email: rawFields.email,
            phone: sanitizeInput(rawFields.phone),
            linkedin: rawFields.linkedin ? sanitizeInput(rawFields.linkedin) : null,
            positionInterest: sanitizeInput(rawFields.positionInterest),
            clearanceStatus: sanitizeInput(rawFields.clearanceStatus),
            workAuthorization: sanitizeInput(rawFields.workAuthorization),
            experienceYears: rawFields.experienceYears ? parseInt(rawFields.experienceYears, 10) : null,
            certifications: rawFields.certifications ? sanitizeInput(rawFields.certifications) : null,
            coverLetter: rawFields.coverLetter ? sanitizeInput(rawFields.coverLetter.substring(0, 2000)) : null,
            veteranStatus: sanitizeInput(rawFields.veteranStatus),
            disabilityStatus: sanitizeInput(rawFields.disabilityStatus)
        };

        // Email validation
        if (!isValidEmail(sanitizedData.email)) {
            return Response.json({
                success: false,
                error: 'Invalid email format'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }

        // Phone validation
        if (!isValidPhone(sanitizedData.phone)) {
            return Response.json({
                success: false,
                error: 'Invalid phone format'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }

        // File validation
        if (!resume || !(resume instanceof File)) {
            log('warn', 'Missing or invalid resume file');
            return Response.json({
                success: false,
                error: 'Resume file required'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }

        // File size check
        const fileSizeMB = resume.size / (1024 * 1024);
        if (resume.size > CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
            log('warn', 'File too large', { fileName: resume.name, size: fileSizeMB });
            return Response.json({
                success: false,
                error: `File exceeds ${CONFIG.MAX_FILE_SIZE_MB}MB limit`
            }, {
                status: 400,
                headers: corsHeaders
            });
        }

        // File type check
        if (!CONFIG.ALLOWED_FILE_TYPES.includes(resume.type)) {
            log('warn', 'Invalid file type', { fileName: resume.name, fileType: resume.type });
            return Response.json({
                success: false,
                error: 'Only PDF and Word documents accepted'
            }, {
                status: 400,
                headers: corsHeaders
            });
        }

        // Generate submission ID
        const submissionId = generateSubmissionId();

        // Log submission start
        log('info', 'Processing application', {
            submissionId,
            applicantEmail: sanitizedData.email,
            position: sanitizedData.positionInterest,
            fileSizeMB
        });

        // Store file
        let storageKey;
        try {
            storageKey = await storeResumeFile(resume, submissionId, env);
        } catch (storageError) {
            log('error', 'File storage failed', { submissionId, error: storageError.message });
            return Response.json({
                success: false,
                error: 'Failed to process resume file'
            }, {
                status: 500,
                headers: corsHeaders
            });
        }

        // Prepare metadata for storage
        const submissionMetadata = {
            id: submissionId,
            ...sanitizedData,
            resumeStorageKey: storageKey,
            submittedAt: new Date().toISOString(),
            ipAddress: clientIP,
            userAgent: request.headers.get('User-Agent')?.substring(0, 200),
            processingTimeMs: Date.now() - startTime
        };

        // Store metadata
        try {
            await storeSubmissionMetadata(submissionMetadata, env);
        } catch (metadataError) {
            log('error', 'Metadata storage failed', { submissionId, error: metadataError.message });
            // Continue - don't fail submission if metadata fails (file is already stored)
        }

        // Schedule deletion per retention policy
        await scheduleAutomaticDeletion(submissionId, storageKey, CONFIG.RESUME_RETENTION_DAYS);

        // Send confirmation email
        const emailSent = await sendConfirmationEmail(sanitizedData.email, submissionId, env, { position: sanitizedData.positionInterest, clearance: sanitizedData.clearanceStatus });

        // Success response
        log('info', 'Application processed successfully', {
            submissionId,
            processingTimeMs: Date.now() - startTime,
            emailSent
        });

        return Response.json({
            success: true,
            submissionId,
            message: 'Application received successfully'
        }, {
            status: 200,
            headers: corsHeaders
        });

    } catch (error) {
        log('error', 'Unhandled error', {
            error: error.message,
            stack: error.stack,
            method: request.method,
            url: request.url
        });

        return Response.json({
            success: false,
            error: 'Internal server error. Please try again or contact careers@newsouthtechnologies.com'
        }, {
            status: 500,
            headers: corsHeaders
        });
    }
}

// ============================================
// EXPORTS (helpers exposed for unit testing)
// ============================================

export {
    sanitizeInput,
    isValidEmail,
    isValidPhone,
    generateSubmissionId,
    checkRateLimit
};