import axios from "axios";
import Cookies from "js-cookie";

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
const customerApi = axios.create({
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

// Add auth interceptor to customer API instance
addAuthInterceptor(customerApi);

// Get store by ID (customer-facing)
export const getStoreById = async (storeUuid: string) => {
  const response = await customerApi.get(`/stores/${storeUuid}`);
  return response;
};

// Get product by ID (customer-facing)
export const getProductById = async (productUuid: string) => {
  const response = await customerApi.get(`/products/${productUuid}`);
  return response;
};

// Get all stores (customer-facing)
export const getAllStores = async (params?: {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  category?: string;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.pageNo !== undefined) {
    queryParams.append("page-no", params.pageNo.toString());
  }
  if (params?.pageSize !== undefined) {
    queryParams.append("page-size", params.pageSize.toString());
  }
  if (params?.sortBy) {
    queryParams.append("sort-by", params.sortBy);
  }
  if (params?.sortDir) {
    queryParams.append("sort-dir", params.sortDir);
  }
  if (params?.category) {
    queryParams.append("category", params.category);
  }

  const queryString = queryParams.toString();
  const url = `/stores${queryString ? `?${queryString}` : ""}`;
  const response = await customerApi.get(url);
  return response;
};
