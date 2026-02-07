# Wishlist Feature - Testing Instructions

## Overview
This document provides step-by-step testing instructions for the customer wishlist feature.

---

## Prerequisites
1. Ensure you're logged in as a customer (not vendor view)
2. Ensure the backend API is running and accessible
3. Have browser DevTools open (F12) to monitor network requests

---

## Test 1: Navigation to Wishlist Page

### Steps:
1. Log in to the application as a customer
2. Look at the left sidebar under the "Personal" section
3. Click on "Wishlist" (should appear after "My Orders")

### Expected Results:
- ✅ Wishlist link is visible in the sidebar under "Personal" section
- ✅ Clicking "Wishlist" navigates to `/wishlist` route
- ✅ Page title shows "My Wishlist"
- ✅ URL in browser address bar shows `/wishlist`

---

## Test 2: Loading State

### Steps:
1. Navigate to `/wishlist` page
2. Observe the page during initial load (you may need to throttle network in DevTools)

### Expected Results:
- ✅ Preloader/spinner is displayed while fetching data
- ✅ No content flickering or layout shifts
- ✅ Loading state appears immediately on page load

### How to Test:
- Open DevTools → Network tab
- Set throttling to "Slow 3G" or "Fast 3G"
- Navigate to wishlist page
- Observe loading spinner

---

## Test 3: Empty State

### Prerequisites:
- Ensure your account has no wishlist items (or test with a new account)

### Steps:
1. Navigate to `/wishlist` page
2. Wait for the page to load

### Expected Results:
- ✅ Empty state is displayed with:
  - Heart icon in a gray circle
  - Heading: "Your wishlist is empty"
  - Description: "Start adding items you love to your wishlist for easy access later."
  - "Start Shopping" button that links to `/all`
- ✅ "Back to Stores" button is visible at the top
- ✅ No error messages displayed

### Network Check:
- Open DevTools → Network tab
- Verify API call: `GET /customer-service/api/v1/customer-wishlist?page-no=0&page-size=50&sort-by=id&sort-dir=desc&start-date=1980-01-01T00:00:00&end-date=3000-01-01T00:00:00`
- Response should have `data.content` as empty array `[]`
- Response should have `data.empty: true`

---

## Test 4: Success State - Displaying Wishlist Items

### Prerequisites:
- Ensure your account has at least one item in the wishlist (add via backend API if needed)

### Steps:
1. Navigate to `/wishlist` page
2. Wait for items to load

### Expected Results:
- ✅ Page header shows:
  - "My Wishlist" heading
  - Item count (e.g., "3 items saved")
  - "Continue Shopping" button
- ✅ Items displayed in a responsive grid:
  - 1 column on mobile
  - 2 columns on tablet
  - 3 columns on desktop
  - 4 columns on large screens
- ✅ Each item card shows:
  - Product image (or placeholder if missing)
  - Product name
  - Store name (if available)
  - Category (if available)
  - Price formatted as "₦X,XXX"
  - "Add to Cart" button
  - Remove (trash) icon button in top-right corner
- ✅ Cards have hover animations (slight lift and scale)
- ✅ Smooth animations when items appear

### Network Check:
- Verify API call includes correct query parameters
- Response should have `data.content` as array of wishlist items
- Response should have `data.empty: false`

### Visual Check:
- Images load correctly (or show placeholder)
- Text is readable and properly truncated if too long
- Cards are evenly spaced
- Layout is responsive on different screen sizes

---

## Test 5: Error Handling

### Steps:
1. Open DevTools → Network tab
2. Navigate to `/wishlist` page
3. In Network tab, find the wishlist API request
4. Right-click → Block request URL (or use Network throttling to simulate failure)
5. Refresh the page

### Alternative Method (Simulate 401/500):
1. Temporarily modify `WishlistService.ts` to use wrong endpoint
2. Navigate to wishlist page

### Expected Results:
- ✅ Error state is displayed with:
  - Heart icon in a red circle
  - Heading: "Unable to load wishlist"
  - Error message from API (or generic fallback)
  - "Try Again" button
  - "Go Back" button
- ✅ Error toast notification appears (if using toast)
- ✅ No blank page or crash

### Network Check:
- Verify error response status code (401, 500, etc.)
- Error message should be user-friendly

---

## Test 6: Pagination Parameters

### Steps:
1. Open DevTools → Network tab
2. Navigate to `/wishlist` page
3. Check the API request in Network tab

### Expected Results:
- ✅ Query parameters are correctly formatted:
  - `page-no=0`
  - `page-size=50`
  - `sort-by=id`
  - `sort-dir=desc`
  - `start-date=1980-01-01T00:00:00`
  - `end-date=3000-01-01T00:00:00`
- ✅ All parameters are URL-encoded properly
- ✅ Request includes `Authorization: Bearer <token>` header

### Manual Parameter Test:
1. Open browser console
2. Test with different parameters:
   ```javascript
   // You can test by modifying the service call temporarily
   getCustomerWishlistApi({
     pageNo: 1,
     pageSize: 10,
     sortBy: "createdAt",
     sortDir: "asc"
   })
   ```

---

## Test 7: Remove Item from Wishlist

### Prerequisites:
- Have at least one item in your wishlist

### Steps:
1. Navigate to `/wishlist` page
2. Hover over a wishlist item card
3. Click the trash icon (🗑️) in the top-right corner of a card

### Expected Results:
- ✅ Trash icon is visible on hover
- ✅ Clicking trash icon removes item from display immediately
- ✅ Success toast appears: "Item removed from wishlist"
- ✅ Item count in header updates
- ✅ If last item removed, empty state appears
- ✅ Smooth animation when item is removed

### Note:
- Currently, this is a placeholder implementation (removes from UI only)
- Backend API endpoint for removal will be implemented later

---

## Test 8: Add to Cart (Placeholder)

### Steps:
1. Navigate to `/wishlist` page
2. Click "Add to Cart" button on any wishlist item

### Expected Results:
- ✅ Info toast appears: "Add to cart functionality coming soon"
- ✅ No errors or crashes
- ✅ Button remains clickable

### Note:
- This is a placeholder for future cart integration
- Will be connected to CartContext when implemented

---

## Test 9: Responsive Design

### Steps:
1. Navigate to `/wishlist` page with items
2. Test on different screen sizes:
   - Mobile (320px - 640px)
   - Tablet (641px - 1024px)
   - Desktop (1025px - 1440px)
   - Large Desktop (1441px+)

### Expected Results:
- ✅ Grid adjusts columns based on screen size:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
  - Large Desktop: 4 columns
- ✅ Text is readable at all sizes
- ✅ Images scale appropriately
- ✅ Buttons are easily clickable on mobile
- ✅ No horizontal scrolling
- ✅ Cards maintain proper spacing

---

## Test 10: Edge Cases

### Test 10a: Missing Product Data
1. Test with wishlist items that have missing fields (name, image, price)
2. Verify graceful fallbacks:
   - Missing image → placeholder image
   - Missing name → "Unnamed Product"
   - Missing price → "Price not available"

### Test 10b: Very Long Product Names
1. Test with products that have very long names
2. Verify text truncation with `line-clamp-2`

### Test 10c: Network Interruption
1. Start loading wishlist page
2. Disconnect network mid-load
3. Verify error handling and retry functionality

---

## Test 11: Performance

### Steps:
1. Open DevTools → Performance tab
2. Record while navigating to wishlist page
3. Check for:
   - Initial load time
   - Time to interactive
   - Animation performance

### Expected Results:
- ✅ Page loads within reasonable time (< 2 seconds on good connection)
- ✅ Animations are smooth (60fps)
- ✅ No layout shifts (CLS score)
- ✅ No memory leaks on repeated navigation

---

## Test 12: Accessibility

### Steps:
1. Navigate to wishlist page
2. Test with keyboard navigation (Tab key)
3. Test with screen reader (if available)

### Expected Results:
- ✅ All interactive elements are keyboard accessible
- ✅ Focus indicators are visible
- ✅ Images have alt text
- ✅ Buttons have descriptive labels
- ✅ Semantic HTML structure

---

## Common Issues & Troubleshooting

### Issue: Wishlist page shows blank screen
**Solution:**
- Check browser console for errors
- Verify API endpoint is accessible
- Check authentication token is valid

### Issue: Items not displaying
**Solution:**
- Verify API response structure matches expected format
- Check Network tab for API response
- Verify `data.content` is an array

### Issue: Images not loading
**Solution:**
- Check image URLs in API response
- Verify placeholder image exists at `/images/placeholder.png`
- Check browser console for 404 errors

### Issue: Styling looks broken
**Solution:**
- Clear browser cache
- Verify Tailwind CSS is compiling correctly
- Check for CSS conflicts

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
        "uuid": "item-uuid",
        "productName": "Product Name",
        "storeName": "Store Name",
        "price": 5000,
        "image": "https://...",
        "category": "Electronics"
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
- [ ] All navigation tests pass
- [ ] Loading state works correctly
- [ ] Empty state displays properly
- [ ] Items display correctly with all data
- [ ] Error handling works for various error types
- [ ] Pagination parameters are correct
- [ ] Remove item works (UI only for now)
- [ ] Responsive design works on all screen sizes
- [ ] Edge cases are handled gracefully
- [ ] Performance is acceptable
- [ ] Accessibility requirements are met

---

## Notes for Future Implementation

1. **Remove from Wishlist API**: Currently removes from UI only. Backend endpoint needed.
2. **Add to Cart Integration**: Connect to CartContext when ready.
3. **Pagination UI**: Consider adding pagination controls if wishlist grows large.
4. **Search/Filter**: Consider adding search or filter functionality for large wishlists.
