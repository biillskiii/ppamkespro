"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { FaCheck } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const CustomInput = ({
  type,
  options = [],
  label,
  name,
  placeholder,
  colorVariant = false,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [comment, setComment] = useState(""); // State for comment box

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectCheckbox = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((val) => val !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleSelectDropdown = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const getTextColor = (label) => {
    if (label === options[0]?.label) return "text-hijau";
    if (label === options[1]?.label) return "text-merah";
    if (label === options[2]?.label) return "text-abu";
    return "text-abu";
  };

  const getBackgroundColor = (label) => {
    if (label === options[0]?.label) return "bg-hijau";
    if (label === options[1]?.label) return "bg-merah";
    if (label === options[2]?.label) return "bg-abu";
    return "text-abu";
  };

  return (
    <div className="flex flex-row items-center justify-between mb-4">
      <label
        htmlFor={name}
        className="block font-medium text-base w-2/3 pr-4"
      >
        {label}
      </label>

      <div className="w-1/3 flex flex-col space-y-2">
        {type === "checkbox" && (
          <div className="flex flex-row flex-wrap gap-4">
            {options.map((option, index) => (
              <label key={index} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={`${name}-${index}`}
                  name={name}
                  value={option.value}
                  className="hidden"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleSelectCheckbox(option.value)}
                />
                <div
                  className={clsx(
                    "w-5 h-5 border rounded-full flex justify-center items-center mr-2",
                    selectedValues.includes(option.value)
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  )}
                >
                  {selectedValues.includes(option.value) && (
                    <FaCheck size={10} className="text-white" />
                  )}
                </div>
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {type === "dropdown" && (
          <div className="relative">
            <div
              onClick={toggleDropdown}
              className={clsx(
                "border p-2 rounded-md w-full cursor-pointer",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "text-black font-medium",
                colorVariant ? getBackgroundColor(selectedValue) : "bg-white"
              )}
            >
              {selectedValue || placeholder || "Pilih salah satu"}
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
                      colorVariant && getTextColor(option.label)
                    )}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(type === "text" || type === "email") && (
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
        )}

        {type === "password" && (
          <div className="flex items-center border p-2 rounded-md w-full">
            <input
              type={showPassword ? "text" : "password"}
              id={name}
              name={name}
              placeholder={placeholder}
              className="flex-grow focus:outline-none"
            />
            <div
              className="ml-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </div>
          </div>
        )}

        {/* Comment box */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Komentar/Referensi/Rincian..."
          className="border p-2 rounded-md w-full mt-2 focus:outline-none"
          rows="2"
        />
      </div>
    </div>
  );
};

export default CustomInput;
