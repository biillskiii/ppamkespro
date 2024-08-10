"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { FaCheck } from "react-icons/fa";

const CheckboxInput = ({ options = [], name }) => {
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    const savedValues = localStorage.getItem(name);
    if (savedValues) {
      setSelectedValues(JSON.parse(savedValues));
    }
  }, [name]);

  useEffect(() => {
    if (selectedValues.length > 0) {
      localStorage.setItem(name, JSON.stringify(selectedValues));
    } else {
      localStorage.removeItem(name);
    }
  }, [selectedValues, name]);

  const handleSelectCheckbox = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((val) => val !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  return (
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
  );
};

export default CheckboxInput;
