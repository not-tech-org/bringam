import axios from "axios";
import Cookies from "js-cookie";
import { ReviewApiResponse, GetReviewsParams } from "../types/review";

const baseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL;
};

const secoundaryUrl = () => {
  return {
    auth: "auth-service",
    vendor: "vendor-service",
    customer: "customer-service",
  };
};

// Create axios instance for customer service
const reviewApi = axios.create({
  baseURL: `${baseUrl()}/${secoundaryUrl().customer}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to automatically include auth token
const addAuthInterceptor = (apiInstance: any) => {
  apiInstance.interceptors.request.use(
    (config: any) => {
      const token = Cookies.get("bringAmToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

// Add auth interceptor to review API instance
addAuthInterceptor(reviewApi);

// Get product reviews from API
export const getProductReviewsApi = async (
  productUuid: string,
  params?: GetReviewsParams
): Promise<ReviewApiResponse> => {
  // Build query string with default values
  const queryParams = new URLSearchParams();
  
  queryParams.append("page-no", (params?.pageNo ?? 0).toString());
  queryParams.append("page-size", (params?.pageSize ?? 10).toString());
  queryParams.append("sort-by", params?.sortBy ?? "id");
  queryParams.append("sort-dir", params?.sortDir ?? "desc");
  queryParams.append(
    "start-date",
    params?.startDate ?? "1980-01-01T00:00:00"
  );
  queryParams.append(
    "end-date",
    params?.endDate ?? "3000-01-01T00:00:00"
  );
  
  // Add statuses parameter (comma-separated)
  if (params?.statuses) {
    queryParams.append("statuses", params.statuses);
  } else {
    queryParams.append("statuses", "ACTIVE,INACTIVE");
  }

  const response = await reviewApi.get(
    `/reviews/${encodeURIComponent(productUuid)}?${queryParams.toString()}`
  );
  return response.data;
};
