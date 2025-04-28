import { NextResponse } from "next/server";
import {
  getProvider,
  AvailableEventsResponse,
  ErrorResponse,
} from "../utils/providers";

/**
 * API endpoint to fetch available event slots
 *
 * @route POST /api/scheduler/available-events
 * @param request - Contains calendarLink in the request body
 * @returns Array of available time slots
 */
export async function POST(request: Request) {
  try {
    // Extract calendar link from request body
    const { calendarLink } = await request.json();

    if (!calendarLink) {
      const errorResponse: ErrorResponse = {
        error: "Calendar link is required",
        message: "Please provide a valid calendar link",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Get the appropriate service
    const provider = getProvider(calendarLink);

    // Fetch available events
    const availableEvents = await provider.getAvailableEvents();

    // Return response
    const response: AvailableEventsResponse = { availableEvents };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error getting available events:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to fetch available events",
      message: (error as Error).message,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
