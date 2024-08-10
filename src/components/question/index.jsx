"use client";
import React, { useState, useEffect } from "react";
import CheckboxInput from "../checkbox";
import DropdownInput from "../dropdown";
import TextInput from "../input-text";

const Question = ({ type, options = [], label, name, placeholder }) => {
  const [comment, setComment] = useState("");

  // Load initial data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(name);
    if (savedData) {
      setComment(savedData);
    }
  }, [name]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(name, comment);
  }, [name, comment]);

  return (
    <div className="bg-white rounded-lg pt-4 px-4 h-[190px] w-[1048px]">
      <div className="flex flex-col items-start gap-y-3 mb-4 border border-border p-4 rounded-lg">
        <label
          htmlFor={name}
          className="block font-medium text-base w-2/3 pr-4"
        >
          {label}
        </label>

        {type === "checkbox" && (
          <div className="w-full flex flex-col items-start gap-y-2">
            <CheckboxInput
              options={options}
              name={name}
              onChange={(value) => setComment(value)}
            />
            <TextInput
              type="text"
              name={`${name}_comment`}
              placeholder={placeholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        )}

        {type === "dropdown" && (
          <div className="w-full flex flex-row justify-center items-start gap-x-2">
            <DropdownInput
              options={options}
              name={name}
              placeholder={placeholder}
              onChange={(value) => setComment(value)}
            />
            <TextInput
              type="text"
              name={`${name}_comment`}
              placeholder={placeholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Question;
