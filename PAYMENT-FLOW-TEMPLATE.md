# Paga Payment Flow — Implementation Template

> **Source:** !Not Tech Ltd official website consultation feature  
> **Purpose:** Template for implementing Paga checkout in a new product  
> **Date:** July 22, 2026

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [File Structure](#2-file-structure)
3. [Complete Flow Diagram](#3-complete-flow-diagram)
4. [File-by-File Implementation](#4-file-by-file-implementation)
   - [4.1 Constants — `constants/consultation.ts`](#41-constants---constantsconsultationts)
   - [4.2 Paga Utility — `utils/pagaCheckout.ts`](#42-paga-utility---utilspagacheckoutts)
   - [4.3 Form Component — `components/ConsultationForm.tsx`](#43-form-component---componentsconsultationformtsx)
   - [4.4 API Route — `api/consultation/route.ts`](#44-api-route---apiconsultationroutets)
   - [4.5 Page — `consultation/page.tsx`](#45-page---consultationpagetsx)
5. [Paga API Parameters Reference](#5-paga-api-parameters-reference)
6. [Key Design Decisions](#6-key-design-decisions)
7. [Environment Variables](#7-environment-variables)
8. [Implementation Checklist (New Project)](#8-implementation-checklist-new-project)
9. [Potential Enhancements](#9-potential-enhancements)

---

## 1. Architecture Overview

This is a **redirect-based payment flow** using Paga Checkout. The architecture follows a simple pattern:

```
[User Form] → [API (email notification)] → [Paga Checkout] → [Google Calendar]
```

**Core Principles:**

| Principle | Implementation |
|-----------|---------------|
| **Stateless** | No database; form data is emailed, not stored |
| **Graceful degradation** | Email failure does NOT block payment |
| **Decoupled** | Payment is handled entirely by Paga's hosted page |
| **Single fixed price** | The consultation fee is a constant |
| **No webhooks** | Post-payment flow is handled externally (Google Calendar) |

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** (App Router) | Framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Resend** | Email delivery |
| **Paga Checkout** | Payment processing |

---

## 2. File Structure

```
app/
├── constants/
│   └── consultation.ts          # Paga config + form options (single source of truth)
├── utils/
│   └── pagaCheckout.ts          # Pure function to build Paga checkout URL
├── types/
│   └── index.ts                 # Shared TypeScript interfaces
├── components/
│   └── forms/
│       └── ConsultationForm.tsx  # Orchestrator: form state, validation, submission
├── api/
│   └── consultation/
│       └── route.ts             # Server endpoint: sends email notification
├── consultation/
│   └── page.tsx                 # Route page: hero + form + info note
└── lib/
    └── email.ts                 # (Optional) SMTP transporter — NOT used by consultation
```

---

## 3. Complete Flow Diagram

```
User navigates to /consultation
         │
         ▼
  ConsultationPage renders:
  ┌─────────────────────────────────────┐
  │  Hero: Headline + feature badges    │
  │  ┌───────────────────────────────┐  │
  │  │ ConsultationForm              │  │
  │  │  ┌─────────────────────────┐  │  │
  │  │  │ Name*                  │  │  │
  │  │  │ Email*                 │  │  │
  │  │  │ Phone*                 │  │  │
  │  │  │ Company (optional)     │  │  │
  │  │  │ Project Type*          │  │  │
  │  │  │ Budget Range (optional)│  │  │
  │  │  │ Timeline*              │  │  │
  │  │  │ Description*           │  │  │
  │  │  │                        │  │  │
  │  │  │ [Proceed to Payment]   │  │  │
  │  │  └─────────────────────────┘  │  │
  │  └───────────────────────────────┘  │
  │  Info note: "After payment, go to  │
  │  calendar with your payment ref"   │
  └─────────────────────────────────────┘
         │
         ▼  (User clicks "Proceed to Payment")
  ┌─────────────────────────────────────────┐
  │  Form validation check                  │
  │  → Button disabled until ALL pass       │
  │  → Real-time validation on change/blur  │
  └─────────────────────────────────────────┘
         │  (If valid)
         ▼
  ┌─────────────────────────────────────────┐
  │  Step 1: POST /api/consultation         │
  │  → Sends email via Resend with form data│
  │  → ⚠️ FAILURE DOES NOT BLOCK FLOW      │
  └─────────────────────────────────────────┘
         │
         ▼
  ┌─────────────────────────────────────────┐
  │  Step 2: buildPagaCheckoutUrl(email,ph) │
  │  → Constructs URL with URLSearchParams  │
  └─────────────────────────────────────────┘
         │
         ▼
  ┌─────────────────────────────────────────┐
  │  Step 3: window.location.href = url     │
  │  → Redirects browser to Paga Checkout   │
  └─────────────────────────────────────────┘
         │
         ▼
  ┌─────────────────────────────────────────────┐
  │  Paga Checkout Page (hosted by Paga)         │
  │  → User enters card/bank details             │
  │  → User sees: "Make Payment" button          │
  │  → Amount: ₦500,000                          │
  └─────────────────────────────────────────────┘
         │  (Payment successful)
         ▼
  ┌─────────────────────────────────────────────┐
  │  Redirected to charge_url:                  │
  │  → Google Calendar booking page             │
  │  → User enters payment reference to book    │
  └─────────────────────────────────────────────┘
```

---

## 4. File-by-File Implementation

### 4.1 Constants — `constants/consultation.ts`

**Role:** Single source of truth for all payment and form configuration.

```typescript
export const CONSULTATION_CONFIG = {
  // ── Paga Checkout ──
  paga: {
    baseUrl: 'https://checkout.paga.com/checkout/params',
    publicKey: process.env.NEXT_PUBLIC_PAGA_PUBLIC_KEY || 'FALLBACK_KEY',
    amount: '500000.00',          // NGN (kobo format: 2 decimal places)
    currency: 'NGN',
    buttonLabel: 'Make Payment',
  },

  // ── Post-Payment Redirect ──
  calendar: {
    chargeUrl: 'https://calendar.app.google/YOUR_CALENDAR_ID',
  },
} as const;

// ── Form Dropdown Options ──
export const PROJECT_TYPES = [
  'New Product',
  'MVP Build',
  'Modernization',
  'Consulting/Advisory',
  'Other',
] as const;

export const BUDGET_RANGES = [
  '< ₦1,000,000',
  '₦1,000,000 - ₦2,500,000',
  '₦2,500,000 - ₦5,000,000',
  '₦5,000,000 - ₦10,000,000',
  '> ₦10,000,000',
] as const;

export const TIMELINES = [
  'ASAP',
  '1-3 months',
  '3-6 months',
  '6-12 months',
  'Just exploring',
] as const;
```

**Why `as const`?** Makes all values literal TypeScript types — prevents accidental mutation and gives you autocomplete.

**Config spread:** If your new product has dynamic pricing, move the `amount` to be computed at runtime instead of a constant.

---

### 4.2 Paga Utility — `utils/pagaCheckout.ts`

**Role:** Pure function to build the Paga checkout URL. No side effects, easy to test.

```typescript
import { CONSULTATION_CONFIG } from '@/app/constants/consultation';

/**
 * Builds the Paga checkout URL with user email and phone number
 *
 * @param email - User's email address
 * @param phone - User's phone number
 * @returns Complete Paga checkout URL with properly encoded parameters
 */
export const buildPagaCheckoutUrl = (email: string, phone: string): string => {
  const { baseUrl, publicKey, amount, currency, buttonLabel } = CONSULTATION_CONFIG.paga;
  const { chargeUrl } = CONSULTATION_CONFIG.calendar;

  const params = new URLSearchParams({
    public_key: publicKey,
    amount: amount,
    currency: currency,
    phone_number: phone,
    email: email,
    charge_url: chargeUrl,
    button_label: buttonLabel,
  });

  return `${baseUrl}?${params.toString()}`;
};
```

**Key decisions:**
- **`URLSearchParams`** vs. string concatenation → proper encoding of special characters
- **Pure function** → no DOM access, no side effects, testable in isolation
- **All config imported** → no magic strings in the function body

---

### 4.3 Form Component — `components/ConsultationForm.tsx`

**Role:** The orchestrator — manages form state, validation, submission, and redirect.

#### State Shape

```typescript
interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;       // Optional
  projectType: string;
  budgetRange: string;   // Optional
  timeline: string;
  description: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  // ... same fields as FormData
}
```

#### Three State Tracks

| Track | Type | Purpose |
|-------|------|---------|
| `formData` | `FormData` | Current field values |
| `errors` | `FormErrors` | Per-field validation messages |
| `status` | `'idle' \| 'submitting' \| 'success' \| 'error'` | Form submission state |

#### Validation Strategy

```
handleChange(name, value)
  → validateField(name, value)
    → updates errors state immediately (real-time feedback)

handleBlur(name, value)
  → validateField(name, value)
    → updates errors state on field exit

useEffect([formData, errors])
  → checks ALL required fields have values AND no errors exist
  → updates isFormValid (controls button disabled state)
```

**Per-field validation rules:**

| Field | Required | Rule |
|-------|----------|------|
| `name` | ✅ | Min 2 characters |
| `email` | ✅ | Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| `phone` | ✅ | Min 5 digits after stripping `+`, `-`, spaces |
| `company` | ❌ | No validation |
| `projectType` | ✅ | Must select a non-empty value |
| `budgetRange` | ❌ | No validation |
| `timeline` | ✅ | Must select a non-empty value |
| `description` | ✅ | Min 10 chars, max 1000 chars |

#### Submit Handler — The Critical Flow

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isFormValid) return;          // ← Guard (belt-and-suspenders)

  setStatus('submitting');

  try {
    // ── Step 1: Email Notification (fire-and-forget) ──
    const response = await fetch('/api/consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    // NOTE: We don't check response.ok here!
    // Email failure should NOT block payment

    // ── Step 2: Build Paga URL ──
    const checkoutUrl = buildPagaCheckoutUrl(formData.email, formData.phone);

    // ── Step 3: Redirect ──
    window.location.href = checkoutUrl;

  } catch (error) {
    // This only catches network/fetch errors
    // But we still redirect anyway — graceful degradation
    console.error('Error:', error);
    setStatus('error');
  }
};
```

---

### 4.4 API Route — `api/consultation/route.ts`

**Role:** Server endpoint that receives form data and sends an email notification.

```typescript
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, projectType, budgetRange, timeline, description } = body;

    // Basic validation for required fields
    if (!name || !email || !phone || !projectType || !timeline || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (resend) {
      await resend.emails.send({
        from: 'Your App <noreply@yourdomain.com>',
        to: ['admin@yourdomain.com'],
        replyTo: email,
        subject: `New Consultation Request from ${name}`,
        html: `
          <h2>New Consultation Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <p><strong>Budget Range:</strong> ${budgetRange || 'Not provided'}</p>
          <p><strong>Timeline:</strong> ${timeline}</p>
          <p><strong>Description:</strong><br/>${description.replace(/\n/g, '<br>')}</p>
        `,
      });
    } else {
      // Dev mode — log to console instead
      console.log('Resend not configured. Form data:', { name, email, phone, /* ... */ });
    }

    // ALWAYS return success — don't block the payment flow
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: true });  // ← Still success!
  }
}
```

**Critical pattern:** The catch block and the configured-but-fails path both return `{ success: true }`. This is intentional — the form component depends on getting a 200 response to continue the redirect.

---

### 4.5 Page — `consultation/page.tsx`

**Role:** Route page — composition of hero, form, and info sections.

```
┌─────────────────────────────────────┐
│  Hero Section (min-h-[60vh])         │
│  Title: "Book a Consultation"        │
│  Subtitle: "Let's discuss your..."    │
│  Feature badges:                      │
│    🕐 30-minute session               │
│    ✓ Expert guidance                  │
│    👥 Personalized approach           │
├─────────────────────────────────────┤
│  Form Section                         │
│  ┌─────────────────────────────────┐ │
│  │  "Consultation Details"        │ │
│  │  [ConsultationForm component]  │ │
│  └─────────────────────────────────┘ │
│  Info box:                            │
│  ℹ️ "After payment, you'll be       │
│     redirected to calendar with      │
│     your payment reference"         │
└─────────────────────────────────────┘
```

**Note:** This is a `'use client'` page because it directly uses Framer Motion. The form component is also `'use client'`.

---

## 5. Paga API Parameters Reference

These are the parameters sent to Paga Checkout:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `public_key` | string | ✅ | Your Paga merchant public key (UUID format) |
| `amount` | string | ✅ | Amount in major currency units with 2 decimals (e.g., `500000.00`) |
| `currency` | string | ✅ | ISO currency code (e.g., `NGN`) |
| `phone_number` | string | ✅ | Customer's phone number |
| `email` | string | ✅ | Customer's email address |
| `charge_url` | string | ✅ | URL to redirect to after payment completes |
| `button_label` | string | ❌ | Text for the pay button on Paga's page |

**Paga Checkout URL format:**
```
https://checkout.paga.com/checkout/params?public_key=xxx&amount=500000.00&currency=NGN&phone_number=xxx&email=xxx&charge_url=xxx&button_label=Make+Payment
```

---

## 6. Key Design Decisions

### 6.1 Why No Webhook / Payment Verification?

The current flow does **not** verify payment server-side. Instead:

- User enters payment reference **manually** on Google Calendar when booking
- The calendar owner validates the reference before confirming

This keeps the implementation simple but means:
- **No server-side payment confirmation**
- **No automatic scheduling**
- **Manual reconciliation**

### 6.2 Why No Database?

- Minimum viable feature — get to payment fast
- Consultation data lives in email inbox
- No user accounts or sessions required

### 6.3 Why Does the API Always Return Success?

The form component needs a 200 response to proceed with the redirect. If the API returns an error, the user sees an error message and cannot proceed to payment. By always returning success:

- **Email outage** → doesn't block revenue
- **Network blip** → doesn't frustrate user
- **Misconfigured env** → still works in development

### 6.4 Why URLSearchParams Instead of String Concatenation?

```typescript
// ✅ Good: URLSearchParams handles encoding
new URLSearchParams({ email: 'test+tag@email.com' })
// → email=test%2Btag%40email.com

// ❌ Bad: Manual concatenation breaks with special chars
`?email=${email}`  // → email=test+tag@email.com (spaces not encoded)
```

---

## 7. Environment Variables

```bash
# Required for Paga (make public for client-side use)
NEXT_PUBLIC_PAGA_PUBLIC_KEY=DFE148C3-5352-4361-A2B8-6F933D27B48C

# Required for email notifications
RESEND_API_KEY=re_xxxxxxxxxxxx
```

**Note:** The current implementation hardcodes the public key in `consultation.ts`. For production, move it to an environment variable as shown above.

---

## 8. Implementation Checklist (New Project)

### Phase 1: Scaffold

- [ ] Create constants file with Paga config and form options
- [ ] Create Paga utility with `buildPagaCheckoutUrl` function
- [ ] Create API route with Resend email logic
- [ ] Create form component with validation + submission
- [ ] Create route page with layout

### Phase 2: Configuration

- [ ] Set `NEXT_PUBLIC_PAGA_PUBLIC_KEY` in environment
- [ ] Set `RESEND_API_KEY` in environment
- [ ] Update `charge_url` to your calendar/bookings page
- [ ] Update `amount` to your product's price
- [ ] Update email sender (`from`) and recipient (`to`) addresses

### Phase 3: Customization

- [ ] Adjust form fields for your product
- [ ] Update validation rules
- [ ] Modify UI styling to match your brand
- [ ] Add/remove optional fields

### Phase 4: Enhancements (Optional)

- [ ] Add database persistence
- [ ] Add payment webhook verification
- [ ] Add automatic calendar booking
- [ ] Add payment reference validation

---

## 9. Potential Enhancements

If you need more than the current flow provides, consider:

| Enhancement | Why | Complexity |
|-------------|-----|------------|
| **Database storage** | Track consultations, payment status, user history | Medium |
| **Payment webhook** | Automatically confirm payment, trigger scheduling | High |
| **Dynamic pricing** | Different amounts based on project type | Low |
| **User accounts** | Saved profiles, order history | High |
| **Email templates** | Professional HTML emails with branding | Low |
| **Payment reference validation** | Verify reference before showing calendar | Medium |
| **Automatic calendar booking** | API-based scheduling (Google Calendar API) | High |
| **Multiple payment methods** | Add Paystack, Flutterwave alongside Paga | Medium |
| **Order summary email** | Send receipt after payment confirmation | Low |

---

## Quick Start (Copy-Paste Recipe)

For a new Next.js project, you need exactly **5 files**:

```
your-new-product/
├── constants/
│   └── payment.ts           ← Copy from 4.1, adjust values
├── utils/
│   └── buildCheckoutUrl.ts  ← Copy from 4.2
├── components/
│   └── CheckoutForm.tsx      ← Copy from 4.3, adapt fields
├── app/
│   ├── api/
│   │   └── checkout/
│   │       └── route.ts     ← Copy from 4.4
│   └── checkout/
│       └── page.tsx         ← Copy from 4.5
└── .env.local               ← Add your keys
```

**Dependencies to install:**
```bash
npm install resend framer-motion
```
