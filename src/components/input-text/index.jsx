"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";

const TextInput = ({ type, name, placeholder, label, suggestions = [] }) => {
  const [savedAnswer, setSavedAnswer] = useState("");

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
    console.log(`Value for ${name}: `, value);
  };

  return (
    <div className="w-full mb-4">
      {label && (
        <label htmlFor={name} className="block mb-2 text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={savedAnswer}
          onChange={handleOnChange}
          list={suggestions ? `${name}-suggestions` : null}
          className={clsx(
            "border border-gray-300 rounded-md p-2 w-full",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "shadow-sm",
            "text-gray-900"
          )}
        />
        {suggestions && (
          <datalist id={`${name}-suggestions`}>
            {suggestions.map((suggestion, index) => (
              <option
                className="bg-white text-gray-800"
                key={index}
                value={suggestion}
              />
            ))}
          </datalist>
        )}
      </div>
    </div>
  );
};

export default TextInput;
