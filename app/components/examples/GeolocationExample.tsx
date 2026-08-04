"use client";

import React from "react";
import { useGeolocation } from "../../hooks/useGeolocation";

/**
 * Example component demonstrating how to use the `useGeolocation` hook.
 *
 * Renders the user's current coordinates, a loading indicator, or an
 * appropriate error message — covering all states the hook can return.
 */
const GeolocationExample = () => {
  const { latitude, longitude, loading, error, errorCode } = useGeolocation();

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
        <svg
          className="h-5 w-5 animate-spin text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-sm font-medium">Getting your location…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-lg" role="img" aria-label="warning">
            ⚠️
          </span>
          <div>
            <p className="text-sm font-medium">Location unavailable</p>
            <p className="mt-1 text-xs text-amber-700">{error}</p>
            {errorCode && (
              <p className="mt-0.5 text-xs text-amber-600/70">
                Code: {errorCode}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
      <div className="flex items-center gap-2">
        <span className="text-lg" role="img" aria-label="location">
          📍
        </span>
        <p className="text-sm font-medium">Location found</p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-green-600/70">Latitude</span>
          <p className="font-mono font-medium">{latitude?.toFixed(6)}</p>
        </div>
        <div>
          <span className="text-green-600/70">Longitude</span>
          <p className="font-mono font-medium">{longitude?.toFixed(6)}</p>
        </div>
      </div>
    </div>
  );
};

export default GeolocationExample;
