import React from "react";
import clsx from "clsx";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const Button = ({
  variant = "primary",
  label,
  withIcon,
  disabled,
  onClick,
}) => {
  const getButtonClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-accent text-white cursor-pointer";
      case "secondary":
        return "bg-hover text-accent";
      case "disabled":
        return "bg-hover text-white cursor-not-allowed";
    }
  };

  const renderIcon = () => {
    if (withIcon === "left") {
      return (
        (variant === "primary" && <FaArrowLeft />) ||
        (variant === "secondary" && <FaArrowLeft className="text-accent " />)
      );
    } else if (withIcon === "right") {
      return variant === "primary" && <FaArrowRight />;
    }
    return null;
  };

  return (
    <button
      className={clsx(
        "flex items-center w-full justify-center gap-2",
        "rounded-lg px-4 py-2 font-semibold",
        getButtonClasses(),
        { "cursor-not-allowed": disabled === true } // Disable pointer events for secondary variant
      )}
      onClick={variant === "secondary" ? undefined : onClick} // Disable onClick for secondary variant
    >
      {withIcon === "left" && renderIcon()}
      <span>{label}</span>
      {withIcon === "right" && renderIcon()}
    </button>
  );
};

export default Button;
