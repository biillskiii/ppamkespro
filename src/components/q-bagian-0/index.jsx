"use client";
import React, { useState } from "react";
import CheckboxInput from "../checkbox";
import DropdownInput from "../dropdown0";
import TextInput from "../input-text";

const Question0 = ({
  type,
  options = [],
  label,
  name,
  placeholder,
  onChange,
}) => {
  const [answer, setAnswer] = useState("");
  const [comment, setComment] = useState("");

  const handleAnswerChange = (value) => {
    setAnswer(value);
    onChange(name, value); // Notify parent component of the change
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg p-4 h-auto w-[1048px]">
      <div className="flex flex-col items-start gap-y-3 mb-4 border border-border p-4 rounded-lg">
        <label
          htmlFor={name}
          className="block font-medium text-base w-2/3 h-auto pr-4"
        >
          {label}
        </label>
        {type === "text" && (
          <div className="w-full flex flex-col items-start gap-y-2">
            <TextInput
              type="text"
              name={`${name}_comment`}
              placeholder={placeholder}
              value={comment}
              onChange={handleCommentChange}
            />
          </div>
        )}

        {type === "checkbox" && (
          <div className="w-full flex flex-col items-start gap-y-2">
            <CheckboxInput
              options={options}
              name={name}
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
            <TextInput
              type="text"
              name={`${name}_comment`}
              placeholder={placeholder}
              value={comment}
              onChange={handleCommentChange}
            />
          </div>
        )}

        {type === "dropdown" && (
          <div className="w-full flex flex-row justify-center items-start gap-x-2">
            <DropdownInput
              options={options}
              name={name}
              placeholder={placeholder}
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
            <TextInput
              type="text"
              name={`${name}_comment`}
              placeholder={placeholder}
              value={comment}
              onChange={handleCommentChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Question0;
