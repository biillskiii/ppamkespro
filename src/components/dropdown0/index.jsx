"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { IoIosArrowDown } from "react-icons/io";

const DropdownInput = ({ type, value, name, options = [], placeholder }) => {
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

  return (
    <div className="relative">
      <input type="text" value={selectedValue} name={name} className="hidden" />
      <div
        onClick={toggleDropdown}
        style={{ width: "200px" }}
        className={clsx(
          "border p-2 rounded-md w-full cursor-pointer",
          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "text-black font-medium",
          "bg-white" // Keep the background white for the selected option
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
            "absolute top-32 border border-gray-200 rounded-md bg-white w-full z-10",
            "max-h-60 overflow-y-auto"
          )}
        >
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelectDropdown(option.value)}
              className={clsx(
                "px-4 py-2 cursor-pointer",
                "hover:bg-abu", // Set hover background color to bg-abu
                "text-base"
              )}
            >
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownInput;
