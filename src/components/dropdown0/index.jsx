"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { IoIosArrowDown } from "react-icons/io";

const DropdownInput = ({
  options = [],
  placeholder,
  selectedValue = "",
  setSelectedValue,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedValue = localStorage.getItem(name);
    if (savedValue) {
      setSelectedValue(savedValue);
    }
  }, [name, setSelectedValue]);

  // Inside DropdownInput
  const toggleDropdown = () => {
    console.log("Dropdown toggled:", !isOpen);
    setIsOpen((prev) => !prev);
  };

  const handleSelectDropdown = (option) => {
    console.log("Selected Option:", option);
    if (typeof setSelectedValue === "function") {
      setSelectedValue(option.value);
      localStorage.setItem(name, option.value);
      setIsOpen(false);
    } else {
      console.error("setSelectedValue is not a function");
    }
  };

  return (
    <div className="relative w-full">
      <input type="text" value={selectedValue} name={name} className="hidden" />
      <div
        onClick={toggleDropdown}
        className={clsx(
          "border p-2 rounded-md w-full cursor-pointer",
          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "text-black font-medium bg-white h-10"
        )}
      >
        {selectedValue ?
          (
            <p className="flex items-center justify-between">
              {options.find((option) => {
                if (option.value == selectedValue) {
                  console.log('check: '+JSON.stringify(option) + ' = ' + selectedValue)
                  return true
              }
              })?.label} <IoIosArrowDown size={15} /></p>
        ): (
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
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelectDropdown(option)}
              className={clsx(
                "px-4 py-2 cursor-pointer",
                "hover:bg-blue-500 text-base hover:text-white"
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
