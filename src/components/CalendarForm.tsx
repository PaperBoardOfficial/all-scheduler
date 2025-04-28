"use client";

import React from "react";

interface CalendarFormProps {
  calendarLink: string;
  name: string;
  email: string;
  loading: boolean;
  onCalendarLinkChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

const CalendarForm: React.FC<CalendarFormProps> = ({
  calendarLink,
  name,
  email,
  loading,
  onCalendarLinkChange,
  onNameChange,
  onEmailChange,
}) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="calendar-link" className="block font-medium">
          Calendar Link
        </label>
        <input
          id="calendar-link"
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="e.g. calendly.com/codingtalks123/30min"
          value={calendarLink}
          onChange={(e) => onCalendarLinkChange(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="block font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="Your name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full p-2 border rounded-md"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={loading}
        />
      </div>
    </>
  );
};

export default CalendarForm;
