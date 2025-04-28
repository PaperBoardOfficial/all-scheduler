import { NextResponse } from "next/server";
import {
  getProvider,
  BookingResponse,
  ErrorResponse,
} from "../utils/providers";

/**
 * API endpoint to book an event
 *
 * @route POST /api/scheduler/book-event
 * @param request - Contains calendarLink, dateTime, name, and email in the request body
 * @returns Success status and message
 */
export async function POST(request: Request) {
  try {
    // Extract booking data from request body
    const { calendarLink, dateTime, name, email } = await request.json();

    // Validate required fields
    if (!calendarLink || !dateTime || !name || !email) {
      const errorResponse: ErrorResponse = {
        error: "Missing required fields",
        message: "Calendar link, dateTime, name, and email are required",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Get the appropriate service
    const provider = getProvider(calendarLink);

    // Book the event
    const bookingResult = await provider.bookEvent({ dateTime, name, email });

    // Return response
    const response: BookingResponse = {
      success: bookingResult.success,
      message: bookingResult.message,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error booking event:", error);
    const errorResponse: ErrorResponse = {
      error: "Failed to book event",
      message: (error as Error).message,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
