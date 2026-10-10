import type { OrderStatus } from "./order";

export interface VendorDashboardOrder {
  uuid?: string;
  id?: number;
  createdAt?: string;
  amount?: number;
  noOfItems?: number;
  status?: OrderStatus;
}

export interface BestPerformingProduct {
  productName?: string;
  price?: number;
  unitsSold?: number;
}

export interface VendorDashboardData {
  name?: string;
  averageRevenue?: number;
  storeVisits?: number;
  orders?: number;
  productViews?: number;
  activeCustomers?: number;
  customers?: number;
  bestPerformingProducts?: BestPerformingProduct[];
  recentOrders?: VendorDashboardOrder[];
}
