"use client";

import { useState, useEffect } from "react";

/**
 * Possible error reasons returned by the geolocation API.
 */
export type GeolocationErrorCode =
  | "NOT_SUPPORTED"
  | "PERMISSION_DENIED"
  | "TIMEOUT"
  | "POSITION_UNAVAILABLE"
  | "UNKNOWN_ERROR"
  | "IP_FALLBACK_FAILED";

/**
 * Human-readable labels for each error code.
 */
export const GEOLOCATION_ERROR_MESSAGES: Record<GeolocationErrorCode, string> = {
  NOT_SUPPORTED: "Geolocation is not supported by your browser.",
  PERMISSION_DENIED: "You denied the request for geolocation.",
  TIMEOUT: "The request to get your location timed out.",
  POSITION_UNAVAILABLE: "Location information is unavailable.",
  UNKNOWN_ERROR: "An unknown error occurred while fetching your location.",
  IP_FALLBACK_FAILED: "Could not determine your location via GPS or IP address.",
};

/**
 * Shape of the geolocation state returned by the hook.
 */
export interface GeolocationState {
  /** The user's latitude, or null while loading / on error. */
  latitude: number | null;
  /** The user's longitude, or null while loading / on error. */
  longitude: number | null;
  /** Whether the geolocation request is in flight. */
  loading: boolean;
  /**
   * A human-readable error message, or null when no error has occurred.
   */
  error: string | null;
  /**
   * A machine-readable error code, or null when no error has occurred.
   */
  errorCode: GeolocationErrorCode | null;
  /**
   * Whether the coordinates were resolved via IP fallback (lower precision)
   * rather than GPS. Helpful for consumers that want to display an accuracy
   * indicator.
   */
  isApproximate: boolean;
}

/**
 * Normalise a GeolocationPositionError code to our error-code enum.
 */
const mapPositionError = (err: GeolocationPositionError): GeolocationErrorCode => {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return "PERMISSION_DENIED";
    case err.TIMEOUT:
      return "TIMEOUT";
    case err.POSITION_UNAVAILABLE:
      return "POSITION_UNAVAILABLE";
    default:
      return "UNKNOWN_ERROR";
  }
};

/**
 * Attempt to resolve coordinates via IP geolocation.
 *
 * Uses ip-api.com — free, no API key needed, CORS-enabled.
 * Returns null when the lookup fails for any reason.
 */
const resolveByIp = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  try {
    const res = await fetch("https://ip-api.com/json/?fields=lat,lon,status");
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.status !== "success") return null;
    return { latitude: data.lat, longitude: data.lon };
  } catch {
    return null;
  }
};

const INITIAL_STATE: GeolocationState = {
  latitude: null,
  longitude: null,
  loading: true,
  error: null,
  errorCode: null,
  isApproximate: false,
};

/**
 * `useGeolocation`
 *
 * A reusable hook that resolves the user's geographic coordinates.
 *
 * **Strategy (cascading fallback):**
 * 1. First, attempts the browser's GPS hardware via
 *    `navigator.geolocation.getCurrentPosition()` (high accuracy).
 * 2. If GPS fails (permission denied, timeout, unavailable, or unknown
 *    error), falls back to IP-based geolocation via ip-api.com.
 * 3. If both fail, returns an error.
 *
 * The location request is made once on mount (client-side only).
 *
 * @param options - Optional `PositionOptions` passed to `getCurrentPosition`.
 *
 * @returns A {@link GeolocationState} object containing:
 *  - `latitude` / `longitude` — the resolved coordinates (null while loading / on error).
 *  - `loading` — `true` while the request is in flight.
 *  - `error` — a human-readable error message, or `null` on success.
 *  - `errorCode` — a machine-readable error code, or `null` on success.
 *  - `isApproximate` — `true` when coordinates came from IP fallback (less precise).
 *
 * @example
 * ```tsx
 * const { latitude, longitude, loading, error } = useGeolocation();
 *
 * if (loading) return <p>Getting your location...</p>;
 * if (error)  return <p>{error}</p>;
 * return <p>Lat: {latitude}, Lng: {longitude}</p>;
 * ```
 */
export const useGeolocation = (options?: PositionOptions): GeolocationState => {
  const [state, setState] = useState<GeolocationState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      // --- Guard: browser does not support geolocation at all ---
      if (!("geolocation" in navigator)) {
        // Fall back to IP geolocation immediately
        const ipCoords = await resolveByIp();
        if (cancelled) return;

        if (ipCoords) {
          setState({
            latitude: ipCoords.latitude,
            longitude: ipCoords.longitude,
            loading: false,
            error: null,
            errorCode: null,
            isApproximate: true,
          });
        } else {
          setState({
            latitude: null,
            longitude: null,
            loading: false,
            error: GEOLOCATION_ERROR_MESSAGES.NOT_SUPPORTED,
            errorCode: "NOT_SUPPORTED",
            isApproximate: false,
          });
        }
        return;
      }

      // --- Step 1: Try browser GPS ---
      const gpsCoords = await new Promise<{
        latitude: number;
        longitude: number;
      } | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            // Any GPS error → fall through to IP fallback
            resolve(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
            ...options,
          }
        );
      });

      if (cancelled) return;

      if (gpsCoords) {
        setState({
          latitude: gpsCoords.latitude,
          longitude: gpsCoords.longitude,
          loading: false,
          error: null,
          errorCode: null,
          isApproximate: false,
        });
        return;
      }

      // --- Step 2: GPS failed — fall back to IP geolocation ---
      const ipCoords = await resolveByIp();
      if (cancelled) return;

      if (ipCoords) {
        setState({
          latitude: ipCoords.latitude,
          longitude: ipCoords.longitude,
          loading: false,
          error: null,
          errorCode: null,
          isApproximate: true,
        });
      } else {
        // Both GPS and IP failed — report a combined error
        setState({
          latitude: null,
          longitude: null,
          loading: false,
          error: GEOLOCATION_ERROR_MESSAGES.IP_FALLBACK_FAILED,
          errorCode: "IP_FALLBACK_FAILED",
          isApproximate: false,
        });
      }
    };

    resolve();

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
};

export default useGeolocation;
