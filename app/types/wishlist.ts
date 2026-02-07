// Wishlist-related types and interfaces

// ===== API WISHLIST TYPES (Server Structure) =====
export interface WishlistItem {
  id?: string;
  uuid?: string;
  productId?: string;
  productUuid?: string;
  storeId?: string;
  storeUuid?: string;
  storeName?: string;
  productName?: string;
  name?: string;
  price?: number;
  image?: string;
  category?: string;
  addedAt?: string;
  createdAt?: string;
  // Add other fields as needed based on actual API response
  [key: string]: any; // Allow for additional fields from API
}

export interface WishlistPageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface WishlistSort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface WishlistPageData {
  content: WishlistItem[];
  pageable: WishlistPageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: WishlistSort;
  numberOfElements: number;
  empty: boolean;
}

export interface WishlistApiResponse {
  success: boolean;
  message: string;
  data: WishlistPageData | null;
}

// ===== REQUEST PARAMETERS =====
export interface GetWishlistParams {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  startDate?: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
}
