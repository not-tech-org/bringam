"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaBox, FaReceipt, FaRedo } from "react-icons/fa";
import Wrapper from "../components/wrapper/Wrapper";
import Button from "../components/common/Button";
import { Skeleton } from "../components/common/Skeleton";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import { getCustomerOrders } from "../services/CustomerService";
import { getServerMessage } from "../lib/apiFeedback";
import {
  formatOrderCurrency,
  formatOrderDate,
  shortOrderId,
} from "../lib/orderUi";
import type { CustomerOrderSummary, OrderPage } from "../types/order";

const PAGE_SIZE = 10;

const OrdersLoadingState = () => (
  <div className="space-y-4" aria-label="Loading orders" aria-busy="true">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton width={120} height={20} />
            <Skeleton width={180} height={14} />
          </div>
          <Skeleton width={96} height={28} rounded="full" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 md:grid-cols-3">
          <Skeleton height={36} />
          <Skeleton height={36} />
          <Skeleton height={36} className="col-span-2 md:col-span-1" />
        </div>
      </div>
    ))}
  </div>
);

const MyOrdersPage = () => {
  const [page, setPage] = useState(0);
  const [ordersPage, setOrdersPage] = useState<OrderPage<CustomerOrderSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setIsUnauthorized(false);

    try {
      const response = await getCustomerOrders({
        pageNo: page,
        pageSize: PAGE_SIZE,
        sortBy: "id",
        sortDir: "desc",
      });

      if (!response.data) {
        throw new Error(response.message || "Orders could not be loaded.");
      }

      setOrdersPage(response.data);
    } catch (requestError) {
      const status = (requestError as { response?: { status?: number } })?.response?.status;
      setIsUnauthorized(status === 401 || status === 403);
      setError(getServerMessage(requestError, "Orders could not be loaded. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const orders = ordersPage?.content ?? [];
  const totalPages = ordersPage?.totalPages ?? 0;

  return (
    <Wrapper title="My orders">
      <div className="min-h-screen bg-white px-1 pb-16 sm:px-4">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#617371]">
              Customer account
            </p>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My orders</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              View every order, check its current status, and open the full order details.
            </p>
          </div>

          {!isLoading && !error && ordersPage && (
            <div className="inline-flex w-fit items-center gap-3 rounded-xl border border-[#3c4948]/15 bg-[#f6f8f8] px-4 py-3">
              <FaReceipt className="text-[#3c4948]" aria-hidden="true" />
              <div>
                <p className="text-xs text-gray-500">Total orders</p>
                <p className="font-semibold text-gray-900">{ordersPage.totalElements}</p>
              </div>
            </div>
          )}
        </header>

        {isLoading ? (
          <OrdersLoadingState />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center" role="alert">
            <h2 className="text-lg font-semibold text-gray-900">We couldn&apos;t load your orders</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">{error}</p>
            {isUnauthorized ? (
              <Link href="/auth" className="mt-5 inline-flex">
                <Button type="button" primary>Sign in</Button>
              </Link>
            ) : (
              <Button
                type="button"
                primary
                onClick={loadOrders}
                style="mx-auto mt-5 flex items-center gap-2"
              >
                <FaRedo aria-hidden="true" />
                Try again
              </Button>
            )}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f5f4]">
              <FaBox className="h-7 w-7 text-[#3c4948]" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-gray-900">No orders yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-600">
              Your completed checkouts will appear here when you place an order.
            </p>
            <Link href="/all" className="mt-6 inline-flex">
              <Button type="button" primary>Start shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <article
                  key={order.uuid || order.paymentReferenceUuid}
                  className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Order {shortOrderId(order.uuid)}
                        </h2>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Placed {formatOrderDate(order.orderDate)}</p>
                    </div>
                    <p className="text-xl font-bold text-[#3c4948]">
                      {formatOrderCurrency(order.amount)}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Items</p>
                      <p className="mt-1 font-medium text-gray-900">{order.noOfItems ?? 0}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Payment reference</p>
                      <p className="mt-1 truncate font-mono text-sm text-gray-800">
                        {order.paymentReferenceUuid || "Not available"}
                      </p>
                    </div>
                    {order.uuid && (
                      <Link
                        href={`/my-orders/${order.uuid}`}
                        className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#3c4948] px-4 py-2 text-sm font-semibold text-[#3c4948] transition-colors hover:bg-[#3c4948] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3c4948]/30 md:col-span-1"
                      >
                        View details
                        <FaArrowRight aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-between gap-4" aria-label="Order pages">
                <Button
                  type="button"
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                  disabled={ordersPage?.first}
                >
                  Previous
                </Button>
                <p className="text-sm text-gray-600">
                  Page <span className="font-semibold text-gray-900">{page + 1}</span> of {totalPages}
                </p>
                <Button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                  disabled={ordersPage?.last}
                >
                  Next
                </Button>
              </nav>
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default MyOrdersPage;
