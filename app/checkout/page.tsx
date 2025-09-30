"use client";

import React, { useState } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { FaArrowLeft, FaCheck, FaMapMarkerAlt, FaUser, FaCreditCard, FaEye, FaUniversity, FaMobile, FaShieldAlt, FaTimes, FaReceipt, FaBox, FaCheckCircle, FaEnvelope, FaFileAlt, FaTruck } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

// Animation variants for subtle form interactions
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

  // Selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'bank' | 'mobile' | null>(null);

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
    deliveryInstructions: "",
    // Payment fields
    cardNumber: "",
    cardExpiry: "",
    cardCvv: ""
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

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    if (selectedPaymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      }
      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = "Expiry date is required";
      }
      if (!formData.cardCvv.trim()) {
        newErrors.cardCvv = "CVV is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    if (currentStep === 2 && !validateStep2()) {
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

  const renderStep4 = () => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 py-8"
    >
      {/* Success Animation */}
      <motion.div 
        className="flex flex-col items-center text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          >
            <FaCheckCircle className="text-green-600 text-4xl" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 max-w-md">
          Thank you for your order. We've received your order and will begin processing it right away.
        </p>
      </motion.div>

      {/* Order Information */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-50 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#3c4948]/10 flex items-center justify-center">
            <FaFileAlt className="text-[#3c4948] text-xl" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Order #BRG-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</h3>
            <p className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <FaEnvelope className="text-[#3c4948]" />
              Order Confirmation
            </h4>
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to {formData.email}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <FaTruck className="text-[#3c4948]" />
              Estimated Delivery
            </h4>
            <p className="text-sm text-gray-600">
              {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Delivery Details */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-50 rounded-xl p-6 space-y-4"
      >
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <FaMapMarkerAlt className="text-[#3c4948]" />
          Delivery Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Delivery Address</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{formData.firstName} {formData.lastName}</p>
              <p>{formData.address}</p>
              <p>{formData.city}, {formData.state} {formData.postalCode}</p>
              <p>{formData.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h4>
            <div className="text-sm text-gray-600">
              {selectedPaymentMethod === 'card' && (
                <p>Credit Card ending in {formData.cardNumber.slice(-4)}</p>
              )}
              {selectedPaymentMethod === 'bank' && (
                <p>Bank Transfer</p>
              )}
              {selectedPaymentMethod === 'mobile' && (
                <p>Mobile Money</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <Link href="/cart" className="flex-1">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="button"
              style="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-[#3c4948] hover:bg-[#3c4948] hover:text-white hover:border-[#3c4948] hover:shadow-lg transition-all duration-300 ease-out font-medium shadow-sm"
            >
              <FaReceipt className="text-base" />
              Back to Cart
            </Button>
          </motion.div>
        </Link>
        <Link href="/all" className="flex-1">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="button"
              style="w-full flex items-center justify-center gap-2"
              primary
            >
              <FaBox className="text-base" />
              Browse More Stores
            </Button>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaReceipt className="text-[#3c4948]" />
          Review Order
        </h2>
        <p className="text-gray-600 mb-6">
          Please review your order details before confirming.
        </p>
      </div>

      {/* Customer Information */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-50 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FaUser className="text-[#3c4948] text-base" />
            Customer Details
          </h3>
          <motion.button
            className="text-[#3c4948] text-sm font-medium hover:text-[#2a3a39] flex items-center gap-1"
            onClick={() => setCurrentStep(1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaEye className="text-base" />
            Edit
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium text-gray-900">{formData.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <p className="font-medium text-gray-900">{formData.phone}</p>
          </div>
        </div>
      </motion.div>

      {/* Delivery Address */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-50 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#3c4948] text-base" />
            Delivery Address
          </h3>
          <motion.button
            className="text-[#3c4948] text-sm font-medium hover:text-[#2a3a39] flex items-center gap-1"
            onClick={() => setCurrentStep(1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaEye className="text-base" />
            Edit
          </motion.button>
        </div>
        
        <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-900">{formData.address}</p>
          <p className="text-gray-600">{formData.city}, {formData.state} {formData.postalCode}</p>
          {formData.deliveryInstructions && (
            <p className="text-gray-600 italic">Note: {formData.deliveryInstructions}</p>
          )}
        </div>
      </motion.div>

      {/* Payment Method */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-50 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FaCreditCard className="text-[#3c4948] text-base" />
            Payment Method
          </h3>
          <motion.button
            className="text-[#3c4948] text-sm font-medium hover:text-[#2a3a39] flex items-center gap-1"
            onClick={() => setCurrentStep(2)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaEye className="text-base" />
            Edit
          </motion.button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#3c4948]/10 flex items-center justify-center">
            {selectedPaymentMethod === 'card' && <FaCreditCard className="text-[#3c4948] text-xl" />}
            {selectedPaymentMethod === 'bank' && <FaUniversity className="text-[#3c4948] text-xl" />}
            {selectedPaymentMethod === 'mobile' && <FaMobile className="text-[#3c4948] text-xl" />}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {selectedPaymentMethod === 'card' && 'Credit/Debit Card'}
              {selectedPaymentMethod === 'bank' && 'Bank Transfer'}
              {selectedPaymentMethod === 'mobile' && 'Mobile Money'}
            </p>
            {selectedPaymentMethod === 'card' && (
              <p className="text-sm text-gray-600">
                Card ending in {formData.cardNumber.slice(-4)}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Order Items */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-50 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FaBox className="text-[#3c4948] text-base" />
            Order Items
          </h3>
          <motion.button
            className="text-[#3c4948] text-sm font-medium hover:text-[#2a3a39] flex items-center gap-1"
            onClick={handleBackToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaEye className="text-base" />
            Edit Cart
          </motion.button>
        </div>
        
        <div className="space-y-4">
          {cart.stores.map((store) => (
            <div key={store.storeId} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <h4 className="font-medium text-gray-900 mb-2">{store.storeName}</h4>
              <div className="space-y-2">
                {store.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{item.name}</span>
                      <span className="text-gray-600">× {item.quantity}</span>
                    </div>
                    <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="p-1">
            <FaShieldAlt className="text-blue-600 text-lg" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Order Confirmation</h4>
            <p className="text-sm text-blue-700 mt-1">
              By clicking "Place Order", you agree to our terms and conditions. Your order will be processed securely.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaCreditCard className="text-[#3c4948]" />
          Payment Method
        </h2>
        <p className="text-gray-600 mb-6">
          Choose your preferred payment method to complete your order.
        </p>
      </div>

      <div className="space-y-4">
        {/* Payment Method Selection */}
        <motion.div 
          className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
            selectedPaymentMethod === 'card' 
              ? 'border-[#3c4948] bg-[#3c4948]/5' 
              : 'border-gray-200 hover:border-[#3c4948] hover:bg-gray-50'
          }`}
          onClick={() => setSelectedPaymentMethod('card')}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3c4948]/10 flex items-center justify-center">
              <FaCreditCard className="text-[#3c4948] text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Credit/Debit Card</h3>
              <p className="text-sm text-gray-600">Pay securely with your card</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedPaymentMethod === 'card' ? 'border-[#3c4948]' : 'border-gray-300'
            }`}>
              {selectedPaymentMethod === 'card' && (
                <motion.div
                  className="w-3 h-3 rounded-full bg-[#3c4948]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
          </div>

          {selectedPaymentMethod === 'card' && (
            <motion.div 
              className="mt-4 space-y-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Input
                label="Card Number"
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className="border-gray-300 rounded-lg"
                error={errors.cardNumber}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="border-gray-300 rounded-lg"
                  error={errors.cardExpiry}
                />
                <Input
                  label="CVV"
                  type="text"
                  name="cardCvv"
                  value={formData.cardCvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="border-gray-300 rounded-lg"
                  error={errors.cardCvv}
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
            selectedPaymentMethod === 'bank' 
              ? 'border-[#3c4948] bg-[#3c4948]/5' 
              : 'border-gray-200 hover:border-[#3c4948] hover:bg-gray-50'
          }`}
          onClick={() => setSelectedPaymentMethod('bank')}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3c4948]/10 flex items-center justify-center">
              <FaUniversity className="text-[#3c4948] text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Bank Transfer</h3>
              <p className="text-sm text-gray-600">Pay directly from your bank account</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedPaymentMethod === 'bank' ? 'border-[#3c4948]' : 'border-gray-300'
            }`}>
              {selectedPaymentMethod === 'bank' && (
                <motion.div
                  className="w-3 h-3 rounded-full bg-[#3c4948]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
            selectedPaymentMethod === 'mobile' 
              ? 'border-[#3c4948] bg-[#3c4948]/5' 
              : 'border-gray-200 hover:border-[#3c4948] hover:bg-gray-50'
          }`}
          onClick={() => setSelectedPaymentMethod('mobile')}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3c4948]/10 flex items-center justify-center">
              <FaMobile className="text-[#3c4948] text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Mobile Money</h3>
              <p className="text-sm text-gray-600">Pay using your mobile wallet</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedPaymentMethod === 'mobile' ? 'border-[#3c4948]' : 'border-gray-300'
            }`}>
              {selectedPaymentMethod === 'mobile' && (
                <motion.div
                  className="w-3 h-3 rounded-full bg-[#3c4948]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="p-1">
            <FaShieldAlt className="text-blue-600 text-lg" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Secure Payment</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your payment information is encrypted and securely processed. We never store your full card details.
            </p>
          </div>
        </div>
      </div>
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
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
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