"use client"

import React, { useState } from 'react'
import Wrapper from '../components/wrapper/Wrapper';
import Button from '../components/common/Button';
import { FaPlus } from 'react-icons/fa';
import Modal from '../components/common/Modal';
import CreateStore from '../components/store/forms/CreateStore';

const VendorStore = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className='text-black'>
            <CreateStore />
        </div>
      </Modal>
      <Wrapper>
        <div className="block">
          <p className="mb-2 font-semibold text-lg">My stores</p>
          <div className="border-2 border-[#EEEEEE] h-28 flex items-center justify-end rounded-lg p-4 shadow">
            <div className="w-fit">
              <Button type="button" primary style="w-fit" onClick={openModal}>
                Create Store
                <FaPlus />
              </Button>
            </div>
          </div>
        </div>
        <div className="block mt-10">
          <p className="mb-2 font-semibold text-lg">Member stores</p>
          <div className="border-2 border-[#EEEEEE] h-28 flex items-center justify-end rounded-lg p-4 shadow"></div>
        </div>
      </Wrapper>
    </>
  );
}

export default VendorStore;