"use client";

import React, { useState } from "react";
import { BiPowerOff } from "react-icons/bi";
import { showToast } from "../utils/helperFunctions";
import { logoutApi } from "@/app/services/AuthService";
import Modal from "../common/Modal";
import Preloader from "../common/Preloader";

const SignoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    try {
      const res = await logoutApi();
      setIsLoading(false);
      setShowLogoutModal(false);
      showToast(res.data.message || "Signed out successfully", "success");
    } catch (err: any) {
      setIsLoading(false);
      if (err.response) {
        showToast(err.response.data.message || "An error occurred", "error");
      } else {
        showToast("Network error or timeout", "error");
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center flex items-center gap-2 my-5">
          <Preloader height={30} />
          {/* <span className="text-lighterArmy font-medium">Loading...</span> */}
        </div>
      ) : (
        <div
          className="text-center flex items-center gap-2 my-5 cursor-pointer text-lighterArmy hover:text-white group"
          onClick={() => setShowLogoutModal(true)}
        >
          <BiPowerOff
            size={22}
            className="opacity-60 group-hover:opacity-100"
          />
          <p className="font-medium">Signout</p>
        </div>
      )}

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        closeIcon
      >
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Confirm Signout</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to sign out?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Signout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SignoutButton;
