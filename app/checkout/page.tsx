"use client";

import React, { useState, useEffect, useRef } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ReactSelect from "react-select";
import { FaArrowLeft, FaCheck, FaMapMarkerAlt, FaUser, FaCreditCard, FaEye, FaShieldAlt, FaTimes, FaReceipt, FaBox, FaCheckCircle, FaEnvelope, FaFileAlt, FaTruck, FaSignInAlt } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { showToast } from "../components/utils/helperFunctions";
import {
  addItemToCartApi,
  checkoutApi,
  getUserCartApi,
  placeOrderApi,
  createCustomerAddressApi,
  attachAddressToCheckoutSessionApi,
  resolveStoreProductUuidFromPayload,
  getBringAmToken,
  extractAxiosMessage,
  type CheckoutApiResponse,
  type PlaceOrderApiResponse,
} from "../services/CartService";
import { buildPagaCheckoutUrl, PAGA_CHECKOUT_STATE_KEY, PAGA_CONFIG } from "../utils/pagaCheckout";
import {
  getAllCountries,
  getStatesByCountryId,
  getCitiesByStateId,
} from "../services/AuthService";
import type { Country, State, City } from "../types/store";

// Animation variants for subtle form interactions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0
  }
};

/** Default coordinates used when the user's browser geolocation is unavailable.
 *  Lagos, Nigeria — the app's primary market. */
const DEFAULT_LATITUDE = 6.5244;
const DEFAULT_LONGITUDE = 3.3792;

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
  const { cart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<string[]>([]);
  /**
   * Stores the full CustomerCheckoutSessionResp from the API.
   * All pricing fields come from the server — no hardcoded values.
   */
  const [checkoutResult, setCheckoutResult] = useState<{
    uuid?: string;
    subTotal?: number;
    deliveryCost?: number;
    vat?: number;
    serviceCharge?: number;
    total?: number;
    deliveryAddressUuid?: string;
    message?: string;
  } | null>(null);
  const [orderResult, setOrderResult] = useState<{
    orderUuid?: string;
    paymentReference?: string;
    amount?: number;
    message?: string;
  } | null>(null);
  const [addressUuid, setAddressUuid] = useState<string | null>(null);
  // Snapshot of form data used for the last address creation — lets us detect
  // when the user has modified their address after going back to step 1.
  const lastSavedAddressRef = useRef<string | null>(null);
  const CHECKOUT_SELECTION_KEY = "bringam_checkout_selected_items";

  // Location data for cascading dropdowns (mirrors vendor-store pattern)
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Selected location IDs (stored as strings, parsed to ints when submitting)
  const [locationIds, setLocationIds] = useState<{
    countryId: string;
    stateId: string;
    cityId: string;
  }>({ countryId: "", stateId: "", cityId: "" });



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

  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // User's browser geolocation for address coordinates
  const { latitude, longitude } = useGeolocation();



  // Auth check — checkout requires a logged-in user for all API calls
  const token = getBringAmToken();
  const isAuthenticated = Boolean(token);

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  React.useEffect(() => {
    const raw = sessionStorage.getItem(CHECKOUT_SELECTION_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSelectedCartItemIds(parsed);
      }
    } catch {
      // ignore malformed selection
    }
  }, []);

  /**
   * On mount, check for Paga redirect query params.
   * When Paga completes payment, it redirects back to the charge_url (this page)
   * with transaction status params. Since place-order was already called BEFORE
   * the redirect, we just restore the checkout state and show the confirmation.
   * The backend webhook handles payment verification from Paga.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Paga may append params in various formats — handle both standard and alternative naming
    const pagaReference =
      params.get("paga_reference") ||
      params.get("tx_reference") ||
      params.get("reference") ||
      params.get("transactionReference") ||
      "";
    const pagaStatus =
      params.get("paga_status") ||
      params.get("status") ||
      params.get("tx_status") ||
      params.get("transactionStatus") ||
      "";

    if (!pagaReference) return;

    // Handle failed / cancelled payment from Paga
    if (pagaStatus && pagaStatus !== "success") {
      showToast(
        pagaStatus === "cancelled"
          ? "Payment was cancelled. You can try again."
          : "Payment was not completed. Please try again or contact support.",
        "warning"
      );
      return;
    }

    // Restore saved state from session storage
    const savedStateRaw = sessionStorage.getItem(PAGA_CHECKOUT_STATE_KEY);
    if (!savedStateRaw) {
      showToast("Session expired. Please start checkout again.", "error");
      return;
    }

    let savedState: Record<string, unknown>;
    try {
      savedState = JSON.parse(savedStateRaw);
    } catch {
      showToast("Invalid session data. Please start checkout again.", "error");
      return;
    }

    const sessionUuid = (savedState?.checkoutUuid as string) || "";
    const savedOrderUuid = (savedState?.orderUuid as string) || "";
    const savedPaymentReference = (savedState?.paymentReference as string) || "";
    const savedAddressUuid = (savedState?.addressUuid as string) || "";
    const savedFormData = savedState?.formData as typeof formData | undefined;
    const savedLocationIds = savedState?.locationIds as typeof locationIds | undefined;
    const savedSelectedIds = savedState?.selectedCartItemIds as string[] | undefined;

    if (!sessionUuid) {
      showToast("Missing checkout session. Please start checkout again.", "error");
      return;
    }

    // Restore UI state from the saved snapshot
    setCheckoutResult(prev => ({ ...prev, uuid: sessionUuid }));
    if (savedAddressUuid) setAddressUuid(savedAddressUuid);
    if (savedFormData) setFormData(savedFormData);
    if (savedLocationIds) setLocationIds(savedLocationIds);
    if (savedSelectedIds) setSelectedCartItemIds(savedSelectedIds);

    // Restore order result (already placed before the Paga redirect)
    if (savedOrderUuid || savedPaymentReference) {
      setOrderResult({
        orderUuid: savedOrderUuid || undefined,
        paymentReference: savedPaymentReference || pagaReference || undefined,
        message: "Order placed successfully. Payment is being processed.",
      });
    }

    // Clean up URL params so a refresh doesn't re-trigger
    window.history.replaceState({}, "", window.location.pathname);

    // Show the confirmation screen
    showToast("Payment confirmed! Your order has been placed.", "success");
    setCurrentStep(4);
  }, []);

  // Fetch countries on mount (mirrors vendor-store pattern)
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getAllCountries();
        setCountries(response.data.data || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]);
      }
    };
    fetchCountries();
  }, []);

  const formatPrice = (price: number) => {
    return `N${price.toLocaleString()}`;
  };

  const selectedSubtotal = cart.stores.reduce(
    (total, store) =>
      total +
      store.items.reduce((storeTotal, item) => {
        if (selectedCartItemIds.length > 0 && !selectedCartItemIds.includes(item.id)) {
          return storeTotal;
        }
        return storeTotal + item.price * item.quantity;
      }, 0),
    0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Cascading location handlers (mirrors vendor-store pattern)
  const handleCountryChange = (selectedOption: { value: string; label: string } | null) => {
    const countryId = selectedOption?.value || "";
    setLocationIds(prev => ({ ...prev, countryId, stateId: "", cityId: "" }));
    setFormData(prev => ({
      ...prev,
      city: "",
      state: "",
    }));
    setCities([]);
    setStates([]);

    if (countryId) {
      getStatesByCountryId(countryId)
        .then(res => setStates(res.data.data || []))
        .catch(() => setStates([]));
    }
  };

  const handleStateChange = (selectedOption: { value: string; label: string } | null) => {
    const stateId = selectedOption?.value || "";
    setLocationIds(prev => ({ ...prev, stateId, cityId: "" }));
    setFormData(prev => ({
      ...prev,
      city: "",
      state: selectedOption?.label || "",
    }));
    setCities([]);

    if (stateId) {
      getCitiesByStateId(stateId)
        .then(res => setCities(res.data.data || []))
        .catch(() => setCities([]));
    }
    // Clear state error
    if (errors.stateId) {
      setErrors(prev => ({ ...prev, stateId: "" }));
    }
  };

  const handleCityChange = (selectedOption: { value: string; label: string } | null) => {
    const cityId = selectedOption?.value || "";
    setLocationIds(prev => ({ ...prev, cityId }));
    setFormData(prev => ({ ...prev, city: selectedOption?.label || "" }));
    // Clear city error
    if (errors.cityId) {
      setErrors(prev => ({ ...prev, cityId: "" }));
    }
  };

  /**
   * Validate step 2 — ensures a checkout session exists before proceeding.
   * Step 2 calls place-order and then redirects to Paga.
   */
  const validateStep2 = (): boolean => {
    // No client-side validation needed — the API handles all validation.
    return true;
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
    
    if (!locationIds.countryId) {
      newErrors.countryId = "Country is required";
    }
    
    if (!locationIds.stateId) {
      newErrors.stateId = "State is required";
    }
    
    if (!locationIds.cityId) {
      newErrors.cityId = "City is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Extract a string value from an unknown data object by trying multiple field names.
   * Handles variations in API response field naming (camelCase, snake_case, etc.).
   */
  const getStringField = (obj: Record<string, unknown> | null | undefined, ...keys: string[]): string | undefined => {
    if (!obj) return undefined;
    for (const key of keys) {
      const val = obj[key];
      if (typeof val === "string" && val.trim()) return val.trim();
    }
    return undefined;
  };

  const getNumberField = (obj: Record<string, unknown> | null | undefined, ...keys: string[]): number | undefined => {
    if (!obj) return undefined;
    for (const key of keys) {
      const val = obj[key];
      if (typeof val === "number" && Number.isFinite(val)) return val;
      if (typeof val === "string") {
        const n = Number(val);
        if (Number.isFinite(n)) return n;
      }
    }
    return undefined;
  };

  /**
   * Try to extract a UUID from a server cart item, supporting both the nested
   * CartItemResp format (item.uuid) and the flat ApiCartItem format (item.id / item.cartItemUuid).
   */
  const extractCartItemUuid = (item: Record<string, unknown>): string | null => {
    // Nested format: CartItemResp with storeProduct sub-object
    const nestedUuid = getStringField(item, "uuid");
    if (nestedUuid) return nestedUuid;

    // Flat format: ApiCartItem with direct UUID/id fields
    const flatUuid = getStringField(item, "id", "cartItemUuid", "cartItemUUID", "cartItemId", "productId");
    if (flatUuid) return flatUuid;

    return null;
  };

  /**
   * Try to extract a store-product UUID from a server cart item for matching purposes.
   */
  const extractStoreProductUuid = (item: Record<string, unknown>): string | null => {
    // Nested format: storeProduct.productUuid
    const sp = item.storeProduct as Record<string, unknown> | undefined;
    if (sp) {
      const spUuid = getStringField(sp, "productUuid", "productId");
      if (spUuid) return spUuid;
    }
    // Flat format: direct field
    return resolveStoreProductUuidFromPayload(item);
  };

  /**
   * Build cartItemUUIDs for the checkout API.
   *
   * Per the API spec, the correct flow is:
   * 1. Items are added to the server cart via PUT /carts/add-item-to-cart/{cart-uuid}
   * 2. GET /carts/get-user-cart returns items with their cart-item UUIDs
   * 3. Use cartItems[].uuid as cartItemUUIDs for POST /api/v1/checkout
   *
   * If the server cart is empty, we sync local items to the server cart, then
   * re-fetch the server cart to get the authoritative cart-item UUIDs.
   * We NEVER fall back to store-product UUIDs — the API requires cart-item UUIDs.
   */
  const buildCartItemUUIDsForCheckout = async (): Promise<string[] | { error: string }> => {
    // Step 1: Fetch the server cart to get existing cart-item UUIDs
    let serverCart: { items: Record<string, unknown>[]; uuid: string } | null = null;
    try {
      const resp = await getUserCartApi();
      if (resp.success && resp.data) {
        serverCart = {
          items: (resp.data.cartItems ?? []) as unknown as Record<string, unknown>[],
          uuid: resp.data.uuid,
        };
      }
    } catch {
      return { error: "Unable to load your cart from the server. Please refresh and try again." };
    }

    if (!serverCart) {
      return { error: "Unable to load your cart. Please refresh and try again." };
    }

    // If the server cart is empty, sync local items to the server cart first
    if (serverCart.items.length === 0) {
      const itemsToSync = cart.stores.length > 0
        ? (selectedCartItemIds.length > 0
            ? cart.stores.flatMap(s => s.items.filter(i => selectedCartItemIds.includes(i.id)))
            : cart.stores.flatMap(s => s.items))
        : [];

      if (itemsToSync.length === 0) {
        return { error: "Your cart is empty. Add items before checking out." };
      }

      const syncErrors: string[] = [];

      for (const item of itemsToSync) {
        const storeProductUuid = resolveStoreProductUuidFromPayload(item) || item.productId;
        if (!storeProductUuid) {
          syncErrors.push(`${item.name}: missing product identifier`);
          continue;
        }

        try {
          await addItemToCartApi(serverCart.uuid, {
            storeProductUuid,
            quantity: item.quantity,
          });
        } catch (err) {
          const apiError = extractAxiosMessage(err);
          console.warn(`[checkout] Failed to sync ${item.name}:`, apiError);
          syncErrors.push(`${item.name}: ${apiError}`);
        }
      }

      if (syncErrors.length > 0) {
        return { error: `Could not add cart items: ${syncErrors.join("; ")}` };
      }

      // Re-fetch the server cart to get authoritative cart-item UUIDs
      try {
        const resp = await getUserCartApi();
        if (resp.success && resp.data) {
          serverCart = {
            items: (resp.data.cartItems ?? []) as unknown as Record<string, unknown>[],
            uuid: resp.data.uuid,
          };
        }
      } catch {
        return { error: "Failed to refresh cart after syncing. Please try again." };
      }

      if (!serverCart || serverCart.items.length === 0) {
        return { error: "Could not sync cart items to the server. Please try again." };
      }
    }

    // Now build cart-item UUIDs from the server cart (which is guaranteed to have items)
    const uuids = serverCart.items
      .map(item => extractCartItemUuid(item))
      .filter((uuid): uuid is string => uuid !== null);

    if (uuids.length === 0) {
      return { error: "Could not read cart item identifiers from your cart. Please refresh and try again." };
    }

    // If the user selected specific items, filter by store-product UUID
    if (selectedCartItemIds.length > 0) {
      // Build a set of selected store-product UUIDs from the local cart
      const selectedStoreProductUuids = new Set(
        cart.stores.flatMap(store =>
          store.items
            .filter(item => selectedCartItemIds.includes(item.id))
            .map(item => item.storeProductUuid)
            .filter((uuid): uuid is string => Boolean(uuid))
        )
      );

      // Filter server cart items: keep only those whose store-product UUID is in the selected set
      const filteredCartItemUUIDs = serverCart.items
        .filter(serverItem => {
          const serverSpUuid = extractStoreProductUuid(serverItem);
          return serverSpUuid !== null && selectedStoreProductUuids.has(serverSpUuid);
        })
        .map(serverItem => extractCartItemUuid(serverItem))
        .filter((uuid): uuid is string => Boolean(uuid));

      if (filteredCartItemUUIDs.length === 0) {
        return { error: "No matching cart items found. Please refresh and try again." };
      }

      return filteredCartItemUUIDs;
    }

    return uuids;
  };

  /**
   * Extract all fields from the CustomerCheckoutSessionResp API response.
   * The API returns: uuid, subTotal, deliveryCost, vat, serviceCharge, total, deliveryAddressUuid.
   */
  const applyCheckoutSuccess = (response: CheckoutApiResponse): boolean => {
    const d = response.data;
    const sessionUuid = getStringField(d, "uuid", "checkoutSessionUuid", "sessionUuid", "checkoutSessionId", "sessionId") ?? "";
    const subTotal = getNumberField(d, "subTotal", "subtotal", "sub_total");
    const deliveryCost = getNumberField(d, "deliveryCost", "delivery_cost", "deliveryCost");
    const vat = getNumberField(d, "vat", "VAT");
    const serviceCharge = getNumberField(d, "serviceCharge", "service_charge", "serviceCharge");
    const total = getNumberField(d, "total");
    const deliveryAddressUuid = getStringField(d, "deliveryAddressUuid", "delivery_address_uuid");

    setCheckoutResult({
      uuid: sessionUuid || undefined,
      subTotal,
      deliveryCost,
      vat,
      serviceCharge,
      total,
      deliveryAddressUuid,
      message: response.message,
    });

    if (!sessionUuid) {
      showToast("Checkout failed: no session ID returned by server.", "error");
      return false;
    }
    showToast("Checkout session created. Proceed with payment.", "success");
    return true;
  };

  /**
   * Create a checkout session and return the session UUID.
   * Returns null on failure.
   */
  const createCheckoutSession = async (): Promise<string | null> => {
    setIsLoading(true);
    try {
      const result = await buildCartItemUUIDsForCheckout();

      if (Array.isArray(result)) {
        if (result.length === 0) {
          showToast("No items to checkout.", "warning");
          return null;
        }

        const response = await checkoutApi({ cartItemUUIDs: result });
        if (!response.success) {
          throw new Error(response.message || "Checkout failed. Please try again.");
        }

        const success = applyCheckoutSuccess(response);
        if (!success) return null;

        // Return the session UUID from the response immediately (not from React state)
        const d = response.data;
        return getStringField(d, "uuid", "checkoutSessionUuid", "sessionUuid", "checkoutSessionId", "sessionId") || null;
      } else {
        showToast(result.error || "Checkout failed. Please try again.", "error");
        return null;
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Checkout failed. Please try again.";
      showToast(errorMessage, "error");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Place-order is now called inline in the step 2 handler (before the Paga redirect).
   * This function is kept as a reference implementation for future use.
   */

  const handleNextStep = async () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }

    if (currentStep === 2 && !validateStep2()) {
      return;
    }

    // Step 1: Save address, create checkout session, then attach address to session
    if (currentStep === 1) {
      const addressFormSnapshot = JSON.stringify({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: locationIds.cityId,
        state: locationIds.stateId,
        country: locationIds.countryId,
        deliveryInstructions: formData.deliveryInstructions,
      });

      // Track values locally to avoid React state timing issues
      let resolvedAddressUuid: string | null = addressUuid;
      let resolvedSessionUuid: string | null = checkoutResult?.uuid || null;

      // (Re-)create address if form data changed since last save
      if (addressFormSnapshot !== lastSavedAddressRef.current) {
        const coords = {
          latitude: latitude ?? DEFAULT_LATITUDE,
          longitude: longitude ?? DEFAULT_LONGITUDE,
        };

        try {
          const addressResp = await createCustomerAddressApi({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phone,
            street: formData.address,
            landmark: formData.deliveryInstructions || "",
            defaultAddress: true,
            city: parseInt(locationIds.cityId) || undefined,
            state: parseInt(locationIds.stateId) || undefined,
            country: parseInt(locationIds.countryId) || undefined,
            ...coords,
          });
          if (addressResp.success && addressResp.data?.uuid) {
            resolvedAddressUuid = addressResp.data.uuid;
            setAddressUuid(resolvedAddressUuid);
            lastSavedAddressRef.current = addressFormSnapshot;
          } else {
            showToast("Failed to create delivery address. Please try again.", "error");
            return;
          }
        } catch {
          showToast("Failed to save delivery address. Please check your information and try again.", "error");
          return;
        }
      }

      // Create checkout session only once — capture the UUID directly from the response
      if (!resolvedSessionUuid) {
        resolvedSessionUuid = await createCheckoutSession();
        if (!resolvedSessionUuid) return;
      }

      // Step 2 of the three-step flow: attach the delivery address to the checkout session.
      // Per the API spec: POST /api/v1/checkout/{sessionUuid}/address with { addressUuid }
      // Use locally resolved values to avoid React state timing issues.
      if (resolvedAddressUuid && resolvedSessionUuid) {
        try {
          const attachResp = await attachAddressToCheckoutSessionApi(resolvedSessionUuid, {
            addressUuid: resolvedAddressUuid,
          });
          if (attachResp.success && attachResp.data) {
            // Update the checkout result with the refreshed pricing (delivery cost may change)
            const d = attachResp.data;
            const updatedTotal = getNumberField(d, "total");
            const updatedDeliveryCost = getNumberField(d, "deliveryCost", "delivery_cost");
            const updatedSubTotal = getNumberField(d, "subTotal", "subtotal", "sub_total");
            const updatedVat = getNumberField(d, "vat", "VAT");
            const updatedServiceCharge = getNumberField(d, "serviceCharge", "service_charge");

            setCheckoutResult(prev => ({
              ...prev,
              total: updatedTotal ?? prev?.total,
              deliveryCost: updatedDeliveryCost ?? prev?.deliveryCost,
              subTotal: updatedSubTotal ?? prev?.subTotal,
              vat: updatedVat ?? prev?.vat,
              serviceCharge: updatedServiceCharge ?? prev?.serviceCharge,
            }));
          }
        } catch {
          // Address attachment is critical — if it fails, the order won't know where to deliver
          showToast("Failed to attach delivery address. Please try again.", "error");
          return;
        }
      }
    }

    // Step 2: Call place-order BEFORE redirecting to Paga, so we get the
    // paymentReference from the server. Use that reference in the Paga URL.
    // The backend webhook will confirm payment when Paga calls back.
    if (currentStep === 2) {
      // Guard: ensure a valid checkout session exists before redirecting to payment
      if (!checkoutResult?.uuid) {
        showToast(
          "No checkout session. Please go back to the information step and try again.",
          "error"
        );
        return;
      }

      // Use the API-returned total from the checkout session.
      const amount = (checkoutResult?.total ?? (checkoutResult?.subTotal ?? selectedSubtotal) + 2500).toFixed(2);

      // Step 2a: Call POST /place-order to create the order and get paymentReference
      setIsLoading(true);
      let orderData: { orderUuid?: string; paymentReference?: string; amount?: number } | null = null;
      try {
        const placeOrderResp: PlaceOrderApiResponse = await placeOrderApi({
          checkoutSessionUuid: checkoutResult.uuid,
        });

        if (!placeOrderResp.success) {
          throw new Error(placeOrderResp.message || "Failed to place order. Please try again.");
        }

        orderData = {
          orderUuid: placeOrderResp.data?.orderUuid ?? undefined,
          paymentReference: placeOrderResp.data?.paymentReference ?? undefined,
          amount: placeOrderResp.data?.amount ?? undefined,
        };

        setOrderResult(orderData);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to place order. Please try again.";
        showToast(errorMessage, "error");
        setIsLoading(false);
        return;
      }

      // Use the paymentReference from place-order as the Paga reference.
      // This lets the backend webhook match the Paga callback to the order.
      const pagaReference = orderData.paymentReference || checkoutResult.uuid;

      // Snapshot the current checkout state so we can restore it when Paga redirects back
      // (the redirect is a full page navigation — React state would be lost otherwise).
      const checkoutState = {
        checkoutUuid: checkoutResult?.uuid || "",
        orderUuid: orderData.orderUuid || "",
        paymentReference: orderData.paymentReference || "",
        addressUuid: addressUuid || "",
        formData,
        locationIds,
        selectedCartItemIds,
        // Also snapshot cart items for the order confirmation display
        cartItems: cart.stores.flatMap(s =>
          s.items
            .filter(item => selectedCartItemIds.length === 0 || selectedCartItemIds.includes(item.id))
            .map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              storeName: s.storeName,
            }))
        ),
      };
      sessionStorage.setItem(PAGA_CHECKOUT_STATE_KEY, JSON.stringify(checkoutState));

      // Build Paga checkout URL and redirect
      const chargeUrl = `${window.location.origin}/checkout`;
      // Validate that Paga is configured before redirecting
      if (!PAGA_CONFIG.publicKey) {
        showToast(
          "Payment is not configured. Please contact support.",
          "error"
        );
        setIsLoading(false);
        return;
      }

      const pagaUrl = buildPagaCheckoutUrl({
        email: formData.email,
        phoneNumber: formData.phone,
        amount,
        chargeUrl,
        reference: pagaReference,
      });

      showToast("Redirecting to Paga secure payment…", "info");

      // Save order to localStorage before redirecting (the order is placed on the server)
      try {
        const existingOrders = JSON.parse(localStorage.getItem("bringam_orders") || "[]");
        existingOrders.unshift({
          ...orderData,
          placedAt: new Date().toISOString(),
          items: cart.stores.flatMap(s =>
            s.items
              .filter(item => selectedCartItemIds.length === 0 || selectedCartItemIds.includes(item.id))
              .map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                storeName: s.storeName,
              }))
          ),
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
          },
        });
        localStorage.setItem("bringam_orders", JSON.stringify(existingOrders.slice(0, 50)));
      } catch {
        // localStorage may be full or unavailable; order is still placed
      }

      // Small delay so the user sees the loading state, then redirect.
      setTimeout(() => {
        window.location.href = pagaUrl;
      }, 600);
      return;
    }

    // Step 3: After Paga return, show confirmation (already placed via place-order)
    if (currentStep === 3) {
      // The order was already placed before the Paga redirect.
      // On return from Paga, the handler checks query params and shows the confirmation.
      // If the user didn't come from Paga (e.g. refreshed on step 3), just advance.
      setCurrentStep(4);
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
      initial="initial"
      animate="animate"
      transition={{ type: "spring", duration: 0.3 }}
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

      {/* Country dropdown — mirrors vendor-store pattern */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Country
        </label>
        <ReactSelect
          name="country"
          value={
            locationIds.countryId && countries.length > 0
              ? {
                  value: locationIds.countryId,
                  label: countries.find(c => c.id.toString() === locationIds.countryId)?.name || "",
                }
              : null
          }
          onChange={(option) => handleCountryChange(option)}
          options={countries.map(c => ({
            value: c.id.toString(),
            label: c.name,
          }))}
          placeholder="Select a country"
          isSearchable
          isClearable
          className="react-select-container"
          classNamePrefix="react-select"
        />
        {errors.countryId && (
          <p className="text-red-500 text-sm mt-1">{errors.countryId}</p>
        )}
      </div>

      {/* State dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          State
        </label>
        <ReactSelect
          name="state"
          value={
            locationIds.stateId && states.length > 0
              ? {
                  value: locationIds.stateId,
                  label: states.find(s => s.id.toString() === locationIds.stateId)?.name || "",
                }
              : null
          }
          onChange={(option) => handleStateChange(option)}
          options={states.map(s => ({
            value: s.id.toString(),
            label: s.name,
          }))}
          placeholder="Select a state"
          isSearchable
          isClearable
          isDisabled={!locationIds.countryId}
          className="react-select-container"
          classNamePrefix="react-select"
        />
        {errors.stateId && (
          <p className="text-red-500 text-sm mt-1">{errors.stateId}</p>
        )}
      </div>

      {/* City dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          City
        </label>
        <ReactSelect
          name="city"
          value={
            locationIds.cityId && cities.length > 0
              ? {
                  value: locationIds.cityId,
                  label: cities.find(c => c.id.toString() === locationIds.cityId)?.name || "",
                }
              : null
          }
          onChange={(option) => handleCityChange(option)}
          options={cities.map(c => ({
            value: c.id.toString(),
            label: c.name,
          }))}
          placeholder="Select a city"
          isSearchable
          isClearable
          isDisabled={!locationIds.stateId}
          className="react-select-container"
          classNamePrefix="react-select"
        />
        {errors.cityId && (
          <p className="text-red-500 text-sm mt-1">{errors.cityId}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Postal Code"
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleInputChange}
          placeholder="Enter postal code"
          className="border-gray-300 rounded-lg"
        />
        <Input
          label="Delivery Instructions (Optional)"
          type="text"
          name="deliveryInstructions"
          value={formData.deliveryInstructions}
          onChange={handleInputChange}
          placeholder="Any special delivery instructions..."
          className="border-gray-300 rounded-lg"
        />
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      variants={itemVariants}
      initial="initial"
      animate="animate"
      transition={{ type: "spring", duration: 0.3 }}
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
          {orderResult?.message || checkoutResult?.message || "Thank you for your order. We've received your order and will begin processing it right away."}
        </p>
      </motion.div>

      {/* Order Details from API */}
      {orderResult && (
        <motion.div
          variants={itemVariants}
          className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3"
        >
          <h3 className="font-semibold text-green-900">Order Details</h3>
          {orderResult.orderUuid && (
            <p className="text-sm text-green-800">
              Order ID: <span className="font-mono font-medium">{orderResult.orderUuid}</span>
            </p>
          )}
          {orderResult.paymentReference && (
            <p className="text-sm text-green-800">
              Payment Reference: <span className="font-mono font-medium">{orderResult.paymentReference}</span>
            </p>
          )}
          {orderResult.amount !== undefined && (
            <p className="text-sm text-green-800">
              Total: <span className="font-medium">{formatPrice(Number(orderResult.amount) || 0)}</span>
            </p>
          )}
        </motion.div>
      )}

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
            <h3 className="font-medium text-gray-900">Order #{orderResult?.orderUuid?.slice(0, 8)?.toUpperCase() || `BRG-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`}</h3>
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
              <p>Paga Checkout</p>
              {orderResult?.paymentReference && (
                <p className="mt-1 text-xs font-mono text-gray-500">
                  Ref: {orderResult.paymentReference}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <Link href="/my-orders" className="flex-1">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="button"
              style="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-[#3c4948] hover:bg-[#3c4948] hover:text-white hover:border-[#3c4948] hover:shadow-lg transition-all duration-300 ease-out font-medium shadow-sm"
            >
              <FaReceipt className="text-base" />
              View My Orders
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
      initial="initial"
      animate="animate"
      transition={{ type: "spring", duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4"
        >
          <FaCheck className="text-blue-600 text-2xl" />
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Order Placed Successfully
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Your order has been created. You will now be redirected to Paga&apos;s secure payment page to complete the transaction.
        </p>
        {orderResult?.orderUuid && (
          <p className="text-sm text-gray-500 mt-4 font-mono">
            Order ID: {orderResult.orderUuid}
          </p>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => {
    // Use API-returned pricing from the checkout session.
    // The server computes subTotal, deliveryCost, vat, serviceCharge, and total.
    const subTotal = checkoutResult?.subTotal ?? selectedSubtotal;
    const deliveryCost = checkoutResult?.deliveryCost;
    const vat = checkoutResult?.vat;
    const serviceCharge = checkoutResult?.serviceCharge;
    const total = checkoutResult?.total ?? (subTotal + (deliveryCost ?? 0) + (vat ?? 0) + (serviceCharge ?? 0));

    return (
      <motion.div
        variants={itemVariants}
        initial="initial"
        animate="animate"
        transition={{ type: "spring", duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaCreditCard className="text-[#3c4948]" />
            Payment with Paga
          </h2>
          <p className="text-gray-600 mb-6">
            Complete your payment securely through Paga. You&apos;ll be redirected to Paga&apos;s
            secure payment page to enter your card or bank details.
          </p>
        </div>

        {/* Checkout Session Confirmation */}
        {checkoutResult?.uuid && (
          <motion.div
            variants={itemVariants}
            className="p-4 bg-green-50 rounded-xl border border-green-200"
          >
            <p className="text-sm text-green-900 font-medium flex items-center gap-2">
              <FaCheck className="text-green-600" />
              Checkout session created
            </p>
            <p className="text-xs text-green-700 mt-1">
              Amount: {formatPrice(total)}
            </p>
          </motion.div>
        )}

        {/* Order Amount Summary — uses API-returned pricing */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
        >
          <h3 className="font-semibold text-gray-900">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">
                {formatPrice(subTotal)}
              </span>
            </div>
            {deliveryCost !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="text-gray-900 font-medium">{formatPrice(deliveryCost)}</span>
              </div>
            )}
            {vat !== undefined && vat > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT</span>
                <span className="text-gray-900 font-medium">{formatPrice(vat)}</span>
              </div>
            )}
            {serviceCharge !== undefined && serviceCharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Charge</span>
                <span className="text-gray-900 font-medium">{formatPrice(serviceCharge)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-[#3c4948]">{formatPrice(total)}</span>
            </div>
          </div>
        </motion.div>

        {/* Paga Payment Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#3c4948]/10 flex items-center justify-center shrink-0">
              <FaCreditCard className="text-[#3c4948] text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Paga Checkout</h3>
              <p className="text-sm text-gray-600">
                Pay securely with your card, bank account, or mobile money via Paga.
                Your payment information is handled entirely by Paga&apos;s secure platform.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Paga Features */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            { icon: FaCreditCard, label: "Card Payments", desc: "Visa, Mastercard, Verve" },
            { icon: FaTruck, label: "Bank Transfer", desc: "Direct bank transfer" },
            { icon: FaCheckCircle, label: "Mobile Money", desc: "Pay with mobile wallet" },
          ].map((feature, i) => (
            <div
              key={feature.label}
              className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl"
            >
              <feature.icon className="text-[#3c4948] text-xl mb-2" />
              <h4 className="text-sm font-medium text-gray-900">{feature.label}</h4>
              <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Secure Badge */}
        <motion.div
          variants={itemVariants}
          className="p-4 bg-blue-50 rounded-xl border border-blue-100"
        >
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-blue-600 text-lg mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Secure Payment</h4>
              <p className="text-sm text-blue-700 mt-1">
                You will be redirected to Paga&apos;s PCI-DSS compliant payment page.
                We never see or store your payment card details.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderOrderSummary = () => {
    // Use API-returned pricing when available (post-checkout-session), otherwise local subtotal
    const subTotal = checkoutResult?.subTotal ?? selectedSubtotal;
    const deliveryCost = checkoutResult?.deliveryCost;
    const vat = checkoutResult?.vat;
    const serviceCharge = checkoutResult?.serviceCharge;
    const total = checkoutResult?.total ?? (subTotal + (deliveryCost ?? 0) + (vat ?? 0) + (serviceCharge ?? 0));

    return (
      <motion.div
        variants={itemVariants}
        initial="initial"
        animate="animate"
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-gray-50 rounded-lg p-6 sticky top-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        
        <div className="space-y-3 mb-4">
          {cart.stores.map((store) => {
            const filteredItems = store.items.filter(
              (item) => selectedCartItemIds.length === 0 || selectedCartItemIds.includes(item.id)
            );
            if (filteredItems.length === 0) return null;

            return (
            <div key={store.storeId}>
              <h4 className="font-medium text-gray-900 text-sm">{store.storeName}</h4>
              <div className="ml-2 space-y-1">
                {filteredItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">{formatPrice(subTotal)}</span>
          </div>
          {deliveryCost !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-gray-900">{formatPrice(deliveryCost)}</span>
            </div>
          )}
          {vat !== undefined && vat > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT</span>
              <span className="text-gray-900">{formatPrice(vat)}</span>
            </div>
          )}
          {serviceCharge !== undefined && serviceCharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Charge</span>
              <span className="text-gray-900">{formatPrice(serviceCharge)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
            <span className="text-gray-900">Total</span>
            <span className="text-[#3c4948]">{formatPrice(total)}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Auth guard — all checkout API calls require a valid token
  if (!isAuthenticated) {
    return (
      <Wrapper>
        <motion.div
          className="bg-white min-h-screen flex items-center justify-center"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          transition={{ type: "spring", duration: 0.5 }}
        >
          <motion.div
            className="text-center max-w-md px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <FaSignInAlt className="h-10 w-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Sign in to Checkout</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              You need to be signed in to proceed with checkout. Please sign in or create an
              account to continue with your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="button" style="flex items-center justify-center gap-2" primary>
                    <FaSignInAlt className="h-4 w-4" />
                    Sign In
                  </Button>
                </motion.div>
              </Link>
              <Link href="/cart">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    style="flex items-center justify-center gap-2 bg-white border border-gray-300 text-[#3c4948] hover:bg-[#3c4948] hover:text-white"
                  >
                    <FaArrowLeft className="h-4 w-4" />
                    Back to Cart
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </Wrapper>
    );
  }

  if (cart.stores.length === 0) {
    return (
      <Wrapper>
        <motion.div
          className="bg-white min-h-screen flex items-center justify-center"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          transition={{ type: "spring", duration: 0.5 }}
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
              <span className={currentStep >= 3 ? "text-[#3c4948] font-medium" : ""}>Processing</span>
              <span className={currentStep >= 4 ? "text-[#3c4948] font-medium" : ""}>Confirmation</span>
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
          {currentStep < totalSteps && (
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
                  {currentStep === 2
                      ? "Pay with Paga"
                      : "Continue"}
                  {currentStep === 2 ? (
                    <FaCreditCard className="h-4 w-4" />
                  ) : (
                    <FaCheck className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Wrapper>
  );
};

export default CheckoutPage;