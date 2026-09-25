export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Unable to reach the SafeBite server. Please check your connection and try again."
    );
  }

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "Something went wrong. Please try again.");
  }

  return response.json() as Promise<T>;
}

import type { ScanResult } from "./types";

export async function createScan(
  file: File,
  profileJson: string,
  privacyMode: boolean = false
): Promise<ScanResult> {
  const body = new FormData();
  body.append("file", file);
  body.append("profile", profileJson);
  body.append("privacy_mode", privacyMode.toString());

  return apiClient("/api/v1/scans", { method: "POST", body });
}

export async function getScan(scanId: string) {
  return apiClient(`/api/v1/scans/${scanId}`);
}

export async function listScans() {
  return apiClient("/api/v1/scans");
}

export async function deleteScan(scanId: string) {
  return apiClient(`/api/v1/scans/${scanId}`, { method: "DELETE" });
}

export async function createMealScan(file: File): Promise<any> {
  const body = new FormData();
  body.append("file", file);
  return apiClient("/api/v1/meals", { method: "POST", body });
}
