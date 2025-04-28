"use client";

import React from "react";

interface ErrorMessageProps {
  error: unknown;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="p-3 bg-red-100 text-red-700 rounded-md">
      {(error as Error)?.message || "An error occurred"}
    </div>
  );
};

export default ErrorMessage;
