"use client";

import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled,
  isLoading,
  loadingText,
  defaultText,
  className = "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300",
}) => {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {isLoading ? loadingText : defaultText}
    </button>
  );
};

export default ActionButton;
