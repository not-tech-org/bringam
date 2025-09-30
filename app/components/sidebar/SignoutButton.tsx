"use client";

import React, { useState } from "react";
import { BiPowerOff } from "react-icons/bi";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { showToast } from "../utils/helperFunctions";
import { logoutApi } from "@/app/services/AuthService";
import Modal from "../common/Modal";
import Preloader from "../common/Preloader";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants for signout flow
const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

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
        <motion.div
          className="text-center flex items-center gap-2 my-5 cursor-pointer text-lighterArmy hover:text-white group transition-colors duration-200"
          onClick={() => setShowLogoutModal(true)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <BiPowerOff
              size={22}
              className="opacity-60 group-hover:opacity-100 transition-opacity duration-200"
            />
            <p className="font-medium">Signout</p>
          </motion.div>
        </motion.div>
      )}

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      >
        <motion.div
          className="text-center"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-5 border-b border-red-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full shadow-sm border border-red-200">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Confirm Signout</h3>
                  <p className="text-sm text-red-700 font-medium">This action cannot be undone</p>
                </div>
              </div>
              <motion.button
                onClick={() => setShowLogoutModal(false)}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes className="text-red-500 text-lg" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="text-center mb-6">
              <p className="text-gray-700 leading-relaxed text-base">
                Are you sure you want to sign out? You'll need to sign in again to access your account.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-5 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 border border-gray-200 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={logout}
                disabled={isLoading}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <BiPowerOff className="text-base" />
                    <span>Sign out</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Modal>
    </>
  );
};

export default SignoutButton;
