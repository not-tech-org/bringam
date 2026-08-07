# BringAm

BringAm is a multi-vendor marketplace frontend for customers and vendors. Customers can discover stores and products, manage a cart and wishlist, provide delivery details, place an order, and pay through Paga. Vendors can manage their stores, products, and offers.

## What the app includes

- Customer sign-up, sign-in, password recovery, and account screens
- Store discovery, product browsing, search, reviews, and wishlists
- Cart management and selected-item checkout
- Delivery-address collection and Paga payment handoff
- Customer orders, notifications, and support screens
- Vendor onboarding, store management, product management, and offers

## Tech stack

- Next.js 14 (App Router)
- React 18 and TypeScript
- Tailwind CSS
- Axios for API requests
- Redux Toolkit for shared application state

## Getting started

### Prerequisites

- Node.js 18 or later
- npm
- Access to the BringAm backend services

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://your-api-host
NEXT_PUBLIC_PAYMENT_PUBLIC_KEY=your-paga-public-key
```

`NEXT_PUBLIC_DISABLE_BOOTSTRAP_CART_FETCH=true` can be used for local cart-only debugging. Do not use it when testing the signed-in cart and checkout flow.

## Project structure

```text
app/
  auth/                 Customer authentication pages
  cart/                 Cart page and item selection
  checkout/             Address, checkout, order, and payment handoff
  contexts/             Shared client state, including CartContext
  services/             API clients and request helpers
  product/ and store/   Customer product and store views
  vendor*/              Vendor onboarding and catalog management
  wishlist/             Customer wishlist
```

## Customer checkout flow

For an authenticated customer, the intended API sequence is:

1. Read the active server cart with `GET /api/v1/carts/get-user-cart`.
2. Add a product with `PUT /api/v1/carts/add-item-to-cart/{cartUuid}` using the vendor store-product UUID and quantity.
3. Re-read the cart and use `cartItems[].uuid` as the checkout item IDs.
4. Create a checkout session with `POST /api/v1/checkout`.
5. Create or select a delivery address, then attach it with `POST /api/v1/checkout/{sessionUuid}/address`.
6. Place the order with `POST /api/v1/place-order` and use the returned payment reference and amount for the Paga handoff.
7. Let the backend verify payment through its Paga webhook; the client should display the resulting order state.

Important: `storeProductUuid` and `cartItems[].uuid` are different values. Checkout must use the cart-item UUIDs returned by the server, never a product UUID.

## Current integration note

The frontend correctly requires cart items to appear in `GET /carts/get-user-cart` before checkout. If the add-to-cart endpoint reports success but the next cart read remains empty, the issue is in backend cart persistence or the active-cart/customer association. Checkout cannot safely continue until the server returns persisted cart items.

## Quality checks

```bash
npm run lint
npm run build
```

Before merging cart or checkout changes, manually verify this path with a fresh signed-in account:

```text
add product -> refresh cart -> select item -> add address
-> create checkout session -> attach address -> place order -> Paga handoff
```

## Contributing

- Keep API request logic in `app/services`.
- Keep cart state changes in `CartContext` and treat the server cart as authoritative for signed-in users.
- Do not commit secrets or `.env.local` files.
- Keep checkout changes small and test the full customer flow before merging.
