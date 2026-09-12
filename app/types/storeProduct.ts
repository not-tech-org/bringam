export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type StoreProductAvailability = "IN_STOCK" | "OUT_OF_STOCK";

export interface VendorResp {
  uuid: string;
  businessName: string;
}

export type ReviewStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "UNVERIFIED"
  | "SUSPENDED"
  | "ON_HOLD"
  | "EXPIRED"
  | "PENDING"
  | "DELIVERED";

export interface ReviewResp {
  uuid: string;
  status: ReviewStatus;
  summary: string;
  comment: string;
  rating: number;
}

/**
 * Shape returned by vendor-service storeProduct endpoints.
 *
 * `uuid` identifies the store-product row and is the value required by cart APIs.
 * `productUuid` identifies the underlying catalog product.
 */
export interface StoreProductResp {
  uuid: string;
  productId: number;
  productUuid: string;
  productName: string;
  storeId: number;
  storeUuid: string;
  vendorUuid: string;
  vendor?: VendorResp;
  noInStock: number;
  price: number;
  availability: StoreProductAvailability;
  productCode: string;
  productImages: string[];
  reviews?: ReviewResp[];
  addedToWishlist?: boolean;
}

export interface SortObject {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

export interface PageableObject {
  offset: number;
  sort: SortObject[];
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export interface PageStoreProductResp {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: StoreProductResp[];
  number: number;
  sort: SortObject[];
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}

export type StoreProductPageResponse = ApiResponse<PageStoreProductResp>;
export type StoreProductResponse = ApiResponse<StoreProductResp>;

export interface GetStoreProductsByStoreParams {
  storeUuid: string;
  pageNo?: number;
  pageSize?: number;
}
