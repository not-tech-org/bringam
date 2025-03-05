"use client";

import React, { ChangeEvent, useState } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Button from "../components/common/Button";
import { FaPlus } from "react-icons/fa";
import Modal from "../components/common/Modal";
import CreateStore from "../components/store/forms/CreateStore";
import { createVendorStore } from "../services/AuthService";

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
    } catch (error) {}
  };

  console.log("Store name: ", state);

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
          <div className="flex items-center justify-between">
            <p className="mb-2 font-semibold text-lg">My stores</p>
            <div>
              <Button type="button" primary style="w-fit " onClick={openModal}>
                Create Store
                <FaPlus />
              </Button>
            </div>
          </div>
          <div className="border-2 border-[#EEEEEE] h-28 w-1/4 flex items-center justify-end rounded-lg p-4 shadow"></div>
        </div>
        <div className="block mt-10">
          <p className="mb-2 font-semibold text-lg">Member stores</p>
          <div className="border-2 border-[#EEEEEE] h-28 w-1/4 flex items-center justify-end rounded-lg p-4 shadow"></div>
        </div>
      </Wrapper>
    </>
  );
};

export default VendorStore;
