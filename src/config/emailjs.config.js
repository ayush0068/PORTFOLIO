// ============================================================
//  EMAILJS CONFIGURATION
//  Steps to setup (FREE - 200 emails/month):
//
//  1. Go to https://www.emailjs.com/ → Sign Up (free)
//  2. Add Email Service:
//     Dashboard → Email Services → Add New Service → Gmail
//     → Connect your Gmail → Copy the SERVICE_ID
//  3. Create Email Template:
//     Dashboard → Email Templates → Create New Template
//     Use these exact variable names in template:
//     ─────────────────────────────
//     Subject: New Portfolio Message from {{from_name}}
//     Body:
//     Name:    {{from_name}}
//     Email:   {{from_email}}
//     Subject: {{subject}}
//     Message: {{message}}
//     ─────────────────────────────
//     → Save → Copy the TEMPLATE_ID
//  4. Get Public Key:
//     Dashboard → Account → General → Public Key → Copy it
//
//  5. Paste all 3 values below ↓
// ============================================================

export const EMAILJS_CONFIG = {
  SERVICE_ID:  "service_099kmgb",    // e.g. "service_abc123"
  TEMPLATE_ID: "template_13cxuvm",   // e.g. "template_xyz789"
  PUBLIC_KEY:  "AnL07Vu0uBXEEa_gl",    // e.g. "AbCdEfGhIjKlMnOp"
};