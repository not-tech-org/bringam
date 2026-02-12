// Review-related types and interfaces

// ===== API REVIEW TYPES (Server Structure) =====
export interface ReviewItem {
  id?: string;
  uuid?: string;
  productUuid?: string;
  customerUuid?: string;
  customerName?: string;
  rating?: number;
  comment?: string;
  status?: string; // ACTIVE, INACTIVE
  createdAt?: string;
  updatedAt?: string;
  // Add other fields as needed based on actual API response
  [key: string]: any; // Allow for additional fields from API
}

export interface ReviewPageable {
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

export interface ReviewSort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface ReviewPageData {
  content: ReviewItem[];
  pageable: ReviewPageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: ReviewSort;
  numberOfElements: number;
  empty: boolean;
}

export interface ReviewApiResponse {
  success: boolean;
  message: string;
  data: ReviewPageData | null;
}

// ===== REQUEST PARAMETERS =====
export interface GetReviewsParams {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  startDate?: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
  statuses?: string; // Comma-separated: "ACTIVE,INACTIVE"
}

// ===== POST REVIEW REQUEST =====
export interface AddReviewRequest {
  storeProductId: string; // UUID of the store product
  summary: string;
  comment: string;
  rating: number; // 1-5
}

// ===== POST REVIEW RESPONSE =====
export interface AddReviewResponse {
  success: boolean;
  message: string;
  data: null;
}
