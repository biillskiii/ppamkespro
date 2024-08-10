"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { IoIosArrowDown } from "react-icons/io";

const DropdownInput = ({ type, label, name, options = [], placeholder }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedValue = localStorage.getItem(name);
    if (savedValue) {
      setSelectedValue(savedValue);
    }
  }, [name]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectDropdown = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    localStorage.setItem(name, value);
  };

  const getTextColor = (label) => {
    switch (label.toLowerCase()) {
      case "ya":
        return "text-hijau";
      case "tidak":
        return "text-merah";
      case "tidak tahu":
        return "text-abu";
      default:
        return "text-abu";
    }
  };

  const getBackgroundColor = (label) => {
    switch (label.toLowerCase()) {
      case "ya":
        return "bg-hijau text-white";
      case "tidak":
        return "bg-merah text-white";
      case "tidak tahu":
        return "bg-abu text-white";
      default:
        return "bg-white";
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
