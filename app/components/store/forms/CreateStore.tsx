import React, { ChangeEvent, FormEvent, useState } from "react";
import ReactSelect from "react-select";
import Button from "../../common/Button";
import Input from "../../common/Input";
import TextArea from "../../common/TextArea";
import type { City, Country, State, StoreFormData } from "../../../types";

interface CreateStoreProps {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCancel: () => void;
  state: StoreFormData;
  loading?: boolean;
  countries?: Country[];
  states?: State[];
  cities?: City[];
  onCountryChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onStateChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const CreateStore: React.FC<CreateStoreProps> = ({
  handleSubmit,
  onChange,
  onCancel,
  state,
  loading = false,
  countries = [],
  states = [],
  cities = [],
  onCountryChange,
  onStateChange,
}) => {
  const [emailError, setEmailError] = useState("");
  const {
    name,
    description,
    phoneNumber,
    email,
    website,
    country,
    street,
    city,
    state: stateValue,
    landmark,
  } = state;

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onChange(event);
    setEmailError(
      value && !validateEmail(value) ? "Please enter a valid email address" : ""
    );
  };

  const handleLocationChange = (
    name: "country" | "state" | "city",
    value: string
  ) => {
    const event = {
      target: { name, value },
    } as ChangeEvent<HTMLInputElement>;

    if (name === "country") onCountryChange(event);
    else if (name === "state") onStateChange(event);
    else onChange(event);
  };

  const isComplete = Boolean(
    name.trim() &&
      description.trim() &&
      phoneNumber.trim() &&
      validateEmail(email) &&
      country &&
      stateValue &&
      city &&
      street.trim()
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section aria-labelledby="store-details-heading" className="space-y-5">
        <div>
          <h2 id="store-details-heading" className="text-lg font-semibold text-gray-950">
            Store details
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add the information customers will use to identify and contact your store.
          </p>
        </div>

        <Input
          label="Store name"
          helperText="This will be displayed as the name of your store."
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Enter store name"
          autoComplete="organization"
          required
        />

        <TextArea
          label="Description"
          helperText="Briefly describe what your store sells."
          name="description"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Describe your store"
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Phone number"
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            value={phoneNumber}
            onChange={onChange}
            placeholder="Enter phone number"
            autoComplete="tel"
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email address"
            autoComplete="email"
            error={emailError}
            required
          />
        </div>

        <Input
          label="Website (optional)"
          type="url"
          name="website"
          id="website"
          value={website}
          onChange={onChange}
          placeholder="https://example.com"
          autoComplete="url"
        />
      </section>

      <section
        aria-labelledby="store-location-heading"
        className="space-y-5 border-t border-gray-200 pt-8"
      >
        <div>
          <h2 id="store-location-heading" className="text-lg font-semibold text-gray-950">
            Store location
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter the physical address customers should associate with this store.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-base font-semibold text-black3" htmlFor="country">
            Country
          </label>
          <ReactSelect
            inputId="country"
            name="country"
            value={
              country
                ? {
                    value: country,
                    label: countries.find((item) => item.id.toString() === country)?.name,
                  }
                : null
            }
            onChange={(option) => handleLocationChange("country", option?.value || "")}
            options={countries.map((item) => ({
              value: item.id.toString(),
              label: item.name,
            }))}
            placeholder="Select a country"
            isSearchable
            isClearable
            classNamePrefix="react-select"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-base font-semibold text-black3" htmlFor="state">
              State
            </label>
            <ReactSelect
              inputId="state"
              name="state"
              value={
                stateValue
                  ? {
                      value: stateValue,
                      label: states.find((item) => item.id.toString() === stateValue)?.name,
                    }
                  : null
              }
              onChange={(option) => handleLocationChange("state", option?.value || "")}
              options={states.map((item) => ({
                value: item.id.toString(),
                label: item.name,
              }))}
              placeholder="Select a state"
              isSearchable
              isClearable
              isDisabled={!country}
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-semibold text-black3" htmlFor="city">
              City
            </label>
            <ReactSelect
              inputId="city"
              name="city"
              value={
                city
                  ? {
                      value: city,
                      label: cities.find((item) => item.id.toString() === city)?.name,
                    }
                  : null
              }
              onChange={(option) => handleLocationChange("city", option?.value || "")}
              options={cities.map((item) => ({
                value: item.id.toString(),
                label: item.name,
              }))}
              placeholder="Select a city"
              isSearchable
              isClearable
              isDisabled={!stateValue}
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <Input
          label="Street address"
          type="text"
          name="street"
          id="street"
          value={street}
          onChange={onChange}
          placeholder="Enter street address"
          autoComplete="street-address"
          required
        />

        <Input
          label="Landmark (optional)"
          type="text"
          name="landmark"
          id="landmark"
          value={landmark}
          onChange={onChange}
          placeholder="Enter a nearby landmark"
        />
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
        <Button type="button" secondary style="!my-0" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          primary
          style="!my-0"
          disabled={!isComplete || loading}
          isLoading={loading}
        >
          Create Store
        </Button>
      </div>
    </form>
  );
};

export default CreateStore;
