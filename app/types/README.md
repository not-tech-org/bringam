# Types Directory

This directory contains all TypeScript interfaces and types used across the application. This organization follows best practices for code maintainability and DRY principles.

## Structure

```
types/
├── index.ts          # Central export file for all types
├── common.ts         # Shared types used across the app
├── store.ts          # Store-related types and interfaces
├── product.ts        # Product-related types and interfaces
└── README.md         # This file
```

## Usage

Instead of declaring interfaces directly in components or pages, import them from the types directory:

```typescript
// ❌ Bad - Don't declare interfaces in components
interface ProductData {
  name: string;
  price: number;
}

// ✅ Good - Import from types directory
import { ProductFormData, ProductCategory } from "@/app/types";
```

## Files Description

### `common.ts`

Contains shared types used across the entire application:

- `ApiResponse<T>` - Standard API response wrapper
- `User` - User interface
- `VendorData` - Vendor-specific data
- `LoadingState` - Loading state management
- `ToastType` and `ToastMessage` - Toast notification types

### `store.ts`

Contains store-related types:

- `StoreFormData` - Form data for creating/editing stores
- `StoreData` - Store entity data
- `StoreAddress` - Store address structure
- `StoreMember` - Store member information
- Geographic types: `Country`, `State`, `City`

### `product.ts`

Contains product-related types:

- `ProductFormData` - Form data for creating/editing products
- `ProductCategory` - Product category structure
- `Product` - Product entity data

## Best Practices

1. **Use specific types** instead of `any` whenever possible
2. **Group related types** in the same file
3. **Export from index.ts** for clean imports
4. **Use optional properties** with `?` when appropriate
5. **Add JSDoc comments** for complex interfaces
6. **Extend interfaces** instead of duplicating properties

## Adding New Types

1. Create or update the appropriate file (`common.ts`, `store.ts`, `product.ts`, etc.)
2. Add the new interface/type
3. Export it from the specific file
4. Add the export to `index.ts` if it should be publicly available
5. Update this README if adding a new file
