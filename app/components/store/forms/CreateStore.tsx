import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import Input from "../../common/Input";
import Select from "../../common/Select";
import Button from "../../common/Button";
import ReactSelect from "react-select";

interface CreateStoreProps {
  handleSubmit: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  state: any;
  loading?: boolean;
  countries?: any[];
  states?: any[];
  cities?: any[];
  onCountryChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onStateChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const CreateStore: React.FC<CreateStoreProps> = ({
  handleSubmit,
  onChange,
  onClose,
  state,
  loading = false,
  countries = [],
  states = [],
  cities = [],
  onCountryChange,
  onStateChange,
}) => {
  const [step, setStep] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    name,
    description,
    category,
    phoneNumber,
    email,
    website,
    country,
    street,
    lga,
    city,
    state: stateValue,
    landmark,
  } = state;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    onChange(e);

    if (emailValue && !validateEmail(emailValue)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const canProceedToNext = () => {
    return (
      name &&
      description &&
      phoneNumber &&
      email &&
      validateEmail(email) &&
      category
    );
  };

  const handleCreateStore = async () => {
    setIsSubmitting(true);
    try {
      await handleSubmit();
      setStep(3); // Move to success step after successful submission
    } catch (error) {
      console.error("Error creating store:", error);
      // Stay on confirmation step if there's an error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const syntheticEvent = {
      target: {
        name: e.target.name,
        value: e.target.value,
      },
    } as ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {step === 0 ? (
          <div>
            <div className="h-32 rounded-lg bg-[#F6F6F6] flex items-center justify-center bg-[url('/icons/storeIcon.svg')] bg-cover bg-center">
              {/* <Image
              src="/icons/storeIcon.svg"
              alt="Store icon"
              width={50}
              height={50}
            /> */}
            </div>
            <div className="p-8">
              <p className="font-semibold text-[#271303] text-xl mt-2">
                Create new store
              </p>
              <p className="text-[#7F7F7F] text-sm my-2">
                Reach customers on the go. Your store will be optimized for
                mobile, ensuring a seamless experience for users on all devices.
              </p>
              <Input
                label="Store name"
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={onChange}
                placeholder="What is the name of your store?"
                className="border-gray-300 rounded w-100 mb-3"
                required
              />
              <Input
                label="Description"
                type="text"
                name="description"
                id="description"
                value={description}
                onChange={onChange}
                placeholder="Describe your store"
                className="border-gray-300 rounded w-100 mb-3"
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={phoneNumber}
                onChange={onChange}
                placeholder="Enter your store's phone number"
                className="border-gray-300 rounded w-100 mb-3"
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your store's email"
                className="border-gray-300 rounded w-100 mb-3"
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mb-1">{emailError}</p>
              )}
              <Input
                label="Website (Optional)"
                type="url"
                name="website"
                id="website"
                value={website}
                onChange={onChange}
                placeholder="Enter your store's website"
                className="border-gray-300 rounded w-100 mb-3"
              />
              <div>
                <Select
                  label="Category"
                  name="category"
                  value={category}
                  options={[
                    { value: "electronics", label: "Electronics" },
                    { value: "fashion", label: "Fashion & Clothing" },
                    { value: "food", label: "Food & Beverages" },
                    { value: "health", label: "Health & Beauty" },
                    { value: "home", label: "Home & Garden" },
                    { value: "sports", label: "Sports & Fitness" },
                    { value: "books", label: "Books & Media" },
                    { value: "automotive", label: "Automotive" },
                    { value: "toys", label: "Toys & Games" },
                    { value: "jewelry", label: "Jewelry & Accessories" },
                    { value: "pets", label: "Pet Supplies" },
                    { value: "office", label: "Office & Business" },
                    { value: "crafts", label: "Arts & Crafts" },
                    { value: "services", label: "Services" },
                    { value: "other", label: "Other" },
                  ]}
                  onChange={handleSelectChange}
                  required
                  placeholder="Select a category"
                />
              </div>
              <div className="flex items-center justify-between gap-8">
                <Button
                  type="button"
                  secondary
                  style="border-2"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  primary
                  onClick={() => setStep(1)}
                  disabled={!canProceedToNext()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        ) : step === 1 ? (
          <div>
            <div className="h-32 rounded-lg bg-[#F6F6F6] flex items-center justify-center bg-[url('/icons/locationIcon.svg')] bg-cover bg-center">
              {/* <Image
              src="/icons/testLocationIcon.svg"
              alt="Store icon"
              width={50}
              height={50}
            /> */}
            </div>
            <div className="p-8">
              <p className="font-semibold text-[#271303] text-xl mt-2">
                Store&apos;s location
              </p>
              <p className="text-[#7F7F7F] text-sm my-2">
                Please enter your store&apos;s address
              </p>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <ReactSelect
                  name="country"
                  value={
                    countries.find((c) => c.id.toString() === country)
                      ? {
                          value: country,
                          label: countries.find(
                            (c) => c.id.toString() === country
                          )?.name,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    const syntheticEvent = {
                      target: {
                        name: "country",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    } as ChangeEvent<HTMLInputElement>;
                    if (onCountryChange) {
                      onCountryChange(syntheticEvent);
                    }
                  }}
                  options={countries.map((countryItem) => ({
                    value: countryItem.id.toString(),
                    label: countryItem.name,
                  }))}
                  placeholder="Select a country"
                  isSearchable
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              <Input
                label="Street"
                type="text"
                name="street"
                id="street"
                value={street}
                onChange={onChange}
                placeholder="Enter street address"
                className="border-gray-300 rounded w-100 mb-3"
                required
              />
              {/* <Input
                label="LGA"
                type="text"
                name="lga"
                id="lga"
                value={lga}
                onChange={onChange}
                placeholder="Enter Local Government Area"
                className="border-gray-300 rounded w-100 mb-3"
                required
              /> */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <ReactSelect
                  name="state"
                  value={
                    states.find((s) => s.id.toString() === stateValue)
                      ? {
                          value: stateValue,
                          label: states.find(
                            (s) => s.id.toString() === stateValue
                          )?.name,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    const syntheticEvent = {
                      target: {
                        name: "state",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    } as ChangeEvent<HTMLInputElement>;
                    if (onStateChange) {
                      onStateChange(syntheticEvent);
                    }
                  }}
                  options={states.map((stateItem) => ({
                    value: stateItem.id.toString(),
                    label: stateItem.name,
                  }))}
                  placeholder="Select a state"
                  isSearchable
                  isClearable
                  isDisabled={!country}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              {/* Note: State value will be converted to state ID when submitting to API */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <ReactSelect
                  name="city"
                  value={
                    cities.find((c) => c.id.toString() === city)
                      ? {
                          value: city,
                          label: cities.find((c) => c.id.toString() === city)
                            ?.name,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    const syntheticEvent = {
                      target: {
                        name: "city",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    } as ChangeEvent<HTMLInputElement>;
                    onChange(syntheticEvent);
                  }}
                  options={cities.map((cityItem) => ({
                    value: cityItem.id.toString(),
                    label: cityItem.name,
                  }))}
                  placeholder="Select a city"
                  isSearchable
                  isClearable
                  isDisabled={!stateValue}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              {/* Note: City value will be converted to city ID when submitting to API */}
              <Input
                label="Landmark (Optional)"
                type="text"
                name="landmark"
                id="landmark"
                value={landmark}
                onChange={onChange}
                placeholder="Enter nearby landmark"
                className="border-gray-300 rounded w-100 mb-3"
              />
              <div className="flex items-center justify-between gap-8">
                <Button
                  type="button"
                  secondary
                  style="border-2"
                  onClick={() => setStep(0)}
                >
                  Back
                </Button>
                <Button type="button" primary onClick={() => setStep(2)}>
                  Review & Submit
                </Button>
              </div>
            </div>
          </div>
        ) : step === 2 ? (
          <div>
            <div className="h-32 rounded-lg bg-[#F6F6F6] flex items-center justify-center bg-[url('/icons/confirmIcon.svg')] bg-cover bg-center">
              {/* Confirmation step */}
            </div>
            <div className="p-8">
              <p className="font-semibold text-[#271303] text-xl mt-2">
                Confirm Store Details
              </p>
              <p className="text-[#7F7F7F] text-sm my-2">
                Please review your store information before creating your store.
              </p>

              {/* Store Details Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Store Name
                    </p>
                    <p className="text-sm text-gray-900">
                      {name || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Phone Number
                    </p>
                    <p className="text-sm text-gray-900">
                      {phoneNumber || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-sm text-gray-900">
                      {email || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Website</p>
                    <p className="text-sm text-gray-900">
                      {website || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Description
                  </p>
                  <p className="text-sm text-gray-900">
                    {description || "Not specified"}
                  </p>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Location
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Country</p>
                      <p className="text-sm text-gray-900">
                        {countries.find((c) => c.id.toString() === country)
                          ?.name || "Not selected"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">State</p>
                      <p className="text-sm text-gray-900">
                        {states.find((s) => s.id.toString() === stateValue)
                          ?.name || "Not selected"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">City</p>
                      <p className="text-sm text-gray-900">
                        {cities.find((c) => c.id.toString() === city)?.name ||
                          "Not selected"}
                      </p>
                    </div>
                    {/* <div>
                      <p className="text-xs text-gray-500">LGA</p>
                      <p className="text-sm text-gray-900">
                        {lga || "Not specified"}
                      </p>
                    </div> */}
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Street Address</p>
                    <p className="text-sm text-gray-900">
                      {street || "Not specified"}
                    </p>
                  </div>
                  {landmark && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Landmark</p>
                      <p className="text-sm text-gray-900">{landmark}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-8">
                <Button
                  type="button"
                  secondary
                  style="border-2"
                  onClick={() => setStep(1)}
                >
                  Back to Edit
                </Button>
                <Button
                  type="button"
                  primary
                  onClick={handleCreateStore}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Store..." : "Create Store"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="h-32 rounded-lg bg-[#F6F6F6] flex items-center justify-center bg-[url('/icons/successIcon.svg')] bg-cover bg-center">
              {/* <Image
              src="/icons/successIcon.svg"
              alt="Success icon"
              width={50}
              height={50}
            /> */}
            </div>
            <div className="p-8">
              <p className="font-semibold text-[#271303] text-xl mt-2">
                Your store has been created successfully!
              </p>
              <p className="text-[#7F7F7F] text-sm my-2">
                You can now start adding products and managing your store.
              </p>

              <div className="flex items-center justify-between gap-8">
                <Button
                  type="button"
                  secondary
                  style="border-2"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button type="button" primary onClick={onClose}>
                  Go to stores
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default CreateStore;
