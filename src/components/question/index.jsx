"use client";
import React, { useState } from "react";
import CheckboxInput from "../checkbox";
import DropdownInput from "../dropdown";
import TextInput from "../input-text";
import PasswordInput from "../password";

const Question = ({ type, options = [], label, name, placeholder }) => {
  const [comment, setComment] = useState("");

  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-[1048px]">
      <div className="flex flex-col items-start gap-y-3 mb-4 border border-border p-4 rounded-lg">
        <label
          htmlFor={name}
          className="block font-medium text-base w-2/3 pr-4"
        >
          {label}
        </label>

        {type === "checkbox" && (
          <div className="w-11/12 flex flex-col items-start gap-y-2">
            <CheckboxInput options={options} name={name} />
            <TextInput
              type="text"
              name={`${name}_comment`}
              placeholder={placeholder}
            />
          </div>
        )}

        {type === "dropdown" && (
          <div className="w-11/12 flex flex-row justify-center items-start gap-x-2">
            <DropdownInput
              options={options}
              name={name}
              placeholder={placeholder}
            />
            <TextInput
              type="text"
              name={`${name}_comment`}
              placeholder={placeholder}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Question;
