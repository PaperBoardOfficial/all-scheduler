import CalendlyService from "@/services/CalendlyService";
import CalService from "@/services/CalService";

/**
 * Helper function to get the appropriate scheduler service based on the calendar link
 *
 * @param calendarLink - The URL of the calendar service
 * @returns The appropriate service instance
 */
export function getProvider(calendarLink: string) {
  if (calendarLink.includes("calendly.com")) {
    return new CalendlyService(calendarLink);
  } else if (calendarLink.includes("cal.com")) {
    return new CalService(calendarLink);
  } else {
    throw new Error("Unsupported calendar service");
  }
}

/**
 * Standard error response format for scheduler API routes
 */
export interface ErrorResponse {
  error: string;
  message: string;
}

/**
 * Standard success response format for the booking API
 */
export interface BookingResponse {
  success: boolean;
  message: string;
}

/**
 * Standard response format for available events API
 */
export interface AvailableEventsResponse {
  availableEvents: string[];
}
