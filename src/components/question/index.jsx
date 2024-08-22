"use client";
import React, { useState } from "react";
import CheckboxInput from "../checkbox";
import DropdownInput from "../dropdown";
import TextInput from "../input-text";

const Question = ({
  type,
  options = [],
  label,
  name,
  placeholder,
  onChange,
  subname,
  subquestions,
  no,
}) => {
  const [answer, setAnswer] = useState("");
  const [comment, setComment] = useState("");
  const [subAnswers, setSubAnswers] = useState({});

  const handleAnswerChange = (value) => {
    setAnswer(value);
    onChange(name, value); // Notify parent component of the change
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubAnswerChange = (subId, value) => {
    setSubAnswers((prevAnswers) => ({
      ...prevAnswers,
      [subId]: value,
    }));
    onChange(name, { ...subAnswers, [subId]: value }); // Notify parent component of the change
  };

  return (
    <div className="bg-white rounded-lg p-4 h-auto w-[1048px]">
      <div className="flex flex-col items-start gap-y-3 mb-4 border border-border p-4 rounded-lg">
        <label
          htmlFor={name}
          className="block font-medium text-base w-2/3 h-auto pr-4"
        >
          <span>{no}. </span>
          {label}
        </label>

        {type === "checkbox" && (
          <div className="w-full flex flex-col items-start gap-y-2">
            <CheckboxInput
              options={options}
              name={name}
              value={answer}
              onChange={handleAnswerChange}
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

        {type === "text" && (
          <div className="w-full flex gap-x-5 items-center gap-y-2">
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

        {type === "sub" && (
          <div className="w-full flex flex-col gap-y-4 ">
            <div className="flex flex-col gap-y-2">
              {subquestions?.map((subquestion) => (
                <div
                  key={subquestion.id}
                  className="w-full border border-border px-3 pt-2 pb-5 rounded-lg flex flex-col items-start gap-x-2"
                >
                  <label
                    htmlFor={`${name}_sub_${subquestion.id}`}
                    className="block font-medium my-3  text-base w-2/3 h-auto pr-4"
                  >
                    <li>{subquestion.question}</li>
                  </label>
                  {subquestion.type === "dropdown" && (
                    <div className="flex flex-row items-center gap-x-5 w-full">
                      <DropdownInput
                        options={subquestion.choice?.map((choice) => ({
                          value: choice.value,
                          label: choice.value,
                        }))}
                        name={`${name}_sub_${subquestion.id}`}
                        placeholder={placeholder}
                        value={subAnswers[subquestion.id] || ""}
                        onChange={(e) =>
                          handleSubAnswerChange(subquestion.id, e.target.value)
                        }
                      />
                      <TextInput
                        type="text"
                        name={`${name}_comment_sub_${subquestion.id}`}
                        placeholder={placeholder}
                        value={comment}
                        onChange={handleCommentChange}
                      />
                    </div>
                  )}
                  {subquestion.type === "checkbox" && (
                    <div className="flex  flex-col items-start gap-y-3 justify-center w-full">
                      <CheckboxInput
                        options={subquestion.choice?.map((choice) => ({
                          value: choice,
                        }))}
                        name={`${name}_sub_${subquestion.id}`}
                        value={subAnswers[subquestion.id] || []}
                        onChange={(value) =>
                          handleSubAnswerChange(subquestion.id, value)
                        }
                      />
                      <TextInput
                        type="text"
                        name={`${name}_comment_sub_${subquestion.id}`}
                        placeholder={placeholder}
                        value={comment}
                        onChange={handleCommentChange}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Question;
