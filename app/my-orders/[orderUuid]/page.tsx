"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaArrowLeft,
  FaBox,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRedo,
  FaUser,
} from "react-icons/fa";
import Wrapper from "@/app/components/wrapper/Wrapper";
import Button from "@/app/components/common/Button";
import { Skeleton } from "@/app/components/common/Skeleton";
import OrderStatusBadge from "@/app/components/orders/OrderStatusBadge";
import { getCustomerOrderDetails } from "@/app/services/CustomerService";
import { getServerMessage } from "@/app/lib/apiFeedback";
import {
  formatOrderCurrency,
  formatOrderDate,
  shortOrderId,
} from "@/app/lib/orderUi";
import type { CustomerOrderDetails } from "@/app/types/order";

const OrderDetailsLoading = () => (
  <div className="space-y-6" aria-label="Loading order details" aria-busy="true">
    <div className="rounded-2xl border border-gray-200 p-6">
      <Skeleton width={180} height={28} />
      <Skeleton width={240} height={16} className="mt-3" />
    </div>
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-4 rounded-2xl border border-gray-200 p-6">
        <Skeleton width={140} height={22} />
        <Skeleton height={88} />
        <Skeleton height={88} />
      </div>
      <div className="space-y-4 rounded-2xl border border-gray-200 p-6">
        <Skeleton width={120} height={22} />
        <Skeleton height={180} />
      </div>
    </div>
  </div>
);

const OrderDetailsPage = () => {
  const params = useParams<{ orderUuid: string }>();
  const orderUuid = params?.orderUuid;
  const [order, setOrder] = useState<CustomerOrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const loadOrder = useCallback(async () => {
    if (!orderUuid) return;
    setIsLoading(true);
    setError("");
    setIsUnauthorized(false);

    try {
      const response = await getCustomerOrderDetails(orderUuid);
      if (!response.data) {
        throw new Error(response.message || "Order details could not be loaded.");
      }
      setOrder(response.data);
    } catch (requestError) {
      const status = (requestError as { response?: { status?: number } })?.response?.status;
      setIsUnauthorized(status === 401 || status === 403);
      setError(
        getServerMessage(requestError, "Order details could not be loaded. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  }, [orderUuid]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const address = order?.deliveryAddress;
  const recipientName = [address?.firstName, address?.lastName].filter(Boolean).join(" ");
  const addressLines = [address?.street, address?.landmark, address?.lga].filter(Boolean);

  return (
    <Wrapper title="Order details">
      <div className="min-h-screen bg-white px-1 pb-16 sm:px-4">
        <Link
          href="/my-orders"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#3c4948] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3c4948]/30"
        >
          <FaArrowLeft aria-hidden="true" />
          Back to my orders
        </Link>

        {isLoading ? (
          <OrderDetailsLoading />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center" role="alert">
            <h1 className="text-xl font-semibold text-gray-900">We couldn&apos;t load this order</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">{error}</p>
            {isUnauthorized ? (
              <Link href="/auth" className="mt-5 inline-flex">
                <Button type="button" primary>Sign in</Button>
              </Link>
            ) : (
              <Button type="button" primary onClick={loadOrder} style="mx-auto mt-5 flex items-center gap-2">
                <FaRedo aria-hidden="true" />
                Try again
              </Button>
            )}
          </div>
        ) : order ? (
          <>
            <header className="rounded-2xl border border-gray-200 bg-[#f8faf9] p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                      Order {shortOrderId(order.uuid)}
                    </h1>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt aria-hidden="true" />
                    Placed {formatOrderDate(order.orderDate)}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-gray-500">Order total</p>
                  <p className="mt-1 text-2xl font-bold text-[#3c4948]">
                    {formatOrderCurrency(order.amount)}
                  </p>
                </div>
              </div>
            </header>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6" aria-labelledby="order-items-heading">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 id="order-items-heading" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <FaBox className="text-[#3c4948]" aria-hidden="true" />
                    Items
                  </h2>
                  <span className="text-sm text-gray-500">{order.noOfItems ?? order.items?.length ?? 0} items</span>
                </div>

                {order.items?.length ? (
                  <div className="divide-y divide-gray-100">
                    {order.items.map((item, index) => {
                      const imageUrl = item.productImages?.find(Boolean);
                      return (
                        <article key={item.uuid || `${item.productName}-${index}`} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                          <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                            {imageUrl ? (
                              <Image src={imageUrl} alt={item.productName || "Ordered product"} fill sizes="80px" className="object-cover" />
                            ) : (
                              <FaBox className="h-6 w-6 text-gray-400" aria-hidden="true" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900">{item.productName || "Product"}</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  Quantity: {item.quantity ?? 0} · {formatOrderCurrency(item.unitPrice)} each
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900">{formatOrderCurrency(item.total)}</p>
                            </div>
                            <div className="mt-3"><OrderStatusBadge status={item.status} /></div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
                    No item details were returned for this order.
                  </p>
                )}
              </section>

              <div className="space-y-6">
                <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6" aria-labelledby="summary-heading">
                  <h2 id="summary-heading" className="text-lg font-semibold text-gray-900">Payment summary</h2>
                  <dl className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between gap-4"><dt className="text-gray-600">Subtotal</dt><dd className="font-medium text-gray-900">{formatOrderCurrency(order.subtotal)}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-gray-600">Delivery</dt><dd className="font-medium text-gray-900">{formatOrderCurrency(order.deliveryCost)}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-gray-600">VAT</dt><dd className="font-medium text-gray-900">{formatOrderCurrency(order.vat)}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-gray-600">Service charge</dt><dd className="font-medium text-gray-900">{formatOrderCurrency(order.serviceCharge)}</dd></div>
                    <div className="flex justify-between gap-4 border-t border-gray-200 pt-4 text-base"><dt className="font-semibold text-gray-900">Total</dt><dd className="font-bold text-[#3c4948]">{formatOrderCurrency(order.amount)}</dd></div>
                  </dl>
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Payment reference</p>
                    <p className="mt-2 break-all font-mono text-sm text-gray-800">{order.paymentReferenceUuid || "Not available"}</p>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6" aria-labelledby="delivery-heading">
                  <h2 id="delivery-heading" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <FaMapMarkerAlt className="text-[#3c4948]" aria-hidden="true" />
                    Delivery details
                  </h2>
                  {address ? (
                    <div className="mt-5 space-y-4 text-sm">
                      {recipientName && (
                        <div className="flex items-start gap-3">
                          <FaUser className="mt-0.5 text-gray-400" aria-hidden="true" />
                          <div><p className="font-medium text-gray-900">{recipientName}</p><p className="mt-1 text-gray-600">{address.phoneNumber || address.email || "Contact not available"}</p></div>
                        </div>
                      )}
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Address</p>
                        <p className="mt-2 leading-6 text-gray-700">{addressLines.length ? addressLines.join(", ") : "Address not available"}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-600">Delivery details were not returned.</p>
                  )}
                </section>

                {order.expiresAt && (
                  <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Payment window expires {formatOrderDate(order.expiresAt)}.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Wrapper>
  );
};

export default OrderDetailsPage;
