export interface CalendlyEvent {
  date: string;
  status: string;
  spots: Array<{
    status: string;
    start_time: string;
    invitees_remaining: number;
  }>;
}

export interface CalendlyEventType {
  uuid: string;
  scheduling_link: {
    uid: string;
  };
  location_configurations: Array<{
    id: number;
    kind: string;
    position: number;
    location: string | null;
    conferencing_configured: boolean;
    data: string;
  }>;
}

export interface CalendlyBookEventRequest {
  event: {
    start_time: string;
    location_configuration: {
      kind: string;
      location?: string | null;
      data?: string;
    };
    guests: Array<{ email: string; full_name?: string }>;
  };
  invitee: {
    timezone: string;
    time_notation: string;
    full_name: string;
    email: string;
  };
  scheduling_link_uuid: string;
  event_type_uuid: string;
  recaptcha_token?: string;
  analytics?: {
    invitee_landed_at: string;
    browser: string;
    device: string;
    fields_filled: number;
    fields_presented: number;
    booking_flow: string;
    seconds_to_convert: number;
  };
}

export interface CalendlyBookEventResponse {
  uri: string;
  uuid: string;
  event: {
    uuid: string;
    name: string;
    start_time: string;
    end_time: string;
    location_type: string;
  };
  invitee: {
    email: string;
    full_name: string;
    timezone: string;
  };
}
