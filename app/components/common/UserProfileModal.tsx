import React from "react";
import Image from "next/image";
import { MdBusiness, MdPerson } from "react-icons/md";
import { useUser } from "@/app/contexts/UserContext";
import { getUserTypeInfo } from "@/app/lib/utils";
import Modal from "./Modal";
import Button from "./Button";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isVendorView, isVendorCapable } = useUser();
  const { profileData } = getUserTypeInfo();

  const customerData = profileData?.customerResp;
  const vendorData = profileData?.vendorResp;
  const fullName = [customerData?.firstName, customerData?.lastName]
    .filter(Boolean)
    .join(" ");
  const profileName = isVendorView
    ? vendorData?.businessName || fullName || "Vendor account"
    : fullName || vendorData?.businessName || "Customer account";
  const hasProfileDetails = Boolean(customerData || vendorData);

  const detailRow = (label: string, value?: string) =>
    value ? (
      <div className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center">
        <dt className="text-sm text-gray-500">{label}</dt>
        <dd className="break-words text-sm font-semibold text-gray-900 sm:text-right">
          {value}
        </dd>
      </div>
    ) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeIcon
      ariaLabel="Account profile"
      panelClassName="max-w-xl"
      contentClassName="p-0"
    >
      <div className="max-h-[calc(100vh-2rem)] overflow-y-auto text-black">
        <header className="border-b border-gray-100 px-5 py-6 pr-16 sm:px-7 sm:py-7 sm:pr-20">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F3F6F5] ring-1 ring-gray-200">
              <Image
                src="/icons/Status.png"
                width={44}
                height={44}
                alt="Profile"
                className="rounded-full"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#586a65]">
                Account profile
              </p>
              <h2 className="mt-1 truncate text-xl font-bold text-gray-950 sm:text-2xl">
                {profileName}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {isVendorView ? "Vendor view" : "Customer view"}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-5 px-5 py-6 sm:px-7">
          {hasProfileDetails ? (
            <>
              {customerData && (
                <section aria-labelledby="personal-info-heading">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                      <MdPerson aria-hidden="true" />
                    </span>
                    <h3
                      id="personal-info-heading"
                      className="font-semibold text-gray-900"
                    >
                      Personal details
                    </h3>
                  </div>
                  <dl className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {detailRow("Name", fullName)}
                    {detailRow("Email", customerData.email)}
                    {detailRow("Phone", customerData.phoneNumber)}
                  </dl>
                </section>
              )}

              {vendorData && isVendorCapable && (
                <section aria-labelledby="business-info-heading">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF3F2] text-primary">
                      <MdBusiness aria-hidden="true" />
                    </span>
                    <h3
                      id="business-info-heading"
                      className="font-semibold text-gray-900"
                    >
                      Business details
                    </h3>
                  </div>
                  <dl className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {detailRow("Business", vendorData.businessName)}
                    {detailRow("Type", vendorData.businessType)}
                    <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center">
                      <dt className="text-sm text-gray-500">Status</dt>
                      <dd className="sm:text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            vendorData.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 rounded-full ${
                              vendorData.isActive
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          {vendorData.isActive ? "Active" : "Inactive"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </section>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
              <p className="font-semibold text-gray-900">
                Profile details are unavailable
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Refresh your account or sign in again to reload your profile.
              </p>
            </div>
          )}
        </div>

        <footer className="flex justify-end border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-7">
          <Button
            type="button"
            onClick={onClose}
            primary
            className="!my-0 min-h-11 rounded-lg px-6 font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Done
          </Button>
        </footer>
      </div>
    </Modal>
  );
};

export default UserProfileModal;
