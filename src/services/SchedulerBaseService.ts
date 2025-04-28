import { BookEventRequest, BookEventResponse } from "@/types/scheduler";

abstract class SchedulerBaseService {
  protected abstract getAvailableEvents(): Promise<string[]>;
  protected abstract bookEvent(
    eventData: BookEventRequest
  ): Promise<BookEventResponse>;
}

export default SchedulerBaseService;
