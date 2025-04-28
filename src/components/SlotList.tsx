"use client";

import React, { useState } from "react";

interface SlotListProps {
  availableSlots: string[];
  selectedSlot: string | null;
  loading: boolean;
  onSelectSlot: (slot: string) => void;
  onBookEvent: () => void;
  isBooking: boolean;
}

// List of common timezones
const TIMEZONES = [
  { value: "Asia/Kolkata", label: "IST (India)" },
  { value: "America/Los_Angeles", label: "PDT (Pacific)" },
  { value: "America/New_York", label: "EDT (Eastern)" },
  { value: "Europe/London", label: "BST (London)" },
  { value: "Europe/Paris", label: "CEST (Central Europe)" },
  { value: "Asia/Singapore", label: "SGT (Singapore)" },
  { value: "Australia/Sydney", label: "AEST (Sydney)" },
];

const SlotList: React.FC<SlotListProps> = ({
  availableSlots,
  selectedSlot,
  loading,
  onSelectSlot,
  onBookEvent,
  isBooking,
}) => {
  // State for selected timezone
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  
  if (availableSlots.length === 0) {
    return null;
  }

  // Format date string to a more readable format in the selected timezone
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Format options
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    };

    // Format the date according to the selected timezone
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    // Get the timezone abbreviation
    const timezoneName =
      TIMEZONES.find((tz) => tz.value === timezone)?.label.split(" ")[0] ||
      "IST";

    return `${formattedDate} (${timezoneName})`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Slots</h2>
        <div className="flex items-center">
          <label htmlFor="timezone-select" className="mr-2 text-sm">
            Timezone:
          </label>
          <select
            id="timezone-select"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="p-1 text-sm border rounded bg-gray-800 text-white"
          >
            {TIMEZONES.map((tz) => (
              <option
                key={tz.value}
                value={tz.value}
                className="bg-gray-800 text-white"
              >
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
        {availableSlots.map((slot, index) => (
          <div
            key={index}
            className={`p-3 border rounded-md cursor-pointer ${
              selectedSlot === slot
                ? "border-blue-500 bg-gray-400 text-gray-800"
                : "text-gray-100"
            }`}
            onClick={() => onSelectSlot(slot)}
          >
            {formatDate(slot)}
          </div>
        ))}
      </div>

      <button
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-300"
        onClick={onBookEvent}
        disabled={!selectedSlot || loading}
      >
        {isBooking ? "Booking..." : "Book Event"}
      </button>
    </div>
  );
};

export default SlotList;
