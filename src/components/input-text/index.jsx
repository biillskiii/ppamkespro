"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";

const TextInput = ({
  type = "text",
  name,
  placeholder,
  label,
  suggestions = [],
  value,
  onChange, // Ensure this is passed from the parent
}) => {
  const [savedAnswer, setSavedAnswer] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);

  useEffect(() => {
    const answer = localStorage.getItem(name);
    if (answer) {
      setSavedAnswer(answer);
    }
  }, [name]);

  const handleOnChange = (e) => {
    const value = e.target.value;
    setSavedAnswer(value);
    localStorage.setItem(name, value);

    // Filter suggestions based on user input (case-insensitive)
    const filtered = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);

    // Call the onChange handler passed from the parent
    if (onChange) {
      onChange(e); // Ensure this is called correctly
    }

    setShowSuggestions(value.length > 0 && filtered.length > 0);
    setHighlightedIndex(-1); // Reset highlight index when typing
  };

  const handleKeyDown = (e) => {
    if (filteredSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        setSavedAnswer(filteredSuggestions[highlightedIndex]);
        localStorage.setItem(name, filteredSuggestions[highlightedIndex]); // Save selected suggestion
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    }
  };

  return (
    <div className="w-full relative">
      {label && (
        <label htmlFor={name} className="block mb-2 text-gray-700 font-medium">
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value || ""} // Ensure no null is passed
        onChange={handleOnChange} // Ensure onChange is set correctly
        onKeyDown={handleKeyDown}
        className={clsx(
          "border border-gray-300 rounded-md p-2 w-full",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "shadow-sm text-gray-900"
        )}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-md shadow-md max-h-40 overflow-y-auto mt-1">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={clsx(
                "p-2 cursor-pointer hover:bg-accent hover:text-white",
                highlightedIndex === index && "bg-accent text-white"
              )}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TextInput;
