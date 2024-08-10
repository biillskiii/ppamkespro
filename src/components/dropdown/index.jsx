"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { IoIosArrowDown } from "react-icons/io";

const DropdownInput = ({ type, label, name, options = [], placeholder }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectDropdown = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const getTextColor = (label) => {
    switch (label.toLowerCase()) {
      case "ya":
        return "text-hijau"; // or "text-green-500" for Tailwind CSS
      case "tidak":
        return "text-merah"; // or "text-red-500" for Tailwind CSS
      case "tidak tahu":
        return "text-abu"; // or "text-gray-500" for Tailwind CSS
      default:
        return "text-abu"; // Default color if not matched
    }
  };

  const getBackgroundColor = (label) => {
    switch (label.toLowerCase()) {
      case "ya":
        return "bg-hijau text-white"; // or "bg-green-500" for Tailwind CSS
      case "tidak":
        return "bg-merah text-white"; // or "bg-red-500" for Tailwind CSS
      case "tidak tahu":
        return "bg-abu text-white"; // or "bg-gray-500" for Tailwind CSS
      default:
        return "bg-white"; // Default background if not matched
    }
  };

  return (
    <div className="relative">
      <div
        onClick={toggleDropdown}
        style={{ width: "150px" }}
        className={clsx(
          "border p-2 rounded-md w-full cursor-pointer",
          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "text-black font-medium",


          getBackgroundColor(selectedValue) || "bg-white"
        )}
      >
        {selectedValue || (
          <p className="flex items-center justify-between">
            Pilih Salah Satu <IoIosArrowDown size={15} />
          </p>
        )}
      </div>
      {isOpen && (
        <ul
          className={clsx(
            "absolute mt-2 border border-gray-200 rounded-md bg-white w-full z-10",
            "max-h-60 overflow-y-auto"
          )}
        >
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelectDropdown(option.label)}
              className={clsx(
                "px-4 py-2 cursor-pointer",
                "hover:bg-gray-200",
                "text-base",
                getTextColor(option.label)
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownInput;
