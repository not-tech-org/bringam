"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import CreateStore from "@/app/components/store/forms/CreateStore";
import Wrapper from "@/app/components/wrapper/Wrapper";
import { showToast } from "@/app/components/utils/helperFunctions";
import { getServerMessage } from "@/app/lib/apiFeedback";
import {
  createVendorStore,
  getAllCountries,
  getCitiesByStateId,
  getStatesByCountryId,
  getUserProfile,
} from "@/app/services/AuthService";
import type { City, Country, State, StoreFormData } from "@/app/types";

const initialState: StoreFormData = {
  name: "",
  description: "",
  phoneNumber: "",
  email: "",
  website: "",
  country: "",
  street: "",
  city: "",
  lga: "",
  state: "",
  landmark: "",
  profilePhotoUrl: "",
  coverPhotoUrl: "",
  active: true,
};

export default function CreateStorePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<StoreFormData>(initialState);
  const [vendorUuid, setVendorUuid] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFormData = async () => {
      const [profileResult, countriesResult] = await Promise.allSettled([
        getUserProfile(),
        getAllCountries(),
      ]);

      if (profileResult.status === "fulfilled") {
        setVendorUuid(profileResult.value.data?.data?.vendorResp?.uuid || "");
      } else {
        showToast(
          getServerMessage(profileResult.reason, "Could not load your vendor profile."),
          "error"
        );
      }

      if (countriesResult.status === "fulfilled") {
        setCountries(countriesResult.value.data?.data || []);
      } else {
        showToast(
          getServerMessage(countriesResult.reason, "Could not load countries."),
          "error"
        );
      }
    };

    loadFormData();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleCountryChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const country = event.target.value;
    setFormData((current) => ({ ...current, country, state: "", city: "" }));
    setStates([]);
    setCities([]);

    if (!country) return;

    try {
      const response = await getStatesByCountryId(country);
      setStates(response.data?.data || []);
    } catch (error) {
      showToast(getServerMessage(error, "Could not load states."), "error");
    }
  };

  const handleStateChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const state = event.target.value;
    setFormData((current) => ({ ...current, state, city: "" }));
    setCities([]);

    if (!state) return;

    try {
      const response = await getCitiesByStateId(state);
      setCities(response.data?.data || []);
    } catch (error) {
      showToast(getServerMessage(error, "Could not load cities."), "error");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!vendorUuid) {
      showToast("We could not find a vendor profile for this account.", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await createVendorStore({
        vendorUuid,
        name: formData.name,
        description: formData.description,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        website: formData.website,
        address: {
          city: Number(formData.city),
          country: Number(formData.country),
          landmark: formData.landmark,
          lga: formData.lga,
          state: Number(formData.state),
          street: formData.street,
          longitude: 0,
          latitude: 0,
        },
        profilePhotoUrl: "",
        coverPhotoUrl: "",
        active: true,
      });

      showToast(response.data?.message || "Store created successfully!", "success");
      router.push("/vendor-store");
    } catch (error) {
      showToast(getServerMessage(error, "Failed to create store. Please try again."), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper title="Create Store">
      <div className="max-w-3xl pb-10 pt-2 md:pt-4">
        <button
          type="button"
          onClick={() => router.push("/vendor-store")}
          className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <MdArrowBack aria-hidden="true" className="text-lg" />
          Back to stores
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-950">Create a new store</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Add your store details and location. You can update them later.
          </p>
        </div>

        <CreateStore
          handleSubmit={handleSubmit}
          state={formData}
          onChange={handleChange}
          onCancel={() => router.push("/vendor-store")}
          loading={loading}
          countries={countries}
          states={states}
          cities={cities}
          onCountryChange={handleCountryChange}
          onStateChange={handleStateChange}
        />
      </div>
    </Wrapper>
  );
}
