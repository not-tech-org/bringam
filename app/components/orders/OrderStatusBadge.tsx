import type { OrderStatus } from "@/app/types/order";
import {
  formatOrderStatus,
  getOrderStatusClasses,
} from "@/app/lib/orderUi";

interface OrderStatusBadgeProps {
  status?: OrderStatus;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getOrderStatusClasses(
        status
      )}`}
    >
      {formatOrderStatus(status)}
    </span>
  );
};

export default OrderStatusBadge;
