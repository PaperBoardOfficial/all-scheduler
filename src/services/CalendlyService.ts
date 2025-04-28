import SchedulerBaseService from "@/services/SchedulerBaseService";
import axios from "axios";
import {
  CalendlyEvent,
  CalendlyEventType,
  CalendlyBookEventRequest,
  CalendlyBookEventResponse,
} from "@/types/calendly";
import { BookEventRequest, BookEventResponse } from "@/types/scheduler";

class CalendlyService extends SchedulerBaseService {
  private static readonly BASE_URL = "https://calendly.com/api/booking";
  private profileSlug: string;
  private eventTypeSlug: string;

  constructor(url: string) {
    super();
    this.profileSlug = url.split("/")[3];
    this.eventTypeSlug = url.split("/")[4];
  }

  public async getAvailableEvents(): Promise<string[]> {
    try {
      const eventType = await this.fetchEventTypeDetails();
      const dateRange = this.calculateDateRange(7);
      const availableEvents = await this.fetchAvailability(
        eventType,
        dateRange
      );
      return this.parseAvailableSlots(availableEvents);
    } catch (error) {
      console.error("Error fetching Calendly events:", error);
      throw new Error("Failed to fetch available events from Calendly");
    }
  }

  private parseAvailableSlots(availableEvents: CalendlyEvent[]): string[] {
    const availableSlots: string[] = [];
    for (const day of availableEvents) {
      if (day.status === "available" && day.spots && day.spots.length > 0) {
        for (const spot of day.spots) {
          if (spot.status === "available" && spot.invitees_remaining > 0) {
            availableSlots.push(spot.start_time);
          }
        }
      }
    }
    return availableSlots;
  }

  public async bookEvent(
    eventData: BookEventRequest
  ): Promise<BookEventResponse> {
    try {
      const eventType = await this.fetchEventTypeDetails();
      const locationConfig = this.getLocationConfiguration(eventType);
      const bookingPayload = this.createBookingPayload(
        eventData,
        eventType,
        locationConfig
      );
      const response = await this.sendBookingRequest(bookingPayload);
      return {
        success: true,
        message: "Event booked successfully",
      };
    } catch (error) {
      console.error("Error booking Calendly event:", error);
      throw new Error("Failed to book event with Calendly");
    }
  }

  private async fetchEventTypeDetails(): Promise<CalendlyEventType> {
    const url = `${CalendlyService.BASE_URL}/event_types/lookup?event_type_slug=${this.eventTypeSlug}&profile_slug=${this.profileSlug}`;
    const response = await axios.get(url);
    return response.data;
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

  private async fetchAvailability(
    eventType: CalendlyEventType,
    dateRange: { startDate: string; endDate: string }
  ): Promise<CalendlyEvent[]> {
    const url = this.buildAvailabilityUrl(eventType, dateRange);
    const response = await axios.get(url);
    return response.data.days;
  }

  private buildAvailabilityUrl(
    eventType: CalendlyEventType,
    dateRange: { startDate: string; endDate: string }
  ): string {
    return (
      `${CalendlyService.BASE_URL}/event_types/${eventType.uuid}/calendar/range?` +
      `timezone=Asia%2FCalcutta&` +
      `diagnostics=false&` +
      `range_start=${dateRange.startDate}&` +
      `range_end=${dateRange.endDate}&` +
      `scheduling_link_uuid=${eventType.scheduling_link.uid}`
    );
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private getLocationConfiguration(eventType: CalendlyEventType) {
    return eventType.location_configurations &&
      eventType.location_configurations.length > 0
      ? eventType.location_configurations[0]
      : { kind: "google_conference", location: null, data: "" };
  }

  private createBookingPayload(
    eventData: BookEventRequest,
    eventType: CalendlyEventType,
    locationConfig: { kind: string; location: string | null; data: string }
  ): CalendlyBookEventRequest {
    return {
      event: {
        start_time: eventData.dateTime,
        location_configuration: {
          kind: locationConfig.kind,
          location: locationConfig.location,
          data: locationConfig.data,
        },
        guests: [],
      },
      invitee: {
        timezone: "Asia/Calcutta",
        time_notation: "12h",
        full_name: eventData.name,
        email: eventData.email,
      },
      scheduling_link_uuid: eventType.scheduling_link.uid,
      event_type_uuid: eventType.uuid,
    };
  }

  private async sendBookingRequest(
    bookingPayload: CalendlyBookEventRequest
  ): Promise<CalendlyBookEventResponse> {
    const response = await axios.post(
      `${CalendlyService.BASE_URL}/invitees`,
      bookingPayload
    );
    return response.data;
  }
}

export default CalendlyService;
