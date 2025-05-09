import SchedulerBaseService from "@/services/SchedulerBaseService";
import { BookEventRequest } from "@/types/scheduler";
import { BookEventResponse } from "@/types/scheduler";
import axios from "axios";
import { CalAvailableSlotsResponse, CalTimeSlot } from "@/types/cal";

class CalService extends SchedulerBaseService {
  private username: string;
  private eventTypeSlug: string;
  private apiKey: string = process.env.NEXT_PUBLIC_CAL_API_KEY || "";
  private baseUrl: string = "https://api.cal.com/v2";

  constructor(calendarLink: string) {
    super();
    const cleanLink = calendarLink.replace(/\/+$/, "");
    const urlParts = cleanLink.split("/").filter(Boolean);
    if (urlParts.length < 2) {
      throw new Error("Invalid calendar link format");
    }
    this.username = urlParts[urlParts.length - 2];
    this.eventTypeSlug = urlParts[urlParts.length - 1];
  }

  public async getAvailableEvents(): Promise<string[]> {
    try {
      const dateRange = this.calculateDateRange(7);
      const response = await axios.get<CalAvailableSlotsResponse>(
        `${this.baseUrl}/slots?eventTypeSlug=${this.eventTypeSlug}&username=${this.username}&start=${dateRange.startDate}&end=${dateRange.endDate}&timeZone=Asia/Kolkata`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "cal-api-version": "2024-09-04",
          },
        }
      );

      if (response.data.status !== "success") {
        throw new Error("Failed to fetch available slots from Cal.com");
      }

      return this.parseAvailableSlots(response.data.data);
    } catch (error) {
      console.error("Error fetching Cal.com events:", error);
      throw new Error("Failed to fetch available events from Cal.com");
    }
  }

  private parseAvailableSlots(data: Record<string, CalTimeSlot[]>): string[] {
    const availableSlots: string[] = [];

    for (const date in data) {
      const slots = data[date];
      for (const slot of slots) {
        availableSlots.push(slot.start);
      }
    }

    return availableSlots;
  }

  private calculateDateRange(daysAhead: number): {
    startDate: string;
    endDate: string;
  } {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + daysAhead);

    return {
      startDate: this.formatDate(today),
      endDate: this.formatDate(endDate),
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  public async bookEvent(
    eventData: BookEventRequest
  ): Promise<BookEventResponse> {
    try {
      const istDate = new Date(eventData.dateTime);
      const utcDateTime = istDate.toISOString();

      const bookingPayload = {
        start: utcDateTime,
        attendee: {
          name: eventData.name,
          email: eventData.email,
          timeZone: "Asia/Kolkata",
        },
        eventTypeSlug: this.eventTypeSlug,
        username: this.username,
      };

      const response = await axios.post(
        `${this.baseUrl}/bookings`,
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "cal-api-version": "2024-08-13",
          },
        }
      );

      if (response.data.status !== "success") {
        throw new Error("Failed to book event with Cal.com");
      }

      return {
        success: true,
        message: `Event booked successfully. Meeting URL: ${response.data.data.meetingUrl}`,
      };
    } catch (error) {
      console.error("Error booking Cal.com event:", error);
      throw new Error("Failed to book event with Cal.com");
    }
  }
}

export default CalService;
