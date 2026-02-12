# Design Guidelines

This document outlines the UI/UX patterns, component standards, and design principles used throughout the application. Reference this when making UI updates to maintain consistency.

## Table of Contents
- [Typography](#typography)
- [Colors](#colors)
- [Spacing & Layout](#spacing--layout)
- [Components](#components)
- [Forms](#forms)
- [Loading States](#loading-states)
- [Empty States](#empty-states)
- [Error Handling](#error-handling)
- [Toasts & Notifications](#toasts--notifications)
- [Modals](#modals)
- [Animations](#animations)
- [Best Practices](#best-practices)

---

## Typography

### Font Family
- **Primary**: `Poppins` (sans-serif)
- Applied globally via `globals.css`

### Font Sizes
- **Headings**: `text-xl md:text-2xl` (24px on mobile, 32px on desktop)
- **Subheadings**: `text-xs md:text-sm` (12px on mobile, 14px on desktop)
- **Body**: `text-base` (16px)
- **Labels**: `text-base font-semibold` (16px, semibold)

### Font Weights
- **Bold**: `font-bold` (700) - Used for headings
- **Semibold**: `font-semibold` (600) - Used for labels and subheadings
- **Normal**: `font-normal` (400) - Default body text
- **Medium**: `font-medium` (500) - Used for emphasis

---

## Colors

### Primary Colors
- **Primary Button**: `#3c4948` (dark green-gray)
  - Hover: `#2a3a39`
- **Secondary Button**: `#f7f7f7` (light gray)
- **Green Accent**: `#1eb62d` (used for success states)

### Text Colors
- **Primary Text**: `#181725` (near black)
- **Secondary Text**: `#979797` (gray)
- **Text Gray 2**: `text-textGray2` (custom gray)
- **Label Color**: `text-label_color` (custom)

### Background Colors
- **Page Background**: `#FCFCFC` (off-white)
- **Card Background**: `#FCFCFC` (off-white)
- **Input Background**: `#F7F7F7` (light gray)
- **Disabled Background**: `#E5E5E5` (medium gray)

### Border Colors
- **Border**: `#EDEDED` (light gray)
- **Border Color**: `border-borderColor` (custom)
- **Error Border**: `border-red-500`

### Toast Colors
- **Success**: Background `#ECFDF3`, Text `#027A48`
- **Error**: Background `#FEF3F2`, Text `#B42318`
- **Warning**: Background `#FFFAEB`, Text `#B54708`
- **Info**: Background `#F0F9FF`, Text `#1E40AF`

---

## Spacing & Layout

### Spacing Scale
- **2xs**: `0.25rem` (4px)
- **xs**: `0.5rem` (8px)
- **sm**: `0.75rem` (12px)
- **md**: `1rem` (16px)
- **ml**: `1.25rem` (20px)
- **lg**: `2rem` (32px)
- **xl**: `3.25rem` (52px)
- **2xl**: `5rem` (80px)

### Common Spacing Patterns
- **Card Padding**: `p-8 md:p-14` (32px mobile, 56px desktop)
- **Form Input Spacing**: `mb-3` (12px between inputs)
- **Section Spacing**: `mt-4 md:mt-6` (16px mobile, 24px desktop)
- **Button Margin**: `my-[2em]` (2em vertical margin)

### Container Widths
- **Max Container**: `max-w-[604px]` (forms/auth screens)
- **Card Width**: `w-[90%] max-w-[604px]` (responsive cards)
- **Modal Width**: `w-11/12 md:w-1/2 max-w-lg` (responsive modals)

### Border Radius
- **Cards/Forms**: `rounded-3xl` (24px)
- **Buttons**: `rounded-md` (4px, via globals.css)
- **Modals**: `rounded-xl` (12px)
- **Inputs**: `rounded-md` (6px)

---

## Components

### Button (`app/components/common/Button.tsx`)

**Props:**
- `type`: `"button" | "submit" | "reset"` (required)
- `primary`: boolean (applies `btn-primary` class)
- `secondary`: boolean (applies `btn-secondary` class)
- `isLoading`: boolean (shows Preloader)
- `disabled`: boolean
- `className`: string (additional classes)
- `children` or `label`: ReactNode | string

**Usage:**
```tsx
<Button type="submit" primary className="w-full" isLoading={isLoading}>
  Submit
</Button>
```

**Styles:**
- Primary: `#3c4948` background, white text, hover `#2a3a39`
- Secondary: `#f7f7f7` background, black text, shadow
- Default padding: `py-[.9em] px-[1.3em]`
- Loading state: Shows `Preloader` component

---

### Input (`app/components/common/Input.tsx`)

**Props:**
- `name`: string (required)
- `label`: string (optional)
- `type`: string
- `value`: string
- `onChange`: `(e: ChangeEvent<HTMLInputElement>) => void`
- `error`: string (optional, displays below input)
- `helperText`: string (optional, displays above input)
- `disabled`: boolean
- `required`: boolean
- `prefix`/`suffix`: string (optional)
- `min`/`max`/`step`: string | number (for number inputs)

**Usage:**
```tsx
<Input
  label="Email Address"
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  placeholder="abc@gmail.com"
  className="border-gray-300 rounded w-100 mb-3"
  error={error}
  helperText="Helper text here"
/>
```

**Styles:**
- Height: `64px` (fixed)
- Background: `#F7F7F7` (disabled: `#E5E5E5`)
- Label: `text-black3 text-base font-semibold mb-2`
- Error text: `text-red-500 text-sm`
- Helper text: `text-xs text-gray-500 mb-2`
- Password toggle: Eye icon on right side

---

### Modal (`app/components/common/Modal.tsx`)

**Props:**
- `isOpen`: boolean
- `onClose`: `() => void`
- `children`: ReactNode
- `closeIcon`: boolean (optional, shows X button)

**Usage:**
```tsx
<Modal isOpen={isOpen} onClose={handleClose} closeIcon>
  <div>Modal content</div>
</Modal>
```

**Styles:**
- Backdrop: `bg-black/50 backdrop-blur-sm`
- Modal: `bg-white rounded-xl shadow-xl`
- Width: `w-11/12 md:w-1/2 max-w-lg`
- Padding: `p-5`
- Z-index: `z-[60]`
- Animation: Framer Motion scale/fade

**Behavior:**
- Prevents body scroll when open
- Closes on backdrop click
- Close icon: `top-3 right-3` positioned

---

### Table (`app/components/common/Table.tsx`)

**Props:**
- `columns`: `Column<T>[]` (header, key, render, className)
- `data`: `T[]`
- `isLoading`: boolean
- `emptyState`: ReactNode (optional)
- `onRowClick`: `(item: T) => void` (optional)

**Usage:**
```tsx
<Table
  columns={columns}
  data={products}
  isLoading={loading}
  emptyState={<p>No products found</p>}
  onRowClick={(item) => handleRowClick(item)}
/>
```

**Styles:**
- Header: `border shadow-sm rounded-lg border-[#e5e7eba7]`
- Header cells: `px-6 py-4 text-left text-sm font-medium text-gray-500`
- Body cells: `px-6 py-4 text-sm`
- Row hover: `hover:bg-gray-50` (when `onRowClick` provided)

---

### Preloader (`app/components/common/Preloader.tsx`)

**Props:**
- `height`: number (optional, default: 45)
- `color`: string (optional, default: "#52bf")

**Usage:**
```tsx
<Preloader height={25} color="#fff" />
```

**Styles:**
- Uses `react-loader-spinner` Oval component
- Centered with flexbox

---

## Forms

### Form Structure

**Container:**
```tsx
<div className="rounded-3xl border-2 border-[#EDEDED] p-8 md:p-14 bg-[#FCFCFC] w-[90%] max-w-[604px]">
  {/* Form content */}
</div>
```

**Form Element:**
```tsx
<form className="w-full mt-4 md:mt-6" onSubmit={handleSubmit}>
  {/* Inputs */}
</form>
```

**Header Section:**
```tsx
<div className="text-center">
  <p className="font-bold text-xl md:text-2xl">Form Title</p>
  <p className="font-semibold text-[#979797] text-xs md:text-sm mt-1">
    Subtitle or description
  </p>
</div>
```

### Form Validation

**Pattern:**
1. Client-side validation before submission
2. Show error messages below inputs (`error` prop)
3. Show toast notifications for submission errors
4. Clear errors when user types

**Example:**
```tsx
const validateForm = () => {
  const errors: { email?: string } = {};
  if (!email) {
    errors.email = "Email is required";
  }
  setErrors(errors);
  return Object.keys(errors).length === 0;
};
```

---

## Loading States

### Button Loading
Use `isLoading` prop on `Button` component:
```tsx
<Button type="submit" isLoading={isLoading}>
  Submit
</Button>
```

### Page/Component Loading
Use `Preloader` component:
```tsx
{loading ? (
  <Preloader height={45} />
) : (
  <div>Content</div>
)}
```

### Table Loading
Table component handles loading internally:
```tsx
<Table columns={columns} data={data} isLoading={loading} />
```

---

## Empty States

### Table Empty State
```tsx
<Table
  columns={columns}
  data={data}
  emptyState={
    <div className="text-center py-8">
      <p className="text-gray-500">No items found</p>
    </div>
  }
/>
```

### Custom Empty State Pattern
```tsx
{items.length === 0 ? (
  <div className="flex items-center justify-center p-8">
    <p className="text-gray-500">No items available</p>
  </div>
) : (
  <div>{/* Content */}</div>
)}
```

---

## Error Handling

### Input Errors
- Display error message below input field
- Use `error` prop on `Input` component
- Error text: `text-red-500 text-sm`
- Error border: `border-red-500`

### API Errors
- Extract error message from `error.response.data.message`
- Show error toast notification
- Fallback message: "Failed to [action]. Please try again."

**Pattern:**
```tsx
try {
  await apiCall();
} catch (error: any) {
  let errorMessage = "Failed to perform action. Please try again.";
  if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
  }
  showToast(errorMessage, "error");
}
```

---

## Toasts & Notifications

### Using `showToast` Helper

**Import:**
```tsx
import { showToast } from "@/app/components/utils/helperFunctions";
```

**Usage:**
```tsx
showToast("Success message", "success");
showToast("Error message", "error");
showToast("Warning message", "warning");
showToast("Info message", "info");
```

**Options:**
```tsx
showToast("Message", "success", {
  duration: 3000, // milliseconds
  position: "right", // "left" | "center" | "right"
  gravity: "top", // "top" | "bottom"
});
```

### Toast Styles
- Position: `top-right` by default
- Duration: `3000ms` by default
- Style: Rounded corners, border, icon prefix
- Colors: See [Colors > Toast Colors](#colors)

### Toast Icons
- Success: `✓`
- Error: `✕`
- Warning: `⚠`
- Info: `ℹ`

---

## Modals

### Modal Pattern

**State Management:**
```tsx
const [isOpen, setIsOpen] = useState(false);
const openModal = () => setIsOpen(true);
const closeModal = () => setIsOpen(false);
```

**Usage:**
```tsx
<Modal isOpen={isOpen} onClose={closeModal} closeIcon>
  <div>
    {/* Modal content */}
  </div>
</Modal>
```

**Modal Content:**
- Use `p-6` or `p-5` for padding
- Keep content focused and concise
- Include action buttons (primary/secondary)

---

## Animations

### Framer Motion

**Installation:** Already included in project

**Common Patterns:**

**Page Transitions:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

**Modal Animations:**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.96, y: 16 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.96, y: 16 }}
  transition={{ type: "spring", duration: 0.25 }}
>
  {content}
</motion.div>
```

**Button Hover:**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Button
</motion.button>
```

**Transition Variants (for forms):**
```tsx
const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
```

---

## Best Practices

### Component Structure
1. **Keep components small and focused**
2. **Use TypeScript for type safety**
3. **Extract reusable logic into custom hooks**
4. **Follow single responsibility principle**

### State Management
1. **Use Context API for global state** (CartContext, UserContext)
2. **Use local state for component-specific state**
3. **Implement optimistic UI updates for better UX**

### Error Handling
1. **Always use try/catch for async operations**
2. **Show user-friendly error messages**
3. **Implement rollback for optimistic updates**
4. **Handle edge cases (empty data, network errors)**

### Code Organization
1. **Services in `app/services/`** (API calls)
2. **Components in `app/components/`**
3. **Types in `app/types/`**
4. **Utils in `app/components/utils/`**

### Accessibility
1. **Use semantic HTML**
2. **Include proper labels for inputs**
3. **Provide ARIA attributes where needed**
4. **Ensure keyboard navigation works**

### Performance
1. **Use `useCallback` for event handlers passed to children**
2. **Use `useMemo` for expensive computations**
3. **Implement pagination for large lists**
4. **Lazy load components when appropriate**

### Testing Considerations
1. **Test loading states**
2. **Test error states**
3. **Test empty states**
4. **Test form validation**
5. **Test optimistic updates with rollback**

---

## Quick Reference

### Common Class Combinations

**Card Container:**
```tsx
className="rounded-3xl border-2 border-[#EDEDED] p-8 md:p-14 bg-[#FCFCFC] w-[90%] max-w-[604px]"
```

**Form Section Header:**
```tsx
className="text-center"
// Title: font-bold text-xl md:text-2xl
// Subtitle: font-semibold text-[#979797] text-xs md:text-sm mt-1
```

**Full Width Button:**
```tsx
className="w-full"
```

**Input Container:**
```tsx
className="border-gray-300 rounded w-100 mb-3"
```

**Loading Spinner:**
```tsx
<Preloader height={45} />
```

---

## Notes

- All measurements use Tailwind CSS classes
- Colors are defined in `globals.css` and Tailwind config
- Font is Poppins, applied globally
- Modals use Framer Motion for animations
- Toasts use toastify-js library
- Forms use controlled components pattern

---

**Last Updated:** 2024
**Maintained By:** Development Team
