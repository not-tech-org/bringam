"use client";

import React, { useEffect, useState } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Button from "../components/common/Button";
import { FaArrowLeft, FaBox, FaReceipt, FaCopy, FaChevronDown, FaChevronUp, FaSearch, FaTimes, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  storeName: string;
}

interface SavedOrder {
  orderUuid?: string;
  paymentReference?: string;
  amount?: number;
  message?: string;
  placedAt: string;
  items: OrderItem[];
  customerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
};

const MyOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bringam_orders");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const formatPrice = (price: number) => `N${price.toLocaleString()}`;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const filteredOrders = searchTerm.trim()
    ? orders.filter(
        (o) =>
          o.orderUuid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.paymentReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.items?.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : orders;

  const totalSpent = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <Wrapper>
      <motion.div
        className="bg-white min-h-screen"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="px-4">
          <motion.div variants={itemVariants}>
            <Button
              type="button"
              style="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
              onClick={() => router.push("/all")}
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Stores
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Orders</h1>
            <p className="text-gray-600 text-sm">
              Track and manage all your orders in one place.
            </p>
          </motion.div>

          {/* Stats cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-[#f8fbfa] border border-[#3c4948]/20 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-[#3c4948]">{orders.length}</p>
            </div>
            <div className="bg-[#f8fbfa] border border-[#3c4948]/20 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-[#3c4948]">
                {formatPrice(totalSpent)}
              </p>
            </div>
            <div className="bg-[#f8fbfa] border border-[#3c4948]/20 rounded-xl p-4 col-span-2">
              <p className="text-sm text-gray-600 mb-1">Items Ordered</p>
              <p className="text-2xl font-bold text-[#3c4948]">
                {orders.reduce((sum, o) => sum + (o.items?.length || 0), 0)}
              </p>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div variants={itemVariants} className="relative mb-6">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search orders by ID, reference, or item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3c4948]/20 focus:border-[#3c4948] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            )}
          </motion.div>

          {/* Orders list */}
          {filteredOrders.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaBox className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "No orders match your search" : "No orders yet"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                {searchTerm
                  ? "Try a different search term."
                  : "When you place an order, it will appear here for easy tracking."}
              </p>
              {!searchTerm && (
                <Link href="/all">
                  <Button type="button" style="flex items-center gap-2" primary>
                    Start Shopping
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const orderKey = order.orderUuid || `order-${index}`;
                const isExpanded = expandedOrder === orderKey;
                const status = order.orderUuid ? "completed" : "pending";

                return (
                  <motion.div
                    key={orderKey}
                    variants={itemVariants}
                    layout
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Order header */}
                    <button
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : orderKey)
                      }
                      className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            status === "completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {status === "completed" ? (
                            <FaCheckCircle className="text-lg" />
                          ) : (
                            <FaSpinner className="text-lg" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.orderUuid
                              ? `#${order.orderUuid.slice(0, 8).toUpperCase()}`
                              : `Order ${index + 1}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.placedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {order.amount !== undefined && (
                          <span className="font-semibold text-gray-900">
                            {formatPrice(order.amount)}
                          </span>
                        )}
                        {isExpanded ? (
                          <FaChevronUp className="text-gray-400" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
                            {/* Order IDs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {order.orderUuid && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Order ID
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm font-mono text-gray-900 truncate">
                                      {order.orderUuid}
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(order.orderUuid!)
                                      }
                                      className="text-gray-400 hover:text-[#3c4948] flex-shrink-0"
                                      title="Copy"
                                    >
                                      <FaCopy className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              )}
                              {order.paymentReference && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Payment Reference
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm font-mono text-gray-900 truncate">
                                      {order.paymentReference}
                                    </code>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          order.paymentReference!
                                        )
                                      }
                                      className="text-gray-400 hover:text-[#3c4948] flex-shrink-0"
                                      title="Copy"
                                    >
                                      <FaCopy className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Items */}
                            {order.items && order.items.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                                  <FaBox className="text-[#3c4948]" />
                                  Items ({order.items.length})
                                </h4>
                                <div className="space-y-2">
                                  {order.items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-3"
                                    >
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">
                                          {item.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {item.storeName} &middot; Qty:{" "}
                                          {item.quantity}
                                        </p>
                                      </div>
                                      <span className="text-sm font-medium text-gray-900">
                                        {formatPrice(item.price * item.quantity)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Amount */}
                            {order.amount !== undefined && (
                              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="font-medium text-gray-900">
                                  Total
                                </span>
                                <span className="font-bold text-lg text-[#3c4948]">
                                  {formatPrice(order.amount)}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </Wrapper>
  );
};

export default MyOrdersPage;
