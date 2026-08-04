/**
 * Paga Checkout Configuration & URL Builder
 *
 * Follows the established pattern from PAYMENT-FLOW-TEMPLATE.md:
 * - Pure function to build the Paga checkout URL
 * - Single source of truth for configuration
 * - URLSearchParams for proper encoding
 */

/** Paga configuration constants — single source of truth. */
export const PAGA_CONFIG = {
  /** Paga Checkout base URL (production). */
  baseUrl: 'https://checkout.paga.com/checkout/params',
  /** Your Paga merchant public key. Set via NEXT_PUBLIC_PAYMENT_PUBLIC_KEY env var. */
  publicKey: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY || '',
  /** Default currency for transactions. */
  currency: 'NGN',
  /** Label shown on Paga's hosted payment button. */
  buttonLabel: 'Pay with Paga',
} as const;

/** Session storage key used during Paga redirect to preserve checkout state. */
export const PAGA_CHECKOUT_STATE_KEY = 'bringam_checkout_state';

/**
 * Build a Paga Checkout redirect URL with the required parameters.
 *
 * @param params - Payment parameters
 * @param params.email - Customer's email address (required by Paga)
 * @param params.phoneNumber - Customer's phone number (required by Paga)
 * @param params.amount - Amount in major currency units with 2 decimals (e.g. "500000.00")
 * @param params.chargeUrl - URL to redirect to after payment completes
 * @param params.reference - Optional merchant transaction reference
 * @returns Complete Paga Checkout URL with properly encoded parameters
 *
 * @example
 * ```ts
 * const url = buildPagaCheckoutUrl({
 *   email: 'customer@example.com',
 *   phoneNumber: '+2348012345678',
 *   amount: '15000.00',
 *   chargeUrl: 'https://bringam.com/checkout',
 * });
 * // → https://checkout.paga.com/checkout/params?public_key=...&amount=15000.00&...
 * ```
 */
export const buildPagaCheckoutUrl = ({
  email,
  phoneNumber,
  amount,
  chargeUrl,
  reference,
}: {
  email: string;
  phoneNumber: string;
  amount: string;
  chargeUrl: string;
  reference?: string;
}): string => {
  const params = new URLSearchParams({
    public_key: PAGA_CONFIG.publicKey,
    amount,
    currency: PAGA_CONFIG.currency,
    phone_number: phoneNumber,
    email,
    charge_url: chargeUrl,
    button_label: PAGA_CONFIG.buttonLabel,
  });

  // Include optional transaction reference if provided
  if (reference) {
    params.set('reference', reference);
  }

  return `${PAGA_CONFIG.baseUrl}?${params.toString()}`;
};
