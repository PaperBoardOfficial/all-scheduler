import SchedulerBaseService from "@/services/SchedulerBaseService";
import { BookEventRequest } from "@/types/scheduler";
import { BookEventResponse } from "@/types/scheduler";

class CalService extends SchedulerBaseService {
  constructor(calendarLink: string) {
    super();
  }
  public getAvailableEvents(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }

  public bookEvent(eventData: BookEventRequest): Promise<BookEventResponse> {
    throw new Error("Method not implemented.");
  }
}

export default CalService;
