# Security Review Report

**Date:** 2025-01-27  
**Application:** Next.js Portfolio Site with Polar Checkout Integration  
**Reviewer:** Security Audit

## Executive Summary

This security review identified **8 critical issues**, **5 high-priority issues**, and **3 medium-priority issues** that should be addressed to improve the application's security posture.

---

## 🔴 Critical Issues

### 1. **No Rate Limiting on API Routes**
**Location:** `app/api/polar/checkout/*/route.js`  
**Risk:** API endpoints are vulnerable to brute force attacks, DoS, and abuse.

**Issues:**
- `/api/polar/checkout` (POST) - No rate limiting
- `/api/polar/checkout/status` (GET) - No rate limiting  
- `/api/polar/checkout/session` (GET) - No rate limiting

**Recommendation:**
```javascript
// Install: npm install @upstash/ratelimit @upstash/redis
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }
  // ... rest of handler
}
```

---

### 2. **URL Injection Vulnerability**
**Location:** `app/api/polar/checkout/route.js:39-44`  
**Risk:** Attackers can redirect users to malicious sites via `successUrl` and `cancelUrl`.

**Current Code:**
```javascript
success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?checkout=success`,
cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?checkout=cancelled`,
```

**Issue:** User-provided URLs are accepted without validation.

**Recommendation:**
```javascript
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  'https://tonnguyen.github.io'
];

function validateUrl(url, defaultUrl) {
  if (!url) return defaultUrl;
  
  try {
    const urlObj = new URL(url);
    const origin = urlObj.origin;
    
    if (!ALLOWED_ORIGINS.some(allowed => origin === allowed)) {
      return defaultUrl; // Reject unauthorized origins
    }
    
    // Ensure path starts with / to prevent open redirects
    if (!urlObj.pathname.startsWith('/')) {
      return defaultUrl;
    }
    
    return url;
  } catch {
    return defaultUrl;
  }
}

// Usage:
success_url: validateUrl(successUrl, `${process.env.NEXT_PUBLIC_SITE_URL}/?checkout=success`),
cancel_url: validateUrl(cancelUrl, `${process.env.NEXT_PUBLIC_SITE_URL}/?checkout=cancelled`),
```

---

### 3. **Path Traversal / Injection in URL Parameters**
**Location:** `app/api/polar/checkout/status/route.js:23`, `app/api/polar/checkout/session/route.js:23`  
**Risk:** Malicious input in `checkoutId` and `customerSessionToken` could lead to SSRF or API abuse.

**Current Code:**
```javascript
const checkoutId = searchParams.get('id');
const response = await fetch(`${POLAR_BASE_URL}/v1/checkouts/${checkoutId}`, {
```

**Issue:** No validation that `checkoutId` matches expected format (UUID, alphanumeric, etc.)

**Recommendation:**
```javascript
// Validate UUID format (adjust based on Polar's actual format)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const checkoutId = searchParams.get('id');
if (!checkoutId || !UUID_REGEX.test(checkoutId)) {
  return NextResponse.json(
    { error: 'Invalid checkout ID format' },
    { status: 400 }
  );
}

// Sanitize before using in URL
const sanitizedId = encodeURIComponent(checkoutId);
const response = await fetch(`${POLAR_BASE_URL}/v1/checkouts/${sanitizedId}`, {
```

---

### 4. **Information Disclosure in Error Messages**
**Location:** All API routes  
**Risk:** Error messages expose internal details that could aid attackers.

**Issues:**
- Error messages reveal API structure (`/v1/checkouts`)
- Error messages expose troubleshooting details
- Error messages include full API URLs

**Example:**
```javascript
apiUrl: `${POLAR_BASE_URL}/v1/checkouts`, // Exposes internal API structure
troubleshooting: response.status === 403 
  ? '403 Forbidden: Check that your Polar token has permission...'
```

**Recommendation:**
```javascript
// In production, return generic errors
const isProduction = process.env.NODE_ENV === 'production';

if (!response.ok) {
  const errorMessage = isProduction
    ? 'Failed to create checkout. Please try again later.'
    : (data?.message || data?.detail || 'Failed to create checkout');
    
  return NextResponse.json(
    { error: errorMessage },
    { status: response.status }
  );
}
```

---

### 5. **No Input Validation/Sanitization**
**Location:** `app/api/polar/checkout/route.js:23-30`  
**Risk:** Invalid or malicious input could cause API errors or unexpected behavior.

**Issues:**
- `productId` - Only checks for presence, not format
- `quantity` - No validation (could be negative, zero, or extremely large)
- `metadata` - No validation of structure or size

**Recommendation:**
```javascript
import { z } from 'zod'; // npm install zod

const checkoutSchema = z.object({
  productId: z.string().uuid().min(1).max(100),
  quantity: z.number().int().positive().max(100).default(1),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  metadata: z.record(z.unknown()).max(50).optional(), // Max 50 keys
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validated = checkoutSchema.parse(body);
    // Use validated.productId, validated.quantity, etc.
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

---

### 6. **Session Token Exposure**
**Location:** `components/Terminal.js:160, 264`  
**Risk:** Customer session tokens are partially exposed in error messages.

**Current Code:**
```javascript
Session Token: {customerSessionToken.substring(0, 30)}...
```

**Issue:** Even partial exposure could be risky if tokens are predictable.

**Recommendation:**
```javascript
// Don't expose tokens at all, or use a hash
import crypto from 'crypto';

const tokenHash = crypto
  .createHash('sha256')
  .update(customerSessionToken)
  .digest('hex')
  .substring(0, 8);

// Display: Session Token: [redacted] (hash: ${tokenHash})
```

---

### 7. **No Content Security Policy (CSP)**
**Location:** `app/layout.js`  
**Risk:** Vulnerable to XSS attacks from external scripts.

**Issue:** External scripts loaded without CSP headers:
- `https://www.bubblav.com/widget.js`
- `https://www.bubblav.com/search.js`
- Google Fonts

**Recommendation:**
Add to `next.config.js`:
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.bubblav.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://sandbox-api.polar.sh https://api.polar.sh",
            ].join('; '),
          },
        ],
      },
    ];
  },
  // ... rest of config
};
```

---

### 8. **External Scripts Without Integrity Checks**
**Location:** `app/layout.js:147-148`  
**Risk:** If CDN is compromised, malicious scripts could be injected.

**Current Code:**
```html
<script src="https://www.bubblav.com/widget.js" ...></script>
<script src="https://www.bubblav.com/search.js" ...></script>
```

**Recommendation:**
```html
<!-- If SRI hashes are available from bubblav.com -->
<script 
  src="https://www.bubblav.com/widget.js" 
  integrity="sha384-..." 
  crossorigin="anonymous"
  defer
></script>

<!-- Or load via Next.js Script component with strategy -->
import Script from 'next/script';

<Script
  src="https://www.bubblav.com/widget.js"
  strategy="afterInteractive"
  onError={(e) => console.error('Script failed to load', e)}
/>
```

---

## 🟠 High-Priority Issues

### 9. **No CORS Configuration**
**Location:** API routes  
**Risk:** Uncontrolled cross-origin requests.

**Recommendation:**
```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://tonnguyen.github.io',
    process.env.NEXT_PUBLIC_SITE_URL,
  ].filter(Boolean);
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

---

### 10. **Multiple Environment Variable Fallbacks**
**Location:** All API routes  
**Risk:** Confusing configuration, potential for misconfiguration.

**Current Code:**
```javascript
const POLAR_KEY =
  process.env.POLAR_ACCESS_TOKEN ||
  process.env.POLAR_SANDBOX_KEY ||
  process.env.POLAR_KEY ||
  process.env.POLAR_OAT ||
  process.env.POLAR_TOKEN;
```

**Recommendation:**
```javascript
// Use only one canonical name
const POLAR_KEY = process.env.POLAR_ACCESS_TOKEN;

if (!POLAR_KEY) {
  throw new Error('POLAR_ACCESS_TOKEN environment variable is required');
}
```

---

### 11. **Client-Side Exposure of Product IDs**
**Location:** `components/SkateboardsList.js:15, 24, 33, 42, 53`  
**Risk:** Product IDs exposed in client-side code.

**Issue:** `NEXT_PUBLIC_*` variables are bundled into client-side JavaScript.

**Recommendation:**
- If product IDs are sensitive, fetch them server-side
- Or ensure product IDs are meant to be public (if so, document this)

---

### 12. **No Request Size Limits**
**Location:** API routes  
**Risk:** Large payloads could cause DoS.

**Recommendation:**
```javascript
// In API route
export async function POST(req) {
  const contentLength = req.headers.get('content-length');
  const MAX_SIZE = 1024 * 10; // 10KB
  
  if (contentLength && parseInt(contentLength) > MAX_SIZE) {
    return NextResponse.json(
      { error: 'Request too large' },
      { status: 413 }
    );
  }
  
  // ... rest of handler
}
```

---

### 13. **Insecure Default URLs**
**Location:** `app/api/polar/checkout/route.js:41, 44`  
**Risk:** Falls back to `http://localhost:3000` which could be exploited.

**Recommendation:**
```javascript
const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
if (!DEFAULT_SITE_URL) {
  throw new Error('NEXT_PUBLIC_SITE_URL must be set in production');
}

success_url: successUrl || `${DEFAULT_SITE_URL}/?checkout=success`,
```

---

## 🟡 Medium-Priority Issues

### 14. **dangerouslySetInnerHTML Usage**
**Location:** `app/layout.js:135`  
**Risk:** Potential XSS if structured data is compromised.

**Current Code:**
```javascript
dangerouslySetInnerHTML={{
  __html: JSON.stringify(structuredData),
}}
```

**Status:** ✅ **LOW RISK** - Using `JSON.stringify` is safe, but consider alternatives.

**Recommendation:**
```javascript
// Use Next.js Script component instead
import Script from 'next/script';

<Script
  id="structured-data"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(structuredData),
  }}
/>
```

---

### 15. **No Request Timeout**
**Location:** API routes  
**Risk:** Hanging requests could exhaust server resources.

**Recommendation:**
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

try {
  const response = await fetch(url, {
    signal: controller.signal,
    // ... other options
  });
  clearTimeout(timeoutId);
} catch (error) {
  clearTimeout(timeoutId);
  if (error.name === 'AbortError') {
    return NextResponse.json(
      { error: 'Request timeout' },
      { status: 504 }
    );
  }
  throw error;
}
```

---

### 16. **Missing Security Headers**
**Location:** `next.config.js`  
**Risk:** Missing standard security headers.

**Recommendation:**
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  // ... rest of config
};
```

---

## ✅ Good Security Practices Found

1. ✅ Environment variables properly excluded from git (`.gitignore`)
2. ✅ No hardcoded secrets in code
3. ✅ API keys stored server-side (not exposed to client)
4. ✅ Using HTTPS for external API calls
5. ✅ Input validation present (basic checks)
6. ✅ Error handling implemented

---

## Action Items Priority

### Immediate (Critical)
1. Implement rate limiting on all API routes
2. Add URL validation for `successUrl` and `cancelUrl`
3. Add input validation using Zod or similar
4. Implement CSP headers

### Short-term (High Priority)
5. Add CORS configuration
6. Reduce environment variable fallbacks
7. Add request size limits
8. Remove information disclosure from error messages

### Medium-term (Medium Priority)
9. Add security headers
10. Add request timeouts
11. Review external script loading

---

## Testing Recommendations

1. **Penetration Testing:**
   - Test API endpoints for rate limiting bypass
   - Test URL injection vectors
   - Test input validation boundaries

2. **Automated Security Scanning:**
   ```bash
   npm audit
   npm install -D snyk
   snyk test
   ```

3. **Dependency Updates:**
   - Regularly update dependencies
   - Monitor security advisories

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)

---

**Report Generated:** 2025-01-27  
**Next Review Date:** After implementing critical fixes

