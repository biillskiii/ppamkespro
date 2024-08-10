"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";

const TextInput = ({ type, name, placeholder, label }) => {
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
  };

  return (
    <div className="w-full">
      <label htmlFor="">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={savedAnswer}
        onChange={handleOnChange}
        className={clsx(
          "border",
          "p-2",
          "rounded-md",
          "w-full",
          "focus:outline-none"
        )}
      />
    </div>
  );
};

export default TextInput;
