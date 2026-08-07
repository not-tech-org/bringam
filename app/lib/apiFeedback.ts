import type { AxiosResponse } from "axios";

type ApiRecord = Record<string, unknown>;

const asRecord = (value: unknown): ApiRecord | null => {
  return value && typeof value === "object" ? (value as ApiRecord) : null;
};

const firstMessage = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = firstMessage(item);
      if (message) return message;
    }
  }
  const record = asRecord(value);
  if (record) {
    for (const key of ["message", "error", "detail", "defaultMessage"]) {
      const message = firstMessage(record[key]);
      if (message) return message;
    }
  }
  return null;
};

/**
 * Returns the message supplied by an API response or request error.
 * Client-side validation should provide its own explicit message instead.
 */
export const getServerMessage = (source: unknown, fallback = "Request failed"): string => {
  const sourceRecord = asRecord(source);
  const response = asRecord(sourceRecord?.response);
  const payload = response?.data ?? sourceRecord?.data ?? source;

  return firstMessage(payload) || firstMessage(sourceRecord?.message) || fallback;
};

/**
 * Spring-style APIs can return HTTP 200 with { success: false, message }.
 * Reject those responses so every caller follows the normal error path and
 * can display the server's message instead of treating them as successes.
 */
export const rejectUnsuccessfulApiResponse = (response: AxiosResponse): AxiosResponse => {
  const payload = asRecord(response.data);
  if (payload?.success !== false) return response;

  const error = new Error(getServerMessage(response, "Request failed")) as Error & {
    response?: AxiosResponse;
  };
  error.response = response;
  throw error;
};
