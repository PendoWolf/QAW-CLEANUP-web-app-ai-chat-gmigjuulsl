import { ApiError } from "../api/client";

// The Pendo agent, when the app loads it, exposes a global `pendo` object.
// Track Events are sent through it; the agent attaches the visitor and account.
type TrackProperties = Record<string, string | number | boolean>;

declare global {
  interface Window {
    pendo?: {
      track?: (eventName: string, properties?: TrackProperties) => void;
    };
  }
}

/**
 * Sends a Pendo Track Event. Does nothing when the Pendo agent isn't loaded, and
 * never lets a tracking failure break the app.
 */
export function trackEvent(eventName: string, properties: TrackProperties = {}): void {
  try {
    window.pendo?.track?.(eventName, properties);
  } catch {
    // Tracking is best effort.
  }
}

/** The HTTP status of a failed API call, or 0 when the request got no response. */
export function errorStatusOf(error: unknown): number {
  return error instanceof ApiError ? error.status : 0;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDay(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

/** Days a trip spans, counting its start and end dates. */
export function tripLengthDays(startDate: string, endDate: string): number {
  const days = Math.round((parseDay(endDate) - parseDay(startDate)) / DAY_MS) + 1;
  return Number.isFinite(days) ? days : 0;
}

/** Days from today until a trip starts (negative when it already started). */
export function daysUntil(date: string): number {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((parseDay(date) - today) / DAY_MS);
  return Number.isFinite(days) ? days : 0;
}
