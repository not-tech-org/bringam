"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Button from "../components/common/Button";
import { FaPlus } from "react-icons/fa";
import Modal from "../components/common/Modal";
import CreateStore from "../components/store/forms/CreateStore";
import EditStore from "../components/store/forms/EditStore";
import ConfirmationModal from "../components/common/ConfirmationModal";
import {
  createVendorStore,
  getUserProfile,
  getAllStores,
  getStoreById,
  updateVendorStore,
  deactivateVendorStore,
  getAllCountries,
  getStatesByCountryId,
  getCitiesByStateId,
} from "../services/AuthService";
import Image from "next/image";
import Link from "next/link";
import StoreCardMenu from "../components/common/StoreCardMenu";
import { StoreFormData, StoreData, Country, State, City } from "../types";

const VendorStore = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string>("");
  const [deactivatingStoreId, setDeactivatingStoreId] = useState<string>("");
  const [deactivatingStoreName, setDeactivatingStoreName] =
    useState<string>("");
  const [vendorUuid, setVendorUuid] = useState<string>("");
  const [stores, setStores] = useState<StoreData[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openEditModal = () => setIsEditOpen(true);
  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingStoreId("");
    // Reset edit state to initial values
    setEditState({
      name: "",
      description: "",
      phoneNumber: "",
      email: "",
      website: "",
      category: "",
      country: "",
      street: "",
      city: "",
      lga: "",
      state: "",
      landmark: "",
      address: {
        city: 0,
        country: 0,
        landmark: "",
        lga: "",
        state: 0,
        street: "",
        longitude: 0,
        latitude: 0,
      },
      profilePhotoUrl: "",
      coverPhotoUrl: "",
      active: true,
    });
  };

  const openDeactivateModal = () => setIsDeactivateOpen(true);
  const closeDeactivateModal = () => {
    setIsDeactivateOpen(false);
    setDeactivatingStoreId("");
    setDeactivatingStoreName("");
  };

  const [state, setState] = useState<StoreFormData>({
    name: "",
    description: "",
    phoneNumber: "",
    email: "",
    website: "",
    category: "",
    country: "",
    street: "",
    city: "",
    lga: "",
    state: "",
    landmark: "",
    address: {
      city: 0,
      country: 0,
      landmark: "",
      lga: "",
      state: 0,
      street: "",
      longitude: 0,
      latitude: 0,
    },
    profilePhotoUrl: "",
    coverPhotoUrl: "",
    active: true,
  });

  const [editState, setEditState] = useState<StoreFormData>({
    name: "",
    description: "",
    phoneNumber: "",
    email: "",
    website: "",
    category: "",
    country: "",
    street: "",
    city: "",
    lga: "",
    state: "",
    landmark: "",
    address: {
      city: 0,
      country: 0,
      landmark: "",
      lga: "",
      state: 0,
      street: "",
      longitude: 0,
      latitude: 0,
    },
    profilePhotoUrl: "",
    coverPhotoUrl: "",
    active: true,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const {
    name,
    description,
    phoneNumber,
    email,
    website,
    country,
    street,
    city,
    lga,
    state: stateValue,
    landmark,
  } = state;

  const onCreateVendorStore = async () => {
    setCreateLoading(true);
    const reqBody = {
      vendorUuid: vendorUuid,
      name,
      description,
      phoneNumber,
      email,
      website,
      address: {
        city: parseInt(city) || Math.floor(Math.random() * 1000) + 1, // Use selected city ID
        country: parseInt(country) || Math.floor(Math.random() * 100) + 1, // Use selected country ID
        landmark,
        lga,
        state: parseInt(stateValue) || Math.floor(Math.random() * 100) + 1, // Use selected state ID
        street,
        longitude: 0, // Default to 0, can be updated later
        latitude: 0, // Default to 0, can be updated later
      },
      profilePhotoUrl: "",
      coverPhotoUrl: "",
      active: true,
    };

    try {
      const response = await createVendorStore(reqBody);
      console.log("Store created successfully:", response.data);

      // Reset form
      setState((prevState) => ({
        ...prevState,
        name: "",
        description: "",
        phoneNumber: "",
        email: "",
        website: "",
        country: "",
        street: "",
        lga: "",
        city: "",
        state: "",
        landmark: "",
      }));

      // Refresh stores list after creating a new store
      if (vendorUuid) {
        await fetchVendorStores(vendorUuid);
      }

      // Don't close modal here - let the success step handle it
    } catch (error) {
      console.error("Error creating vendor store:", error);
      throw error; // Re-throw to let the component handle the error
    } finally {
      setCreateLoading(false);
    }
  };

  const onUpdateVendorStore = async () => {
    if (!editingStoreId) return;

    const reqBody = {
      vendorUuid: vendorUuid,
      name: editState.name,
      description: editState.description,
      phoneNumber: editState.phoneNumber,
      email: editState.email,
      website: editState.website,
      address: {
        city: parseInt(editState.city) || Math.floor(Math.random() * 1000) + 1, // Use selected city ID
        country:
          parseInt(editState.country) || Math.floor(Math.random() * 100) + 1, // Use selected country ID
        landmark: editState.landmark,
        lga: editState.lga,
        state: parseInt(editState.state) || Math.floor(Math.random() * 100) + 1, // Use selected state ID
        street: editState.street,
        longitude: 0, // Default to 0, can be updated later
        latitude: 0, // Default to 0, can be updated later
      },
      profilePhotoUrl: "",
      coverPhotoUrl: "",
      active: true,
    };

    try {
      setEditLoading(true);
      const response = await updateVendorStore(editingStoreId, reqBody);
      console.log("Store updated successfully:", response.data);

      // Refresh stores list after updating
      if (vendorUuid) {
        await fetchVendorStores(vendorUuid);
      }

      // Don't close modal here - let the EditStore component handle success
    } catch (error) {
      console.error("Error updating vendor store:", error);
      throw error; // Re-throw to let the EditStore component handle the error
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditStore = async (storeId: string) => {
    try {
      setEditingStoreId(storeId);
      // Fetch store details to pre-fill the form
      const response = await getStoreById(storeId);
      const storeData = response.data.data || response.data;

      // Pre-fill the edit form with existing store data
      setEditState({
        name: storeData.name || "",
        description: storeData.description || "",
        phoneNumber: storeData.phoneNumber || "",
        email: storeData.email || "",
        website: storeData.website || "",
        category: storeData.category || "",
        country: storeData.address?.country?.toString() || "",
        street: storeData.address?.street || "",
        city: storeData.address?.city?.toString() || "",
        lga: storeData.address?.lga || "",
        state: storeData.address?.state?.toString() || "",
        landmark: storeData.address?.landmark || "",
        address: {
          city: storeData.address?.city || 0,
          country: storeData.address?.country || 0,
          landmark: storeData.address?.landmark || "",
          lga: storeData.address?.lga || "",
          state: storeData.address?.state || 0,
          street: storeData.address?.street || "",
          longitude: storeData.address?.longitude || 0,
          latitude: storeData.address?.latitude || 0,
        },
        profilePhotoUrl: storeData.profilePhotoUrl || "",
        coverPhotoUrl: storeData.coverPhotoUrl || "",
        active: storeData.active !== undefined ? storeData.active : true,
      });

      // Fetch states if country is available
      if (storeData.address?.country) {
        await fetchStates(storeData.address.country);
      }

      // Fetch cities if state is available
      if (storeData.address?.state) {
        await fetchCities(storeData.address.state);
      }

      openEditModal();
    } catch (error) {
      console.error("Error fetching store details for edit:", error);
    }
  };

  const handleAddMember = (storeId: string) => {
    // TODO: Implement add member functionality
    console.log("Add member", storeId);
  };

  const handleDeactivateStore = (storeId: string) => {
    if (!storeId) {
      console.error("No store ID provided for deactivation");
      return;
    }

    // Find the store name for the confirmation message
    const store = stores.find((s) => (s.id || s.uuid) === storeId);

    if (!store) {
      console.error("Store not found for deactivation:", storeId);
      // Show error feedback if store is not found
      import("../components/utils/helperFunctions").then(({ showToast }) => {
        showToast(
          "Store not found. Please refresh the page and try again.",
          "error"
        );
      });
      return;
    }

    setDeactivatingStoreId(storeId);
    setDeactivatingStoreName(store?.name || "this store");
    openDeactivateModal();
  };

  const confirmDeactivateStore = async () => {
    if (!deactivatingStoreId) return;

    try {
      setDeactivateLoading(true);
      const response = await deactivateVendorStore(deactivatingStoreId);
      console.log("Store deactivated successfully:", response.data);

      // Show success feedback to user
      const { showToast } = await import("../components/utils/helperFunctions");
      showToast(
        `"${deactivatingStoreName}" has been deactivated successfully!`,
        "success"
      );

      closeDeactivateModal();
      // Refresh stores list after deactivating
      if (vendorUuid) {
        await fetchVendorStores(vendorUuid);
      }
    } catch (error: any) {
      console.error("Error deactivating vendor store:", error);

      // Show error feedback to user
      const { showToast } = await import("../components/utils/helperFunctions");

      // Extract error message for user feedback
      let errorMessage = `Failed to deactivate "${deactivatingStoreName}". Please try again.`;
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "error");
    } finally {
      setDeactivateLoading(false);
    }
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

  const fetchCountries = async () => {
    try {
      const response = await getAllCountries();
      console.log("Countries:", response.data);
      setCountries(response.data.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountries([]);
    }
  };

  const fetchStates = async (countryId: string | number) => {
    try {
      const response = await getStatesByCountryId(countryId);
      console.log("States:", response.data);
      setStates(response.data.data || []);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  };

  const fetchCities = async (stateId: string | number) => {
    try {
      const response = await getCitiesByStateId(stateId);
      console.log("Cities:", response.data);
      setCities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  };

  const handleCountryChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const countryId = e.target.value;
    setState((prevState) => ({
      ...prevState,
      country: countryId,
      state: "", // Reset state when country changes
      city: "", // Reset city when country changes
    }));

    // Fetch states for the selected country
    if (countryId) {
      fetchStates(countryId);
    } else {
      setStates([]);
    }
    // Clear cities when country changes
    setCities([]);
  };

  const handleEditCountryChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const countryId = e.target.value;
    setEditState((prevState) => ({
      ...prevState,
      country: countryId,
      state: "", // Reset state when country changes
      city: "", // Reset city when country changes
    }));

    // Fetch states for the selected country
    if (countryId) {
      fetchStates(countryId);
    } else {
      setStates([]);
    }
    // Clear cities when country changes
    setCities([]);
  };

  const handleStateChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const stateId = e.target.value;
    setState((prevState) => ({
      ...prevState,
      state: stateId,
      city: "", // Reset city when state changes
    }));

    // Fetch cities for the selected state
    if (stateId) {
      fetchCities(stateId);
    } else {
      setCities([]);
    }
  };

  const handleEditStateChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const stateId = e.target.value;
    setEditState((prevState) => ({
      ...prevState,
      state: stateId,
      city: "", // Reset city when state changes
    }));

    // Fetch cities for the selected state
    if (stateId) {
      fetchCities(stateId);
    } else {
      setCities([]);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchCountries();
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
            loading={createLoading}
            countries={countries}
            states={states}
            cities={cities}
            onCountryChange={handleCountryChange}
            onStateChange={handleStateChange}
          />
        </div>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={closeEditModal}>
        <div className="text-black">
          <EditStore
            handleSubmit={onUpdateVendorStore}
            state={editState}
            onChange={onEditChange}
            onClose={closeEditModal}
            loading={editLoading}
            countries={countries}
            states={states}
            cities={cities}
            onCountryChange={handleEditCountryChange}
            onStateChange={handleEditStateChange}
          />
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={isDeactivateOpen}
        onClose={closeDeactivateModal}
        onConfirm={confirmDeactivateStore}
        title="Deactivate Store"
        message={`Are you sure you want to deactivate "${deactivatingStoreName}"? This action will make the store unavailable to customers.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        loading={deactivateLoading}
        type="danger"
      />

      <Wrapper title="My Stores">
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
                                .map((member, index: number) => (
                                  <div
                                    key={member.id || index}
                                    className="relative"
                                    style={{
                                      marginLeft: index > 0 ? "-8px" : "0",
                                      zIndex:
                                        (store.members?.length || 0) - index,
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
                      onEdit={() =>
                        handleEditStore(store.id || store.uuid || "")
                      }
                      onAddMember={() =>
                        handleAddMember(store.id || store.uuid || "")
                      }
                      onDeactivate={() =>
                        handleDeactivateStore(store.id || store.uuid || "")
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
