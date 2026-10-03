import type { OrderStatus } from "../types/order";

export const formatOrderCurrency = (value?: number): string => {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Not available";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatOrderDate = (value?: string): string => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const formatOrderStatus = (status?: OrderStatus): string => {
  if (!status) return "Unknown";
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getOrderStatusClasses = (status?: OrderStatus): string => {
  switch (status) {
    case "COMPLETED":
    case "DELIVERED":
    case "SUCCESSFUL":
    case "PAYMENT_CONFIRMED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "FAILED":
    case "CANCELED":
    case "EXPIRED":
    case "SUSPENDED":
      return "border-red-200 bg-red-50 text-red-700";
    case "PENDING":
    case "RESERVED":
    case "UNVERIFIED":
    case "ON_HOLD":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "ACTIVE":
      return "border-blue-200 bg-blue-50 text-blue-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
};

export const shortOrderId = (uuid?: string): string => {
  if (!uuid) return "Unavailable";
  return `#${uuid.slice(0, 8).toUpperCase()}`;
};
