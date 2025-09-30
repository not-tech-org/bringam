"use client";

import React, { useState } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { FaArrowLeft, FaCheck, FaMapMarkerAlt, FaUser, FaCreditCard, FaEye } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

// Animation variants
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

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

const CheckoutPage = () => {
  const { cart, getTotalAmount } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    deliveryInstructions: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const formatPrice = (price: number) => {
    return `N${price.toLocaleString()}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleBackToCart = () => {
    router.push('/cart');
  };

  const renderStep1 = () => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaUser className="text-[#3c4948]" />
          Customer Information
        </h2>
        <p className="text-gray-600 mb-6">
          Please provide your contact information and delivery address.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your@email.com"
          className="border-gray-300 rounded-lg"
          error={errors.email}
        />
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+234 801 234 5678"
          className="border-gray-300 rounded-lg"
          error={errors.phone}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Enter first name"
          className="border-gray-300 rounded-lg"
          error={errors.firstName}
        />
        <Input
          label="Last Name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Enter last name"
          className="border-gray-300 rounded-lg"
          error={errors.lastName}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-[#3c4948]" />
          Delivery Address
        </h3>
      </div>

      <Input
        label="Street Address"
        type="text"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="Enter street address"
        className="border-gray-300 rounded-lg"
        error={errors.address}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="City"
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Enter city"
          className="border-gray-300 rounded-lg"
          error={errors.city}
        />
        <Input
          label="State"
          type="text"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          placeholder="Enter state"
          className="border-gray-300 rounded-lg"
          error={errors.state}
        />
        <Input
          label="Postal Code"
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleInputChange}
          placeholder="Enter postal code"
          className="border-gray-300 rounded-lg"
        />
      </div>

      <Input
        label="Delivery Instructions (Optional)"
        type="text"
        name="deliveryInstructions"
        value={formData.deliveryInstructions}
        onChange={handleInputChange}
        placeholder="Any special delivery instructions..."
        className="border-gray-300 rounded-lg"
      />
    </motion.div>
  );

  const renderOrderSummary = () => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-50 rounded-lg p-6 sticky top-4"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        {cart.stores.map((store) => (
          <div key={store.storeId}>
            <h4 className="font-medium text-gray-900 text-sm">{store.storeName}</h4>
            <div className="ml-2 space-y-1">
              {store.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatPrice(cart.totalAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="text-gray-900">N2,000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">N500</span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
          <span className="text-gray-900">Total</span>
          <span className="text-[#3c4948]">{formatPrice(cart.totalAmount + 2500)}</span>
        </div>
      </div>
    </motion.div>
  );

  if (cart.stores.length === 0) {
    return (
      <Wrapper>
        <motion.div
          className="bg-white min-h-screen flex items-center justify-center"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some items to your cart before checkout.</p>
            <Link href="/all">
              <Button type="button" style="flex items-center gap-2" primary>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <motion.div
        className="bg-white min-h-screen"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="px-4">
          <motion.div variants={itemVariants}>
            <Button
              type="button"
              style="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
              onClick={handleBackToCart}
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <motion.div
                className="bg-[#3c4948] h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span className={currentStep >= 1 ? "text-[#3c4948] font-medium" : ""}>Information</span>
              <span className={currentStep >= 2 ? "text-[#3c4948] font-medium" : ""}>Payment</span>
              <span className={currentStep >= 3 ? "text-[#3c4948] font-medium" : ""}>Review</span>
              <span className={currentStep >= 4 ? "text-[#3c4948] font-medium" : ""}>Confirm</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {currentStep === 1 && renderStep1()}
            </div>
            
            <div className="lg:col-span-1">
              {renderOrderSummary()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-between mt-8 pt-6 border-t border-gray-200"
          >
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button
                type="button"
                style="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                <FaArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            </motion.div>

            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button
                type="button"
                style="flex items-center gap-2"
                primary
                onClick={handleNextStep}
                isLoading={isLoading}
              >
                {currentStep === totalSteps ? "Place Order" : "Continue"}
                <FaCheck className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </Wrapper>
  );
};

export default CheckoutPage;
