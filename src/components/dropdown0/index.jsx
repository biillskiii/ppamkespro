"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { IoIosArrowDown } from "react-icons/io";

const DropdownInput = ({
  type,
  value,
  name,
  options = [],
  placeholder,
  selectedValue = "",
  setSelectedValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedValue = localStorage.getItem(name);
    if (savedValue) {
      setSelectedValue && setSelectedValue(savedValue);
    }
  }, [name]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectDropdown = (value) => {
    setSelectedValue && setSelectedValue(value);
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
          "bg-white",
          "h-10"
        )}
      >
        {selectedValue || (
          <p className="flex items-center justify-between">
            {placeholder} <IoIosArrowDown size={15} />
          </p>
        )}
      </div>
      {isOpen && (
        <ul
          className={clsx(
            "absolute top-10 border border-gray-200 rounded-md bg-white w-full z-10",
            "max-h-60 overflow-y-auto"
          )}
        >
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelectDropdown(option)}
              className={clsx(
                "px-4 py-2 cursor-pointer",
                "hover:bg-abu",
                "text-base",
                "hover:text-white"
              )}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default DropdownInput;
