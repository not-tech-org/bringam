# Wishlist Add/Remove/Toggle Feature - Testing Instructions

## Overview
This document provides step-by-step testing instructions for the wishlist toggle functionality (add/remove items from wishlist).

---

## Prerequisites
1. Ensure you're logged in as a customer (not vendor view)
2. Ensure the backend API is running and accessible
3. Have browser DevTools open (F12) to monitor network requests
4. Have at least one store with products available (or use mock data)

---

## Test 1: Add Item to Wishlist from Store Page

### Steps:
1. Navigate to a store page (e.g., `/store/[store-id]`)
2. Locate a product card in the "Featured Products" section
3. Observe the heart icon (❤️) in the top-right corner of the product card
4. Click the heart icon

### Expected Results:
- ✅ Heart icon is visible on each product card (top-right corner)
- ✅ Heart icon turns gray and button is disabled during API call
- ✅ Success toast appears: "Item added to wishlist" (or similar)
- ✅ Heart icon returns to red color after operation completes
- ✅ Button becomes clickable again

### Network Check:
- Open DevTools → Network tab
- Verify API call: `PUT /customer-service/api/v1/customer-wishlist?store-product-uuid={uuid}`
- Request should include:
  - Method: `PUT`
  - Query parameter: `store-product-uuid` with the product UUID
  - Authorization header: `Bearer <token>`
- Response should be:
  ```json
  {
    "success": true,
    "message": "Request successful",
    "data": null
  }
  ```

### Visual Check:
- Heart icon is properly positioned (top-right, above product image)
- Icon has hover effect (slight scale up)
- Loading state is clear (gray color, disabled)
- No layout shifts or UI glitches

---

## Test 2: Verify Item Appears in Wishlist

### Steps:
1. After adding an item to wishlist (Test 1)
2. Navigate to `/wishlist` page (via sidebar → Personal → Wishlist)
3. Wait for wishlist to load

### Expected Results:
- ✅ Item you added appears in the wishlist
- ✅ Product image, name, price, and store name are displayed correctly
- ✅ Item count in header updates correctly
- ✅ All product information matches what was on the store page

### Data Verification:
- Product name matches
- Product image matches
- Price matches
- Store name matches (if available)
- Category matches (if available)

---

## Test 3: Remove Item from Wishlist Page

### Steps:
1. Navigate to `/wishlist` page
2. Ensure you have at least one item in your wishlist
3. Hover over a wishlist item card
4. Click the trash icon (🗑️) in the top-right corner

### Expected Results:
- ✅ Trash icon is visible on hover
- ✅ Item disappears immediately (optimistic update)
- ✅ Trash icon turns gray and button is disabled during API call
- ✅ Success toast appears: "Item removed from wishlist" (or similar)
- ✅ Item count in header updates
- ✅ If last item removed, empty state appears

### Network Check:
- Verify API call: `PUT /customer-service/api/v1/customer-wishlist?store-product-uuid={uuid}`
- Same endpoint as add (toggle behavior)
- Response should be successful

### Error Handling Test:
- If API call fails, item should reappear (rollback)
- Error toast should be displayed
- Previous state should be restored

---

## Test 4: Toggle Behavior (Add then Remove)

### Steps:
1. Navigate to a store page
2. Click heart icon on a product to add to wishlist
3. Wait for success toast
4. Navigate to wishlist page
5. Verify item is in wishlist
6. Click trash icon to remove
7. Wait for success toast
8. Navigate back to store page
9. Click heart icon again on the same product

### Expected Results:
- ✅ Item can be added multiple times (toggle works)
- ✅ Item can be removed and re-added
- ✅ No duplicate items appear in wishlist
- ✅ Each toggle operation shows appropriate toast message
- ✅ Wishlist state stays consistent

### Network Check:
- Each toggle should make a PUT request
- Same endpoint used for both add and remove
- Each request should succeed

---

## Test 5: Multiple Items - Add Several Products

### Steps:
1. Navigate to a store page
2. Add 3-5 different products to wishlist (click heart icon on each)
3. Navigate to wishlist page
4. Verify all items appear

### Expected Results:
- ✅ All added items appear in wishlist
- ✅ Item count matches number of items added
- ✅ Each item displays correctly with all information
- ✅ No duplicates
- ✅ Grid layout displays properly (responsive)

### Visual Check:
- Grid adjusts based on screen size:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
  - Large Desktop: 4 columns
- Cards are evenly spaced
- No overlapping elements

---

## Test 6: Loading States

### Steps:
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G" or "Fast 3G"
3. Navigate to store page
4. Click heart icon on a product
5. Observe loading state

### Expected Results:
- ✅ Heart icon turns gray immediately on click
- ✅ Button is disabled during API call
- ✅ Icon returns to red after operation completes
- ✅ No flickering or multiple state changes
- ✅ Toast appears after operation completes

### Test with Multiple Rapid Clicks:
1. Click heart icon rapidly 3-4 times
2. Verify only one API call is made (or proper debouncing)
3. Verify no duplicate items in wishlist

---

## Test 7: Error Handling - Network Failure

### Steps:
1. Open DevTools → Network tab
2. Navigate to store page
3. Find a product and click heart icon
4. In Network tab, block the request (right-click → Block request URL)
5. Or disconnect network
6. Click heart icon again

### Expected Results:
- ✅ Error toast appears with user-friendly message
- ✅ Button returns to normal state
- ✅ Item is NOT added to wishlist (if add failed)
- ✅ No crashes or blank screens

### Test Remove Error:
1. Navigate to wishlist page
2. Block network requests
3. Click trash icon to remove item
4. Verify:
   - Error toast appears
   - Item is restored (rollback works)
   - Previous state is maintained

---

## Test 8: Error Handling - Missing Product UUID

### Steps:
1. This test requires modifying product data temporarily (or using a product without UUID)
2. Navigate to store page
3. Find a product that might not have `storeProductUuid`
4. Click heart icon

### Expected Results:
- ✅ Error toast: "Unable to add to wishlist: missing product identifier"
- ✅ No API call is made
- ✅ Button returns to normal state
- ✅ No crashes

---

## Test 9: Concurrent Operations

### Steps:
1. Navigate to store page
2. Quickly add 3 different products to wishlist (click heart icons rapidly)
3. Navigate to wishlist page
4. Verify all items appear

### Expected Results:
- ✅ All items are added successfully
- ✅ No race conditions
- ✅ Each operation completes independently
- ✅ Wishlist shows all items correctly

---

## Test 10: Responsive Design

### Steps:
1. Test on different screen sizes:
   - Mobile (320px - 640px)
   - Tablet (641px - 1024px)
   - Desktop (1025px - 1440px)
   - Large Desktop (1441px+)

### Expected Results:
- ✅ Heart icon is visible and clickable on all sizes
- ✅ Icon size is appropriate for each screen
- ✅ Product cards display correctly
- ✅ No layout issues or overlapping elements
- ✅ Touch targets are adequate on mobile

---

## Test 11: API Request Validation

### Steps:
1. Open DevTools → Network tab
2. Navigate to store page
3. Click heart icon on a product
4. Inspect the network request

### Expected Results:
- ✅ Request Method: `PUT`
- ✅ Request URL: `/customer-service/api/v1/customer-wishlist?store-product-uuid={uuid}`
- ✅ UUID is properly URL-encoded
- ✅ Authorization header: `Bearer <token>` (if authenticated)
- ✅ Content-Type: `application/json` (if applicable)
- ✅ No CORS errors

### Verify UUID Format:
- UUID should be in format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- UUID should match the product's `storeProductUuid` field
- UUID should be properly encoded in query string

---

## Test 12: Toast Notifications

### Steps:
1. Add item to wishlist
2. Remove item from wishlist
3. Try adding item with network error

### Expected Results:
- ✅ Success toast appears on successful add: "Item added to wishlist"
- ✅ Success toast appears on successful remove: "Item removed from wishlist"
- ✅ Error toast appears on failure with clear message
- ✅ Toasts are positioned correctly (top-center based on app config)
- ✅ Toasts auto-dismiss after appropriate time
- ✅ Toast styling matches app theme

---

## Test 13: State Consistency

### Steps:
1. Add item to wishlist from store page
2. Navigate to wishlist page
3. Verify item appears
4. Remove item from wishlist
5. Navigate back to store page
6. Add same item again
7. Navigate to wishlist page
8. Verify item appears again

### Expected Results:
- ✅ State is consistent across pages
- ✅ No stale data
- ✅ Wishlist reflects current server state
- ✅ No duplicate items
- ✅ Item count is accurate

---

## Test 14: Edge Cases

### Test 14a: Empty Wishlist After Removing All Items
1. Add items to wishlist
2. Remove all items one by one
3. Verify empty state appears correctly

### Test 14b: Very Long Product Names
1. Add product with very long name
2. Verify text truncation works (`line-clamp-2`)
3. Verify layout doesn't break

### Test 14c: Missing Product Images
1. Add product with missing/invalid image URL
2. Verify placeholder image is shown
3. Verify no broken image icons

### Test 14d: Special Characters in Product Names
1. Add product with special characters (e.g., "Product & Co.™")
2. Verify display is correct
3. Verify no encoding issues

---

## Test 15: Performance

### Steps:
1. Open DevTools → Performance tab
2. Record while:
   - Adding item to wishlist
   - Removing item from wishlist
   - Navigating between pages

### Expected Results:
- ✅ Operations complete within reasonable time (< 1 second on good connection)
- ✅ No memory leaks on repeated operations
- ✅ Smooth animations (60fps)
- ✅ No jank or stuttering

---

## Test 16: Accessibility

### Steps:
1. Test with keyboard navigation (Tab key)
2. Test with screen reader (if available)

### Expected Results:
- ✅ Heart icon button is keyboard accessible
- ✅ Trash icon button is keyboard accessible
- ✅ Focus indicators are visible
- ✅ Buttons have appropriate ARIA labels
- ✅ Screen reader announces button actions

---

## Common Issues & Troubleshooting

### Issue: Heart icon doesn't appear on product cards
**Solution:**
- Verify you're on the customer-facing store page (`/store/[id]`), not vendor page
- Check browser console for errors
- Verify product data structure includes required fields

### Issue: API call fails with 401
**Solution:**
- Verify you're logged in
- Check authentication token is valid
- Verify token is being sent in Authorization header

### Issue: Item doesn't appear in wishlist after adding
**Solution:**
- Check network request was successful
- Verify API response indicates success
- Refresh wishlist page
- Check browser console for errors

### Issue: Optimistic update doesn't rollback on error
**Solution:**
- Verify error handling in `handleRemoveItem` function
- Check that `previousItems` state is being restored
- Verify error toast is displayed

### Issue: Multiple API calls for single click
**Solution:**
- Check that button is properly disabled during operation
- Verify `addingToWishlist` state is working correctly
- Check for React StrictMode causing double renders

---

## API Response Format Reference

### Success Response (Toggle):
```json
{
  "success": true,
  "message": "Request successful",
  "data": null
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message here",
  "data": null
}
```

---

## Sign-off Checklist

Before marking as complete, verify:
- [ ] Add to wishlist works from store page
- [ ] Remove from wishlist works from wishlist page
- [ ] Toggle behavior works correctly (add/remove)
- [ ] Items appear correctly in wishlist after adding
- [ ] Loading states work properly
- [ ] Error handling works for network failures
- [ ] Error handling works for missing UUIDs
- [ ] Optimistic updates work correctly
- [ ] Rollback works on error
- [ ] Toast notifications appear correctly
- [ ] API requests are properly formatted
- [ ] State consistency across pages
- [ ] Responsive design works on all screen sizes
- [ ] Performance is acceptable
- [ ] Accessibility requirements are met
- [ ] Edge cases are handled gracefully

---

## Notes for Future Implementation

1. **Wishlist Status Indicator**: Consider showing which items are already in wishlist (filled heart vs outline)
2. **Bulk Operations**: Consider adding "Add all to wishlist" or "Remove all" functionality
3. **Wishlist Count Badge**: Consider showing wishlist item count in header/navigation
4. **Sync with Cart**: When items are added to cart from wishlist, consider removing from wishlist
5. **Share Wishlist**: Consider adding ability to share wishlist with others

---

## Quick Test Script

For quick verification, run through this sequence:

1. ✅ Go to store page → Add 2 products to wishlist
2. ✅ Go to wishlist page → Verify 2 items appear
3. ✅ Remove 1 item from wishlist
4. ✅ Verify 1 item remains
5. ✅ Go back to store page → Add the removed item again
6. ✅ Go to wishlist page → Verify 2 items appear again
7. ✅ Remove both items
8. ✅ Verify empty state appears

If all steps pass, the basic functionality is working correctly!
