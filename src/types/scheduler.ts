export interface BookEventRequest {
  dateTime: string;
  name: string;
  email: string;
}

export interface BookEventResponse {
  success: boolean;
  message: string;
}
