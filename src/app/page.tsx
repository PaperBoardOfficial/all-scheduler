"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import CalendarForm from "@/components/CalendarForm";
import SlotList from "@/components/SlotList";
import ErrorMessage from "@/components/ErrorMessage";
import ActionButton from "@/components/ActionButton";
import {
  AvailableEventsResponse,
  BookingResponse,
  ErrorResponse,
} from "./api/scheduler/utils/providers";

export default function Home() {
  // State
  const [calendarLink, setCalendarLink] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // React Query setup
  const queryClient = useQueryClient();

  // Query for fetching available slots
  const slotsQuery = useQuery({
    queryKey: ["availableSlots", calendarLink],
    queryFn: async () => {
      const response = await axios.post<AvailableEventsResponse>(
        "/api/scheduler/available-events",
        {
          calendarLink,
        }
      );
      return response.data.availableEvents;
    },
    enabled: false,
    retry: 1, // Limit retries for API failures
  });

  // Mutation for booking events
  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSlot) {
        throw new Error("No slot selected");
      }

      const response = await axios.post<BookingResponse>(
        "/api/scheduler/book-event",
        {
          calendarLink,
          dateTime: selectedSlot,
          name,
          email,
        }
      );

      return response.data.success;
    },
    onSuccess: () => {
      alert("Event booked successfully!");
      setCalendarLink("");
      setName("");
      setEmail("");
      setSelectedSlot(null);
      queryClient.removeQueries({ queryKey: ["availableSlots"] });
    },
    onError: (error: Error | unknown) => {
      // Display more specific error from API if available
      let errorMessage = "Unknown error occurred";

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorResponse = error.response.data as ErrorResponse;
        errorMessage =
          errorResponse.message || errorResponse.error || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(`Failed to book event: ${errorMessage}`);
    },
  });

  // Event handlers
  const handleGetAvailableSlots = async () => {
    if (!calendarLink) {
      alert("Please enter a calendar link");
      return;
    }

    if (!name || !email) {
      alert("Please fill in your name and email");
      return;
    }

    slotsQuery.refetch();
  };

  const handleBookEvent = async () => {
    if (!selectedSlot) {
      alert("Please select a slot first");
      return;
    }

    bookMutation.mutate();
  };

  // Derived state
  const availableSlots = slotsQuery.data || [];
  const loading =
    slotsQuery.isLoading || slotsQuery.isFetching || bookMutation.isPending;
  const error = slotsQuery.error || bookMutation.error;

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Schedule an Event</h1>

      <div className="space-y-6">
        <CalendarForm
          calendarLink={calendarLink}
          name={name}
          email={email}
          loading={loading}
          onCalendarLinkChange={setCalendarLink}
          onNameChange={setName}
          onEmailChange={setEmail}
        />

        <ErrorMessage error={error} />

        <ActionButton
          onClick={handleGetAvailableSlots}
          disabled={loading}
          isLoading={slotsQuery.isFetching}
          loadingText="Loading..."
          defaultText="Get Available Slots"
        />

        <SlotList
          availableSlots={availableSlots}
          selectedSlot={selectedSlot}
          loading={loading}
          onSelectSlot={setSelectedSlot}
          onBookEvent={handleBookEvent}
          isBooking={bookMutation.isPending}
        />
      </div>
    </div>
  );
}
