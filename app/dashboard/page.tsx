"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MdArrowForward,
  MdCheck,
  MdErrorOutline,
  MdInventory2,
  MdOutlineStorefront,
  MdRefresh,
  MdShoppingBag,
} from "react-icons/md";
import Wrapper from "../components/wrapper/Wrapper";
import { SkeletonOverviewCard } from "../components/common/Skeleton";
import { useUser } from "../contexts/UserContext";
import { getServerMessage } from "../lib/apiFeedback";
import { getAllProducts, getAllStores, getUserProfile } from "../services/AuthService";
import type { StoreData } from "../types";

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
  const [loading, setLoading] = useState(true);
  const [storeError, setStoreError] = useState("");
  const [productError, setProductError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setStoreError("");
    setProductError("");

    try {
      const profileResponse = await getUserProfile();
      const vendorUuid = profileResponse.data?.data?.vendorResp?.uuid;

      if (!vendorUuid) {
        setStoreError("We could not find a vendor profile for this account.");
        setProducts(null);
        return;
      }

      const [storesResult, productsResult] = await Promise.allSettled([
        getAllStores(vendorUuid),
        getAllProducts(),
      ]);

      if (storesResult.status === "fulfilled") {
        setStores(storesResult.value.data?.data || []);
      } else {
        setStores([]);
        setStoreError(
          getServerMessage(storesResult.reason, "Could not load your stores.")
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
    } catch (error) {
      setStores([]);
      setProducts(null);
      setStoreError(
        getServerMessage(error, "Could not load your vendor dashboard.")
      );
    } finally {
      setLoading(false);
    }
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
        label: "Stores",
        value: storeError ? "—" : stores.length,
        icon: MdOutlineStorefront,
      },
      {
        label: "Total products",
        value: productError ? "—" : totalProducts,
        icon: MdInventory2,
      },
      {
        label: "Active products",
        value: productError ? "—" : products?.activeProducts ?? 0,
        icon: MdShoppingBag,
      },
      {
        label: "Products in stock",
        value: productError ? "—" : products?.productsInStock ?? 0,
        icon: MdCheck,
      },
    ],
    [productError, products, storeError, stores.length, totalProducts]
  );

  return (
    <Wrapper title="Dashboard">
      <div className="mx-auto max-w-7xl space-y-8 pb-10">
        <section className="overflow-hidden rounded-2xl bg-primary px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-white/70">Vendor dashboard</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Welcome back, {userName}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                {hasStore
                  ? "Manage your stores and products from one place."
                  : "Start by creating a store. You need one before customers can discover your products."}
              </p>
            </div>
            <Link
              href={hasStore ? "/products/add-product" : "/vendor-store?create=true"}
              className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#FFD700] px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-[#f2cd00] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
            >
              {hasStore ? "Add a product" : "Create your first store"}
              <MdArrowForward aria-hidden="true" className="text-lg" />
            </Link>
          </div>
        </section>

        {(storeError || productError) && !loading && (
          <section
            role="alert"
            className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <MdErrorOutline aria-hidden="true" className="mt-0.5 shrink-0 text-xl" />
              <div>
                <p className="font-semibold">Some dashboard data is unavailable</p>
                <p className="mt-1 text-sm">{storeError || productError}</p>
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
                A quick summary of your current catalogue.
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
                  <p className="mt-5 text-3xl font-bold text-gray-950">{value}</p>
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
                description="Add your store name, contact details, category, and location."
                href="/vendor-store?create=true"
                action={hasStore ? "Manage stores" : "Create store"}
              />
              <SetupStep
                complete={hasProduct}
                number={2}
                title="Add your first product"
                description="Create a product, then add it to the right store with its price and stock."
                href={hasStore ? "/products/add-product" : "/vendor-store?create=true"}
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
                  href="/vendor-store?create=true"
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-[#2a3a39] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Create store
                </Link>
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
