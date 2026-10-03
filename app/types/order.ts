export type OrderStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "UNVERIFIED"
  | "SUSPENDED"
  | "ON_HOLD"
  | "EXPIRED"
  | "PENDING"
  | "DELIVERED"
  | "FAILED"
  | "SUCCESSFUL"
  | "RESERVED"
  | "PAYMENT_CONFIRMED"
  | "CANCELED"
  | "COMPLETED";

export interface CustomerOrderSummary {
  uuid?: string;
  checkoutSessionUuid?: string;
  paymentReferenceUuid?: string;
  amount?: number;
  noOfItems?: number;
  status?: OrderStatus;
  orderDate?: string;
}

export interface CustomerOrderItem {
  uuid?: string;
  orderUuid?: string;
  storeUuid?: string;
  storeProductUuid?: string;
  productName?: string;
  productImages?: string[];
  quantity?: number;
  unitPrice?: number;
  total?: number;
  status?: OrderStatus;
}

export interface OrderDeliveryAddress {
  uuid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  landmark?: string;
  lga?: string;
  street?: string;
}

export interface CustomerOrderDetails {
  uuid?: string;
  status?: OrderStatus;
  subtotal?: number;
  deliveryCost?: number;
  vat?: number;
  serviceCharge?: number;
  amount?: number;
  paymentReferenceUuid?: string;
  deliveryAddress?: OrderDeliveryAddress;
  orderDate?: string;
  expiresAt?: string;
  noOfItems?: number;
  items?: CustomerOrderItem[];
}

export interface OrderPage<T> {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface OrderApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface GetCustomerOrdersParams {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
