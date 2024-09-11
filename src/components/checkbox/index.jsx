"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

const CheckboxInput = ({ options = [], name, value = [], onChange }) => {
  const [selectedValues, setSelectedValues] = useState(value);

  // Load selected values from localStorage when the component mounts
  useEffect(() => {
    try {
      const storedValues = localStorage.getItem(name);
      if (storedValues) {
        setSelectedValues(JSON.parse(storedValues));
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
  }, [name]);

  // Save selectedValues to localStorage when they change
  useEffect(() => {
    try {
      if (selectedValues.length > 0) {
        localStorage.setItem(name, JSON.stringify(selectedValues));
      } else {
        localStorage.removeItem(name);
      }
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [selectedValues, name]);

  // Handle checkbox selection change
  const handleSelectCheckbox = (checkboxValue) => {
    const newSelectedValues = selectedValues.includes(checkboxValue)
      ? selectedValues.filter((val) => val !== checkboxValue)
      : [...selectedValues, checkboxValue];

    setSelectedValues(newSelectedValues);
    if (onChange) {
      onChange(newSelectedValues); // Notify parent component of the change
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-row flex-wrap gap-6">
        {options.map((option, index) => (
          <label key={index} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              id={`${name}-${index}`}
              name={`${name}-${index}`}
              value={option.value}
              className="hidden"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleSelectCheckbox(option.value)}
            />
            <div
              className={clsx(
                "w-5 h-5 border-2 rounded-lg flex justify-center items-center mr-2",
                selectedValues.includes(option.value)
                  ? "bg-accent border-accent text-white"
                  : "border-gray-300"
              )}
            >
              {selectedValues.includes(option.value) && <FaCheck size={12} />}
            </div>
            <span className="text-gray-600">
              {option.label || option.value}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxInput;
