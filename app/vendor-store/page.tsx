"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Button from "../components/common/Button";
import { FaPlus } from "react-icons/fa";
import Modal from "../components/common/Modal";
import CreateStore from "../components/store/forms/CreateStore";
import {
  createVendorStore,
  getUserProfile,
  getAllStores,
} from "../services/AuthService";
import Image from "next/image";
import Link from "next/link";
import StoreCardMenu from "../components/common/StoreCardMenu";

// Dummy data for stores
const dummyStores = [
  {
    id: 1,
    name: "Quality wears",
    type: "Fashion & Jewelry store",
    members: [
      { id: 1, avatar: "/images/avatar1.svg" },
      { id: 2, avatar: "/images/avatar1.svg" },
      { id: 3, avatar: "/images/avatar1.svg" },
    ],
    additionalMembers: 2,
  },
  {
    id: 2,
    name: "Tech Gadgets",
    type: "Electronics store",
    members: [
      { id: 1, avatar: "/images/avatar1.svg" },
      { id: 2, avatar: "/images/avatar1.svg" },
    ],
    additionalMembers: 1,
  },
  {
    id: 3,
    name: "Beauty Corner",
    type: "Health & Beauty store",
    members: [
      { id: 1, avatar: "/images/avatar1.svg" },
      { id: 2, avatar: "/images/avatar1.svg" },
      { id: 3, avatar: "/images/avatar1.svg" },
    ],
    additionalMembers: 3,
  },
];

interface StateType {
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  website?: string;
  category?: string;
  street: string;
  city: string;
  lga: string;
  address?: {
    uuid?: string;
    entityUuid?: string;
    city: string;
    landmark: string;
    longitude: number;
    latitude: number;
    country: number;
    lga: string;
    state: string;
    street: string;
  };
  addressUuid: string;
  profilePhotoUrl: string;
  coverPhotoUrl: string;
  active: boolean;
}

const VendorStore = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [vendorUuid, setVendorUuid] = useState<string>("");
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [state, setState] = useState<StateType>({
    name: "",
    description: "",
    phoneNumber: "",
    email: "",
    website: "",
    category: "",
    street: "",
    city: "",
    lga: "",
    address: {
      uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      entityUuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      city: "",
      country: 0,
      landmark: "",
      lga: "",
      state: "",
      street: "",
      longitude: 0,
      latitude: 0,
    },
    addressUuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    profilePhotoUrl: "",
    coverPhotoUrl: "",
    active: true,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const { name, description, street, city, lga } = state;

  const onCreateVendorStore = async () => {
    const reqBody = {
      name,
      description,
      address: {
        street,
        lga,
        city,
      },
    };
    try {
      const response = await createVendorStore(reqBody);
      setState((state) => ({
        ...state,
        name: "",
        description: "",
        street: "",
        lga: "",
        city: "",
      }));
      closeModal();
      // Refresh stores list after creating a new store
      if (vendorUuid) {
        await fetchVendorStores(vendorUuid);
      }
    } catch (error) {
      console.error("Error creating vendor store:", error);
    }
  };

  const handleEditStore = (storeId: number) => {
    // TODO: Implement edit store functionality
    console.log("Edit store", storeId);
  };

  const handleAddMember = (storeId: number) => {
    // TODO: Implement add member functionality
    console.log("Add member", storeId);
  };

  const handleDeactivateStore = (storeId: number) => {
    // TODO: Implement deactivate store functionality
    console.log("Deactivate store", storeId);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      console.log(response);

      // Extract vendorUuid from the response
      if (response.data.data.vendorResp && response.data.data.vendorResp.uuid) {
        const uuid = response.data.data.vendorResp.uuid;
        console.log("UUID", uuid);
        setVendorUuid(uuid);
        // Fetch stores for this vendor
        await fetchVendorStores(uuid);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchVendorStores = async (uuid: string) => {
    try {
      setLoading(true);
      const response = await getAllStores(uuid);
      console.log("Vendor stores:", response.data.data);
      setStores(response.data.data || []);
    } catch (error) {
      console.error("Error fetching vendor stores:", error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="text-black">
          <CreateStore
            handleSubmit={onCreateVendorStore}
            state={state}
            onChange={onChange}
            onClose={closeModal}
          />
        </div>
      </Modal>
      <Wrapper>
        <div className="block">
          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold text-lg">My stores</p>
            <div>
              <Button type="button" primary style="w-fit" onClick={openModal}>
                Create Store
                <FaPlus className="ml-2" />
              </Button>
            </div>
          </div>

          {/* Store Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-8">
                <p className="text-[#666668]">Loading stores...</p>
              </div>
            ) : stores.length > 0 ? (
              stores.map((store) => (
                <div key={store.id || store.uuid} className="relative">
                  <Link href={`/vendor-store/${store.id || store.uuid}`}>
                    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="bg-[#F8F9FB] rounded-lg p-3">
                          <Image
                            src="/icons/store.svg"
                            alt="Store"
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[15px] text-[#1A1C1E]">
                            {store.name}
                          </h3>
                          <p className="text-sm text-[#666668] mt-1">
                            {store.description || store.type || "Store"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8">
                        <p className="text-sm text-[#666668] mb-2">
                          Store members
                        </p>
                        <div className="flex items-center">
                          {store.members && store.members.length > 0 ? (
                            <>
                              {store.members
                                .slice(0, 3)
                                .map((member: any, index: number) => (
                                  <div
                                    key={member.id || index}
                                    className="relative"
                                    style={{
                                      marginLeft: index > 0 ? "-8px" : "0",
                                      zIndex: store.members.length - index,
                                    }}
                                  >
                                    <Image
                                      src={
                                        member.avatar || "/images/avatar1.svg"
                                      }
                                      alt="Member"
                                      width={24}
                                      height={24}
                                      className="rounded-full border-2 border-white"
                                    />
                                  </div>
                                ))}
                              {store.members.length > 3 && (
                                <div className="relative ml-[-8px] flex items-center justify-center w-6 h-6 rounded-full bg-[#F0F1F3] text-[11px] text-[#666668] border-2 border-white">
                                  +{store.members.length - 3}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-[#666668]">
                              No members yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute top-4 right-4 z-10">
                    <StoreCardMenu
                      onEdit={() => handleEditStore(store.id || store.uuid)}
                      onAddMember={() =>
                        handleAddMember(store.id || store.uuid)
                      }
                      onDeactivate={() =>
                        handleDeactivateStore(store.id || store.uuid)
                      }
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col justify-center items-center py-12">
                <Image
                  src="/icons/store.svg"
                  alt="No stores"
                  width={48}
                  height={48}
                  className="opacity-50 mb-4"
                />
                <p className="text-[#666668] text-center">
                  No stores found. Create your first store to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default VendorStore;
