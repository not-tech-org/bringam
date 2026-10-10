"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MdArrowForward,
  MdCheck,
  MdErrorOutline,
  MdInventory2,
  MdOutlineStorefront,
  MdPeople,
  MdPayments,
  MdReceiptLong,
  MdRefresh,
  MdVisibility,
} from "react-icons/md";
import Wrapper from "../components/wrapper/Wrapper";
import { SkeletonOverviewCard } from "../components/common/Skeleton";
import { useUser } from "../contexts/UserContext";
import { getServerMessage } from "../lib/apiFeedback";
import {
  getAllProducts,
  getAllStores,
  getUserProfile,
  getVendorDashboard,
} from "../services/AuthService";
import {
  formatOrderCurrency,
  formatOrderDate,
  formatOrderStatus,
  getOrderStatusClasses,
  shortOrderId,
} from "../lib/orderUi";
import type { StoreData, VendorDashboardData } from "../types";

interface ProductSummary {
  activeProducts?: number;
  productsInStock?: number;
  totalProductsSold?: number;
  products?: {
    content?: unknown[];
    totalElements?: number;
  };
}

const DashboardPage = () => {
  const { userName } = useUser();
  const [stores, setStores] = useState<StoreData[]>([]);
  const [products, setProducts] = useState<ProductSummary | null>(null);
  const [dashboard, setDashboard] = useState<VendorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [storeError, setStoreError] = useState("");
  const [productError, setProductError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setDashboardError("");
    setStoreError("");
    setProductError("");

    const [profileResult, dashboardResult, productsResult] =
      await Promise.allSettled([
        getUserProfile(),
        getVendorDashboard(),
        getAllProducts(),
      ]);

    if (dashboardResult.status === "fulfilled") {
      setDashboard(dashboardResult.value.data?.data || null);
    } else {
      setDashboard(null);
      setDashboardError(
        getServerMessage(
          dashboardResult.reason,
          "Could not load your dashboard summary."
        )
      );
    }

    if (productsResult.status === "fulfilled") {
      setProducts(productsResult.value.data?.data || null);
    } else {
      setProducts(null);
      setProductError(
        getServerMessage(
          productsResult.reason,
          "Could not load your product summary."
        )
      );
    }

    if (profileResult.status === "fulfilled") {
      const vendorUuid = profileResult.value.data?.data?.vendorResp?.uuid;

      if (vendorUuid) {
        try {
          const storesResponse = await getAllStores(vendorUuid);
          setStores(storesResponse.data?.data || []);
        } catch (error) {
          setStores([]);
          setStoreError(
            getServerMessage(error, "Could not load your stores.")
          );
        }
      } else {
        setStores([]);
        setStoreError("We could not find a vendor profile for this account.");
      }
    } else {
      setStores([]);
      setStoreError(
        getServerMessage(profileResult.reason, "Could not load your vendor profile.")
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const totalProducts =
    products?.products?.totalElements ?? products?.products?.content?.length ?? 0;
  const hasStore = stores.length > 0;
  const hasProduct = totalProducts > 0;
  const completedSteps = Number(hasStore) + Number(hasProduct);

  const metrics = useMemo(
    () => [
      {
        label: "Average revenue",
        value: dashboardError
          ? "—"
          : formatOrderCurrency(dashboard?.averageRevenue),
        icon: MdPayments,
      },
      {
        label: "Orders",
        value: dashboardError ? "—" : dashboard?.orders ?? 0,
        icon: MdReceiptLong,
      },
      {
        label: "Store visits",
        value: dashboardError ? "—" : dashboard?.storeVisits ?? 0,
        icon: MdPeople,
      },
      {
        label: "Product views",
        value: dashboardError ? "—" : dashboard?.productViews ?? 0,
        icon: MdVisibility,
      },
    ],
    [dashboard, dashboardError]
  );

  return (
    <Wrapper title="Dashboard">
      <div className="mx-auto max-w-7xl space-y-8 pb-10">
        <section className="overflow-hidden rounded-2xl bg-primary px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-white/70">Vendor dashboard</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Welcome back, {dashboard?.name || userName}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                {hasStore
                  ? "Manage your stores and products from one place."
                  : "Start by creating a store. You need one before customers can discover your products."}
              </p>
            </div>
            <Link
              href={hasStore ? "/products/add-product" : "/vendor-store/create"}
              className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#FFD700] px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-[#f2cd00] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
            >
              {hasStore ? "Add a product" : "Create your first store"}
              <MdArrowForward aria-hidden="true" className="text-lg" />
            </Link>
          </div>
        </section>

        {(dashboardError || storeError || productError) && !loading && (
          <section
            role="alert"
            className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <MdErrorOutline aria-hidden="true" className="mt-0.5 shrink-0 text-xl" />
              <div>
                <p className="font-semibold">Some dashboard data is unavailable</p>
                <p className="mt-1 text-sm">
                  {dashboardError || storeError || productError}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm text-red-800 ring-1 ring-red-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <MdRefresh aria-hidden="true" /> Retry
            </button>
          </section>
        )}

        <section aria-labelledby="overview-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 id="overview-heading" className="text-lg font-semibold text-gray-950">
                Business overview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Live performance data from your vendor account.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonOverviewCard key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map(({ label, value, icon: Icon }) => (
                <article key={label} className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF3F2] text-primary">
                      <Icon aria-hidden="true" className="text-xl" />
                    </span>
                  </div>
                  <p className="mt-5 break-words text-2xl font-bold text-gray-950 sm:text-3xl">
                    {value}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6" aria-labelledby="setup-heading">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="setup-heading" className="text-lg font-semibold text-gray-950">
                  Get ready to sell
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Complete these steps to make your products available to customers.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {completedSteps}/2 complete
              </span>
            </div>

            <ol className="mt-6 divide-y divide-gray-100">
              <SetupStep
                complete={hasStore}
                number={1}
                title="Create your store"
                description="Add your store name, contact details, and location."
                href="/vendor-store/create"
                action={hasStore ? "Manage stores" : "Create store"}
              />
              <SetupStep
                complete={hasProduct}
                number={2}
                title="Add your first product"
                description="Create a product, then add it to the right store with its price and stock."
                href={hasStore ? "/products/add-product" : "/vendor-store/create"}
                action={hasStore ? (hasProduct ? "Manage products" : "Add product") : "Create store first"}
              />
            </ol>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6" aria-labelledby="stores-heading">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 id="stores-heading" className="text-lg font-semibold text-gray-950">
                  Your stores
                </h2>
                <p className="mt-1 text-sm text-gray-500">Manage where customers shop.</p>
              </div>
              <Link href="/vendor-store" className="text-sm font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>

            {loading ? (
              <div className="mt-6 space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            ) : stores.length > 0 ? (
              <div className="mt-5 space-y-3">
                {stores.slice(0, 3).map((store) => (
                  <Link
                    key={store.uuid || store.id || store.name}
                    href={`/vendor-store/${store.uuid || store.id}`}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF3F2] text-primary">
                      <MdOutlineStorefront aria-hidden="true" className="text-xl" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-gray-900">{store.name}</span>
                      <span className="mt-0.5 block text-xs text-gray-500">{store.active ? "Active" : "Inactive"}</span>
                    </span>
                    <MdArrowForward aria-hidden="true" className="text-gray-400" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-7 text-center">
                <MdOutlineStorefront aria-hidden="true" className="mx-auto text-3xl text-gray-400" />
                <p className="mt-3 font-semibold text-gray-900">No store yet</p>
                <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-gray-500">
                  Create a store before adding products for customers to buy.
                </p>
                <Link
                  href="/vendor-store/create"
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-[#2a3a39] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Create store
                </Link>
              </div>
            )}
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section
            className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6"
            aria-labelledby="best-products-heading"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="best-products-heading"
                  className="text-lg font-semibold text-gray-950"
                >
                  Best-performing products
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Products with the strongest sales performance.
                </p>
              </div>
              {!dashboardError && (
                <span className="shrink-0 rounded-full bg-[#EEF3F2] px-3 py-1 text-xs font-semibold text-primary">
                  {dashboard?.activeCustomers ?? 0} active customers
                </span>
              )}
            </div>

            {loading ? (
              <div className="mt-6 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-14 animate-pulse rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            ) : dashboard?.bestPerformingProducts?.length ? (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="pb-3 font-semibold">Product</th>
                      <th className="pb-3 text-right font-semibold">Units sold</th>
                      <th className="pb-3 text-right font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dashboard.bestPerformingProducts.map((product, index) => (
                      <tr key={`${product.productName || "product"}-${index}`}>
                        <td className="py-4 pr-4 font-medium text-gray-900">
                          {product.productName || "Unnamed product"}
                        </td>
                        <td className="py-4 text-right text-gray-600">
                          {product.unitsSold ?? 0}
                        </td>
                        <td className="py-4 text-right font-medium text-gray-900">
                          {formatOrderCurrency(product.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                <MdInventory2
                  aria-hidden="true"
                  className="mx-auto text-3xl text-gray-400"
                />
                <p className="mt-3 font-semibold text-gray-900">
                  No product performance yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Sales data will appear here after customers place orders.
                </p>
              </div>
            )}
          </section>

          <section
            className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6"
            aria-labelledby="recent-orders-heading"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="recent-orders-heading"
                  className="text-lg font-semibold text-gray-950"
                >
                  Recent orders
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  The latest orders returned by your dashboard.
                </p>
              </div>
              {!dashboardError && (
                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {dashboard?.customers ?? 0} customers
                </span>
              )}
            </div>

            {loading ? (
              <div className="mt-6 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-14 animate-pulse rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            ) : dashboard?.recentOrders?.length ? (
              <div className="mt-5 space-y-3">
                {dashboard.recentOrders.map((order) => (
                  <article
                    key={order.uuid || order.id}
                    className="flex flex-col gap-3 rounded-lg border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {shortOrderId(order.uuid)}
                        </p>
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getOrderStatusClasses(
                            order.status
                          )}`}
                        >
                          {formatOrderStatus(order.status)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatOrderDate(order.createdAt)} · {order.noOfItems ?? 0}{" "}
                        item{order.noOfItems === 1 ? "" : "s"}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold text-gray-950">
                      {formatOrderCurrency(order.amount)}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                <MdReceiptLong
                  aria-hidden="true"
                  className="mx-auto text-3xl text-gray-400"
                />
                <p className="mt-3 font-semibold text-gray-900">
                  No recent orders
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  New customer orders will appear here.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

interface SetupStepProps {
  complete: boolean;
  number: number;
  title: string;
  description: string;
  href: string;
  action: string;
}

const SetupStep = ({ complete, number, title, description, href, action }: SetupStepProps) => (
  <li className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
    <span
      aria-hidden="true"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        complete ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {complete ? <MdCheck className="text-lg" /> : number}
    </span>
    <div className="min-w-0 flex-1">
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
    </div>
    <Link
      href={href}
      className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {action}
    </Link>
  </li>
);

export default DashboardPage;
