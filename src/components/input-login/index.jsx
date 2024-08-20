"use client";
import React from "react";
import clsx from "clsx";

const TextInput = ({ type, name, placeholder, label, value, onChange }) => {
  return (
    <div className="w-full mb-4">
      <label htmlFor={name} className="block mb-2">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value} // Value dikendalikan oleh state di komponen Login
        onChange={onChange} // Pemanggilan fungsi onChange yang diterima dari props
        className={clsx(
          "border",
          "p-2",
          "rounded-md",
          "w-full",
          "focus:outline-none"
        )}
      />
    </div>
  );
};

export default TextInput;
