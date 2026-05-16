export type BookingSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  message: string;
  submittedAt: string;
};

export type BookingFormData = Omit<BookingSubmission, "id" | "submittedAt">;

export type AdminCredentials = {
  id: string;
  password: string;
};

import { getApiBase } from "@/lib/api";

const apiUrl = (path: string) => `${getApiBase()}${path}`;

const adminHeaders = (credentials: AdminCredentials) => ({
  "X-Admin-Id": credentials.id,
  "X-Admin-Password": credentials.password,
});

export const saveSubmission = async (submission: BookingFormData): Promise<BookingSubmission> => {
  const response = await fetch(apiUrl("/api/bookings"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Failed to save booking. Please try again.");
  }

  return response.json() as Promise<BookingSubmission>;
};

export const fetchSubmissions = async (credentials: AdminCredentials): Promise<BookingSubmission[]> => {
  const response = await fetch(apiUrl("/api/bookings"), {
    headers: adminHeaders(credentials),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Failed to load bookings.");
  }

  return response.json() as Promise<BookingSubmission[]>;
};

export const clearSubmissions = async (credentials: AdminCredentials): Promise<void> => {
  const response = await fetch(apiUrl("/api/bookings"), {
    method: "DELETE",
    headers: adminHeaders(credentials),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Failed to clear bookings.");
  }
};
