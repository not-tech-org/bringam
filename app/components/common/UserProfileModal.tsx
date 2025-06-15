import React from "react";
import Modal from "./Modal";
import Image from "next/image";
import Button from "./Button";
import { MdEmail, MdPhone, MdBusiness, MdPerson } from "react-icons/md";
import { useUser } from "@/app/contexts/UserContext";
import { getUserTypeInfo } from "@/app/lib/utils";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isVendorView, isVendorCapable, switchToCustomer, switchToVendor } =
    useUser();
  const { profileData } = getUserTypeInfo();

  const customerData = profileData?.customerResp;
  const vendorData = profileData?.vendorResp;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-black max-w-md mx-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#F8F9FB] rounded-full flex items-center justify-center">
              <Image
                src="/icons/Status.png"
                width={40}
                height={40}
                alt="Profile"
                className="rounded-full"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isVendorView ? "Vendor Profile" : "Customer Profile"}
            </h2>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            {/* Customer Information */}
            {customerData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MdPerson className="text-gray-600" />
                  <span className="font-medium text-gray-700">
                    Personal Info
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  {customerData.firstName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {customerData.firstName} {customerData.lastName || ""}
                      </span>
                    </div>
                  )}
                  {customerData.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{customerData.email}</span>
                    </div>
                  )}
                  {customerData.phoneNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">
                        {customerData.phoneNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vendor Information */}
            {vendorData && isVendorCapable && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MdBusiness className="text-blue-600" />
                  <span className="font-medium text-blue-700">
                    Business Info
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  {vendorData.businessName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business:</span>
                      <span className="font-medium">
                        {vendorData.businessName}
                      </span>
                    </div>
                  )}
                  {vendorData.businessType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">
                        {vendorData.businessType}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-medium ${
                        vendorData.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {vendorData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Account Actions */}
            {/* <div className="border-t pt-4">
              <div className="space-y-3">
                
                {isVendorCapable && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current View:</span>
                    <Button
                      type="button"
                      onClick={isVendorView ? switchToCustomer : switchToVendor}
                      style="text-sm px-3 py-1"
                    >
                      Switch to {isVendorView ? "Customer" : "Vendor"}
                    </Button>
                  </div>
                )}

                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Type:</span>
                  <span className="text-sm font-medium">
                    {isVendorCapable ? "Customer & Vendor" : "Customer"}
                  </span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Close Button */}
          <div className="mt-6 pt-4 border-t flex justify-center">
            <Button type="button" onClick={onClose} style="w-fit" primary>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal;
