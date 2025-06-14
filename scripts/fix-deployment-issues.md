# Deployment Issue Quick Fixes

## 🚨 Common Next.js Deployment Errors

### 1. Unescaped Quotes Error

```
Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.
```

**Fix:**

```jsx
// ❌ Wrong
<p>This can include 'size', specs, etc'.</p>

// ✅ Correct
<p>This can include &apos;size&apos;, specs, etc&apos;.</p>
```

### 2. Image Tag Warnings

```
Warning: Using `<img>` could result in slower LCP and higher bandwidth.
Warning: img elements must have an alt prop.
```

**Fix:**

```jsx
// ❌ Wrong
<img src="/icon.svg" />;

// ✅ Correct
import Image from "next/image";
<Image src="/icon.svg" alt="Description" width={16} height={16} />;
```

## 🛠️ Quick Commands

### Run ESLint Check

```bash
npm run lint
```

### Fix Auto-fixable Issues

```bash
npm run lint -- --fix
```

### Check Before Deploy

```bash
npm run build
```

## 📋 Checklist Before Deploy

- [ ] No unescaped quotes (`'` should be `&apos;`)
- [ ] All img tags have alt attributes
- [ ] Use Next.js Image component for optimization
- [ ] Run `npm run lint` and fix all errors
- [ ] Run `npm run build` successfully

## 🔧 ESLint Rules to Add

Add these to `.eslintrc.json`:

```json
{
  "rules": {
    "@next/next/no-img-element": "error",
    "jsx-a11y/alt-text": "error",
    "react/no-unescaped-entities": "error"
  }
}
```
