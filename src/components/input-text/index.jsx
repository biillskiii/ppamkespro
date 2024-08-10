import React from "react";
import clsx from "clsx";

const TextInput = ({ type, name, placeholder }) => {
  return (
    <input
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      className={clsx(
        "border",
        "p-2",
        "rounded-md",
        "w-full",
        "focus:outline-none"
      )}
    />
  );
};

export default TextInput;
