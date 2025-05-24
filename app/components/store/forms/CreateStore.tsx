import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import Input from "../../common/Input";
import Select from "../../common/Select";
import Button from "../../common/Button";

interface CreateStoreProps {
  handleSubmit: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  state: any;
}
const CreateStore: React.FC<CreateStoreProps> = ({
  handleSubmit,
  onChange,
  onClose,
  state,
}) => {
  const [step, setStep] = useState(0);

  const {
    name,
    description,
    category,
    phoneNumber,
    email,
    website,
    street,
    lga,
    city,
    state: stateValue,
    landmark,
  } = state;

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
                onChange={onChange}
                placeholder="Enter your store's email"
                className="border-gray-300 rounded w-100 mb-3"
                required
              />
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
                  options={[]}
                  onChange={() => console.log()}
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
                <Button type="button" primary onClick={() => setStep(1)}>
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
                label="City"
                type="text"
                name="city"
                id="city"
                value={city}
                onChange={onChange}
                placeholder="Enter city"
                className="border-gray-300 rounded w-100 mb-3"
                required
              />
              {/* Note: City value will be converted to city ID when submitting to API */}
              <Input
                label="State"
                type="text"
                name="state"
                id="state"
                value={stateValue}
                onChange={onChange}
                placeholder="Enter state"
                className="border-gray-300 rounded w-100 mb-3"
                required
              />
              {/* Note: State value will be converted to state ID when submitting to API */}
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
                <Button
                  type="button"
                  primary
                  onClick={() => {
                    handleSubmit();
                    setStep(2);
                  }}
                >
                  Submit
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
