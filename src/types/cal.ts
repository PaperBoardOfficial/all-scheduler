export interface CalTimeSlot {
  start: string;
}

export interface CalAvailableSlotsResponse {
  data: Record<string, CalTimeSlot[]>;
  status: string;
}
