import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import Input from "../../common/Input";
import Select from "../../common/Select";
import Button from "../../common/Button";
import ReactSelect from "react-select";

interface EditStoreProps {
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

const EditStore: React.FC<EditStoreProps> = ({
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
            <div className="h-32 rounded-lg bg-[#F6F6F6] flex items-center justify-center bg-[url('/icons/storeIcon.svg')] bg-cover bg-center"></div>
            <div className="p-8">
              <p className="font-semibold text-[#271303] text-xl mt-2">
                Edit store details
              </p>
              <p className="text-[#7F7F7F] text-sm my-2">
                Update your store information to keep your customers informed.
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
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
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
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  primary
                  onClick={() => setStep(1)}
                  disabled={loading || !canProceedToNext()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        ) : step === 1 ? (
          <div>
            <div className="h-32 rounded-lg bg-[#F6F6F6] flex items-center justify-center bg-[url('/icons/locationIcon.svg')] bg-cover bg-center"></div>
            <div className="p-8">
              <p className="font-semibold text-[#271303] text-xl mt-2">
                Store&apos;s location
              </p>
              <p className="text-[#7F7F7F] text-sm my-2">
                Update your store&apos;s address information
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
                  isDisabled={loading}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

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
                  isDisabled={loading || !country}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

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
                  isDisabled={loading || !stateValue}
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
              <Input
                label="LGA"
                type="text"
                name="lga"
                id="lga"
                value={lga}
                onChange={onChange}
                placeholder="Enter Local Government Area"
                className="border-gray-300 rounded w-100 mb-3"
                required
              />
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
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  primary
                  onClick={() => {
                    handleSubmit();
                    setStep(2);
                  }}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Store"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="h-32 rounded-lg bg-[#F6F6F6] flex items-center justify-center bg-[url('/icons/successIcon.svg')] bg-cover bg-center"></div>
            <div className="p-8">
              <p className="font-semibold text-[#271303] text-xl mt-2">
                Your store has been updated successfully!
              </p>
              <p className="text-[#7F7F7F] text-sm my-2">
                Your store information has been updated and is now live.
              </p>

              <div className="flex items-center justify-center gap-8">
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

export default EditStore;
