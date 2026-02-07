# Product Reviews Feature - Testing Instructions

## Overview
This document provides step-by-step testing instructions for the product reviews feature, including fetching reviews, displaying them, and handling various states.

---

## Prerequisites
1. Ensure you're logged in as a customer (not vendor view)
2. Ensure the backend API is running and accessible
3. Have browser DevTools open (F12) to monitor network requests
4. Have at least one product available (or use mock data)

---

## Test 1: Navigation to Product Detail Page

### Steps:
1. Navigate to a store page (e.g., `/store/[store-id]`)
2. Locate a product card in the "Featured Products" section
3. Click on the product card (on the image or product name area)

### Expected Results:
- ✅ Clicking product card navigates to `/product/[product-id]`
- ✅ Product detail page loads
- ✅ Product information is displayed (image, name, price, description)
- ✅ URL in browser address bar shows `/product/[product-id]`
- ✅ Back button is visible and functional

### Visual Check:
- Product image displays correctly
- Product name, price, and description are visible
- Add to Cart and Wishlist buttons are present
- Page layout is clean and organized

---

## Test 2: Loading State - Product and Reviews

### Steps:
1. Navigate to a product detail page
2. Observe the page during initial load (you may need to throttle network in DevTools)

### Expected Results:
- ✅ Preloader/spinner is displayed while fetching product data
- ✅ Preloader is displayed while fetching reviews
- ✅ No content flickering or layout shifts
- ✅ Loading states appear immediately on page load

### How to Test:
- Open DevTools → Network tab
- Set throttling to "Slow 3G" or "Fast 3G"
- Navigate to product detail page
- Observe loading spinners

---

## Test 3: Empty Reviews State

### Prerequisites:
- Ensure the product has no reviews (or test with a product that has no reviews)

### Steps:
1. Navigate to a product detail page
2. Scroll down to the "Customer Reviews" section
3. Wait for reviews to load

### Expected Results:
- ✅ Empty state is displayed with:
  - Star icon in gray circle
  - Heading: "No reviews yet"
  - Description: "Be the first to review this product!"
- ✅ No error messages displayed
- ✅ Section is visually centered and styled appropriately

### Network Check:
- Open DevTools → Network tab
- Verify API call: `GET /customer-service/api/v1/reviews/{productUuid}?page-no=0&page-size=20&sort-by=id&sort-dir=desc&start-date=1980-01-01T00:00:00&end-date=3000-01-01T00:00:00&statuses=ACTIVE,INACTIVE`
- Response should have `data.content` as empty array `[]`
- Response should have `data.empty: true`

---

## Test 4: Success State - Displaying Reviews

### Prerequisites:
- Ensure the product has at least one review (add via backend API if needed)

### Steps:
1. Navigate to a product detail page with reviews
2. Scroll down to the "Customer Reviews" section
3. Wait for reviews to load

### Expected Results:
- ✅ Section header shows:
  - "Customer Reviews" heading
  - Review count (e.g., "12 reviews")
- ✅ Reviews are displayed in a list format
- ✅ Each review card shows:
  - Customer name (or "Anonymous" if not available)
  - Star rating (visual stars)
  - Review date (formatted)
  - Review comment/text
  - Status badge (ACTIVE/INACTIVE) if available
- ✅ Reviews are sorted by most recent first (descending)
- ✅ Smooth animations when reviews appear

### Network Check:
- Verify API call includes correct query parameters
- Response should have `data.content` as array of review items
- Response should have `data.empty: false`

### Visual Check:
- Star ratings display correctly (filled stars for rating)
- Text is readable and properly formatted
- Review cards are evenly spaced
- Layout is responsive on different screen sizes

---

## Test 5: Error Handling

### Steps:
1. Open DevTools → Network tab
2. Navigate to a product detail page
3. In Network tab, find the reviews API request
4. Right-click → Block request URL (or use Network throttling to simulate failure)
5. Refresh the page

### Alternative Method (Simulate 401/500):
1. Temporarily modify `ReviewService.ts` to use wrong endpoint
2. Navigate to product detail page

### Expected Results:
- ✅ Error state is displayed in reviews section with:
  - Error message from API (or generic fallback)
  - "Try Again" button
- ✅ Error toast notification appears (if using toast)
- ✅ Product information still displays (error only affects reviews)
- ✅ No blank page or crash

### Network Check:
- Verify error response status code (401, 500, etc.)
- Error message should be user-friendly

---

## Test 6: Query Parameters Validation

### Steps:
1. Open DevTools → Network tab
2. Navigate to a product detail page
3. Check the reviews API request in Network tab

### Expected Results:
- ✅ Query parameters are correctly formatted:
  - `page-no=0`
  - `page-size=20`
  - `sort-by=id`
  - `sort-dir=desc`
  - `start-date=1980-01-01T00:00:00`
  - `end-date=3000-01-01T00:00:00`
  - `statuses=ACTIVE,INACTIVE`
- ✅ All parameters are URL-encoded properly
- ✅ Request includes `Authorization: Bearer <token>` header
- ✅ Product UUID is correctly encoded in URL path

### Manual Parameter Test:
1. Open browser console
2. Test with different parameters:
   ```javascript
   // You can test by modifying the service call temporarily
   getProductReviewsApi(productUuid, {
     pageNo: 1,
     pageSize: 5,
     sortBy: "createdAt",
     sortDir: "asc",
     statuses: "ACTIVE"
   })
   ```

---

## Test 7: Star Rating Display

### Steps:
1. Navigate to a product detail page with reviews
2. Check reviews that have ratings

### Expected Results:
- ✅ Star ratings display correctly:
  - Full stars (filled) for integer ratings
  - Empty stars for remaining slots
  - Rating number displayed next to stars
- ✅ Stars are properly colored (yellow for filled, gray for empty)
- ✅ Rating matches the review's rating value

### Test Cases:
- 5-star rating: 5 filled stars
- 4-star rating: 4 filled stars, 1 empty
- 3.5-star rating: 3 filled stars, 1 half-filled, 1 empty
- No rating: No stars displayed (or handled gracefully)

---

## Test 8: Review Content Display

### Steps:
1. Navigate to a product detail page with reviews
2. Examine individual review cards

### Expected Results:
- ✅ Customer name displays (or "Anonymous" if missing)
- ✅ Review comment/text displays correctly
- ✅ Long comments are properly wrapped (no overflow)
- ✅ Review date is formatted correctly (e.g., "Jan 15, 2024")
- ✅ Status badge displays if status is available
- ✅ Status badge color matches status (green for ACTIVE, gray for INACTIVE)

### Edge Cases:
- Very long review comments should wrap properly
- Missing fields should be handled gracefully
- Special characters in names/comments should display correctly

---

## Test 9: Product Information Display

### Steps:
1. Navigate to a product detail page
2. Verify all product information displays

### Expected Results:
- ✅ Product image displays correctly (or placeholder if missing)
- ✅ Product name is visible and readable
- ✅ Product price is formatted correctly (₦X,XXX)
- ✅ Product description displays
- ✅ Product category displays
- ✅ Star rating displays if available (for product overall rating)

### Visual Check:
- Layout is clean and organized
- Information is easy to read
- Images load correctly
- No layout shifts

---

## Test 10: Add to Cart from Product Detail Page

### Steps:
1. Navigate to a product detail page
2. Click "Add to Cart" button

### Expected Results:
- ✅ Success toast appears: "Item added to cart"
- ✅ Item is added to cart
- ✅ Cart count updates (if visible in header)
- ✅ Button remains functional for multiple clicks

### Network Check:
- Verify cart API call is made
- Request includes correct product information

---

## Test 11: Add to Wishlist from Product Detail Page

### Steps:
1. Navigate to a product detail page
2. Click the heart icon (wishlist button)

### Expected Results:
- ✅ Heart icon turns gray and button is disabled during API call
- ✅ Success toast appears: "Item added to wishlist"
- ✅ Heart icon returns to red color after operation completes
- ✅ Button becomes clickable again

### Network Check:
- Verify wishlist API call: `PUT /customer-wishlist?store-product-uuid={uuid}`
- Request should succeed

---

## Test 12: Back Navigation

### Steps:
1. Navigate to a store page
2. Click on a product card to go to product detail page
3. Click "Back" button

### Expected Results:
- ✅ "Back" button navigates to previous page (store page)
- ✅ Browser back button also works
- ✅ No data loss or state issues

---

## Test 13: Responsive Design

### Steps:
1. Navigate to a product detail page
2. Test on different screen sizes:
   - Mobile (320px - 640px)
   - Tablet (641px - 1024px)
   - Desktop (1025px - 1440px)
   - Large Desktop (1441px+)

### Expected Results:
- ✅ Layout adjusts appropriately:
  - Mobile: Single column layout
  - Tablet/Desktop: Two-column layout (image left, info right)
- ✅ Text is readable at all sizes
- ✅ Images scale appropriately
- ✅ Buttons are easily clickable on mobile
- ✅ Reviews section displays correctly on all sizes
- ✅ No horizontal scrolling
- ✅ Cards maintain proper spacing

---

## Test 14: Multiple Reviews - Pagination

### Steps:
1. Navigate to a product detail page with many reviews (>20)
2. Verify reviews display

### Expected Results:
- ✅ First 20 reviews are displayed (based on page-size)
- ✅ Reviews are sorted correctly (most recent first)
- ✅ All reviews display properly
- ✅ No performance issues with many reviews

### Note:
- Currently, pagination UI is not implemented
- All reviews on first page are displayed
- Future: Consider adding pagination controls

---

## Test 15: Concurrent Operations

### Steps:
1. Navigate to a product detail page
2. Quickly click "Add to Cart" and "Add to Wishlist" buttons
3. Verify both operations complete

### Expected Results:
- ✅ Both operations complete successfully
- ✅ No race conditions
- ✅ Each operation shows appropriate toast
- ✅ No UI glitches or state conflicts

---

## Test 16: Product UUID Resolution

### Steps:
1. Navigate to a product detail page
2. Check browser console for any errors
3. Verify reviews API is called with correct UUID

### Expected Results:
- ✅ Product UUID is correctly resolved from product data
- ✅ UUID is properly encoded in API URL
- ✅ No errors in console about missing UUID
- ✅ API call succeeds

### Test with Different UUID Formats:
- Product with `uuid` field
- Product with `productUuid` field
- Product with only `id` field (fallback)

---

## Test 17: Edge Cases

### Test 17a: Missing Product Data
1. Test with product that has missing fields (name, image, price)
2. Verify graceful fallbacks:
   - Missing image → placeholder image
   - Missing name → "Unnamed Product" or similar
   - Missing price → "Price not available"

### Test 17b: Missing Review Data
1. Test with reviews that have missing fields
2. Verify:
   - Missing customer name → "Anonymous"
   - Missing comment → No comment displayed (or placeholder)
   - Missing rating → No stars displayed
   - Missing date → No date displayed

### Test 17c: Very Long Review Comments
1. Test with reviews that have very long comments
2. Verify text wrapping and layout don't break

### Test 17d: Special Characters
1. Test with reviews containing special characters
2. Verify proper encoding and display

---

## Test 18: Performance

### Steps:
1. Open DevTools → Performance tab
2. Record while:
   - Navigating to product detail page
   - Loading reviews
   - Interacting with buttons

### Expected Results:
- ✅ Page loads within reasonable time (< 2 seconds on good connection)
- ✅ Reviews load smoothly
- ✅ Animations are smooth (60fps)
- ✅ No memory leaks on repeated navigation
- ✅ No jank or stuttering

---

## Test 19: Accessibility

### Steps:
1. Test with keyboard navigation (Tab key)
2. Test with screen reader (if available)

### Expected Results:
- ✅ All interactive elements are keyboard accessible
- ✅ Focus indicators are visible
- ✅ Images have alt text
- ✅ Buttons have descriptive labels
- ✅ Semantic HTML structure
- ✅ Star ratings are accessible

---

## Common Issues & Troubleshooting

### Issue: Product detail page shows blank screen
**Solution:**
- Check browser console for errors
- Verify product ID/UUID is valid
- Check API endpoint is accessible
- Verify authentication token is valid

### Issue: Reviews not displaying
**Solution:**
- Verify API response structure matches expected format
- Check Network tab for API response
- Verify `data.content` is an array
- Check product UUID is correct

### Issue: Star ratings not displaying
**Solution:**
- Verify rating value is a number
- Check rating is between 0-5
- Verify star rendering logic

### Issue: Navigation from store page doesn't work
**Solution:**
- Verify product card is clickable
- Check Link component is properly implemented
- Verify product ID/UUID is passed correctly

### Issue: API call fails with 401
**Solution:**
- Verify you're logged in
- Check authentication token is valid
- Verify token is being sent in Authorization header

---

## API Response Format Reference

### Success Response:
```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "content": [
      {
        "uuid": "review-uuid",
        "productUuid": "product-uuid",
        "customerName": "John Doe",
        "rating": 5,
        "comment": "Great product!",
        "status": "ACTIVE",
        "createdAt": "2024-01-15T10:30:00"
      }
    ],
    "pageable": { ... },
    "totalElements": 1,
    "empty": false
  }
}
```

### Empty Response:
```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "content": [],
    "empty": true,
    "totalElements": 0
  }
}
```

---

## Sign-off Checklist

Before marking as complete, verify:
- [ ] Navigation to product detail page works from store page
- [ ] Product information displays correctly
- [ ] Loading state works for both product and reviews
- [ ] Empty reviews state displays properly
- [ ] Reviews display correctly with all data
- [ ] Star ratings display correctly
- [ ] Error handling works for various error types
- [ ] Query parameters are correct
- [ ] Add to Cart works from product detail page
- [ ] Add to Wishlist works from product detail page
- [ ] Back navigation works correctly
- [ ] Responsive design works on all screen sizes
- [ ] Edge cases are handled gracefully
- [ ] Performance is acceptable
- [ ] Accessibility requirements are met

---

## Notes for Future Implementation

1. **Pagination UI**: Consider adding pagination controls for reviews when there are many
2. **Write Review**: Consider adding ability for customers to write reviews
3. **Review Filtering**: Consider adding filters (by rating, date, etc.)
4. **Review Sorting**: Consider adding sort options (newest, oldest, highest rating, etc.)
5. **Review Helpfulness**: Consider adding "Helpful" voting for reviews
6. **Review Images**: Consider displaying review images if API provides them

---

## Quick Test Script

For quick verification, run through this sequence:

1. ✅ Go to store page → Click on a product card
2. ✅ Verify product detail page loads
3. ✅ Verify product information displays
4. ✅ Scroll to reviews section
5. ✅ Verify reviews load (or empty state if no reviews)
6. ✅ Click "Add to Cart" → Verify success
7. ✅ Click "Add to Wishlist" → Verify success
8. ✅ Click "Back" → Verify navigation works

If all steps pass, the basic functionality is working correctly!
