"use client";

import Link from "next/link";
import {
  MdArrowForward,
  MdBusiness,
  MdInventory2,
  MdOutlineStorefront,
  MdPerson,
  MdSupportAgent,
} from "react-icons/md";
import Wrapper from "../components/wrapper/Wrapper";
import { useUser } from "../contexts/UserContext";
import { getUserTypeInfo } from "../lib/utils";

const SettingsPage = () => {
  const { isVendorView, userInitials } = useUser();
  const { profileData } = getUserTypeInfo();
  const customer = profileData?.customerResp;
  const vendor = profileData?.vendorResp;
  const accountOwner = [customer?.firstName, customer?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <Wrapper title="Settings">
      <div className="mx-auto max-w-5xl space-y-8 pb-10">
        <header>
          <p className="text-sm font-medium text-gray-500">
            {isVendorView ? "Vendor account" : "Customer account"}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">Account settings</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {isVendorView
              ? "Review your account information and manage the parts of BringAm connected to your business."
              : "Review your account information and find help when you need it."}
          </p>
        </header>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white" aria-labelledby="profile-settings-heading">
          <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFD700] text-sm font-bold tracking-wide text-primary ring-4 ring-[#F3F6F5]"
              >
                {userInitials}
              </span>
              <div>
                <h2 id="profile-settings-heading" className="font-semibold text-gray-950">
                  Account profile
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Profile details are currently read-only.
                </p>
              </div>
            </div>
            {vendor && isVendorView && (
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  vendor.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${vendor.isActive ? "bg-green-500" : "bg-red-500"}`}
                />
                {vendor.isActive ? "Active vendor" : "Inactive vendor"}
              </span>
            )}
          </div>

          {customer || vendor ? (
            <dl className="grid sm:grid-cols-2">
              <Detail label="Account owner" value={accountOwner} icon={MdPerson} />
              <Detail label="Email address" value={customer?.email} icon={MdPerson} />
              {isVendorView && (
                <>
                  <Detail label="Business name" value={vendor?.businessName} icon={MdBusiness} />
                  <Detail label="Business type" value={vendor?.businessType} icon={MdBusiness} />
                </>
              )}
            </dl>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="font-semibold text-gray-900">Profile details are unavailable</p>
              <p className="mt-1 text-sm text-gray-500">
                Sign in again to refresh your account information.
              </p>
            </div>
          )}
        </section>

        {isVendorView && (
          <section aria-labelledby="business-settings-heading">
            <div className="mb-4">
              <h2 id="business-settings-heading" className="text-lg font-semibold text-gray-950">
                Business management
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Store-specific details can be updated from the relevant management page.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <SettingsLink
                href="/vendor-store"
                title="Stores"
                description="Create stores and update their contact, location, and availability."
                icon={MdOutlineStorefront}
              />
              <SettingsLink
                href="/products"
                title="Products"
                description="Add products and manage the catalogue available to your stores."
                icon={MdInventory2}
              />
            </div>
          </section>
        )}

        <section aria-labelledby="help-settings-heading">
          <div className="mb-4">
            <h2 id="help-settings-heading" className="text-lg font-semibold text-gray-950">
              Help and support
            </h2>
          </div>
          <SettingsLink
            href="/support"
            title="Contact support"
            description={
              isVendorView
                ? "Get help with your account, stores, products, or orders."
                : "Get help with your account, shopping, or orders."
            }
            icon={MdSupportAgent}
          />
        </section>
      </div>
    </Wrapper>
  );
};

interface DetailProps {
  label: string;
  value?: string;
  icon: typeof MdPerson;
}

const Detail = ({ label, value, icon: Icon }: DetailProps) => (
  <div className="flex min-w-0 gap-3 border-b border-gray-100 px-5 py-4 last:border-b-0 sm:px-6 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(odd)]:border-r">
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
      <Icon aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value || "Not provided"}
      </dd>
    </div>
  </div>
);

interface SettingsLinkProps {
  href: string;
  title: string;
  description: string;
  icon: typeof MdPerson;
}

const SettingsLink = ({ href, title, description, icon: Icon }: SettingsLinkProps) => (
  <Link
    href={href}
    className="group flex min-h-28 items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
  >
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EEF3F2] text-xl text-primary">
      <Icon aria-hidden="true" />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block font-semibold text-gray-950">{title}</span>
      <span className="mt-1 block text-sm leading-6 text-gray-500">{description}</span>
    </span>
    <MdArrowForward aria-hidden="true" className="shrink-0 text-xl text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-700" />
  </Link>
);

export default SettingsPage;
