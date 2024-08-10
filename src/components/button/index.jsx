import React from "react";
import clsx from "clsx";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const Button = ({ variant = "primary", label, withIcon = true, onClick }) => {
  const getButtonClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 text-white";
      case "secondary":
        return "bg-gray-200 text-gray-500";
      case "tertiary":
        return "bg-white text-blue-600 border border-blue-600";
      default:
        return "bg-gray-200 text-gray-500";
    }
  };

  return (
    <button
      className={clsx(
        "flex items-center w-full justify-center gap-2",
        "rounded-lg px-4 py-2 font-semibold",
        getButtonClasses()
      )}
      onClick={onClick}
    >
      {withIcon && (variant === "secondary" || variant === "tertiary") && (
        <FaArrowLeft />
      )}
      <span>{label}</span>
      {withIcon && variant === "primary" && <FaArrowRight />}
    </button>
  );
};

export default Button;
