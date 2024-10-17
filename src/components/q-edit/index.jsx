import React, { useState } from "react";
import CheckboxInput from "../checkbox";
import DropdownInput from "../dropdown";
import TextInput from "../input-text";

const Question0 = ({
  type,
  options = [],
  label,
  name,
  placeholder,
  onChange,
  subname,
  subquestions,
  no,
  questionText,
  onQuestionChange,
  onSubQuestionChange,
}) => {
  const [answer, setAnswer] = useState("");
  const [comment, setComment] = useState("");
  const [subAnswers, setSubAnswers] = useState({});
  const [subComments, setSubComments] = useState({});
  const [localSubQuestions, setLocalSubQuestions] = useState(
    subquestions || []
  );

  const handleAnswerChange = (value) => {
    setAnswer(value);
    onChange(name, value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubQuestionTextChange = (subId, e) => {
    const updatedSubQuestions = localSubQuestions.map((sub) =>
      sub.id === subId ? { ...sub, question: e.target.value } : sub
    );
    setLocalSubQuestions(updatedSubQuestions);
    onSubQuestionChange(subId, e.target.value);
  };

  // Sub-question answer change
  const handleSubAnswerChange = (subId, value) => {
    setSubAnswers((prev) => ({
      ...prev,
      [subId]: value,
    }));
    onSubQuestionChange(subId, value); // Notify parent
  };

  // Sub-question comment change
  const handleSubCommentChange = (subId, e) => {
    const value = e.target.value;
    setSubComments((prev) => ({
      ...prev,
      [subId]: value,
    }));
    onSubQuestionChange(subId, value); // Notify parent
  };

  return (
    <div className="bg-white rounded-lg p-4 h-auto w-[1048px]">
      <div className="flex flex-col items-start gap-y-3 mb-4 border border-border p-4 rounded-lg">
        <label
          htmlFor={name}
          className=" flex gap-x-5 items-center font-bold text-base w-full h-auto pr-4"
        >
          <span className="px-4 py-2 rounded-lg border border-border">
            {no}
          </span>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={questionText}
            onChange={(e) => onQuestionChange(e.target.value)}
          />
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
          <div className="w-full flex flex-col gap-y-4">
            {localSubQuestions.map((subquestion) => (
              <div
                key={subquestion.id}
                className="w-full border border-border px-3 pt-2 pb-5 rounded-lg flex flex-col items-start gap-x-2"
              >
                <input
                  type="text"
                  className="block font-bold my-3 text-base w-full border border-gray-300 p-2 rounded"
                  value={subquestion.question}
                  onChange={(e) =>
                    handleSubQuestionTextChange(subquestion.id, e)
                  }
                />
                {subquestion.type === "dropdown" && (
                  <div className="flex flex-row items-center gap-x-5 w-full">
                    <DropdownInput
                      options={subquestion.choice?.map((choice) => ({
                        value: choice.value,
                        label: choice.value,
                      }))}
                      name={`${name}_sub_${subquestion.id}`}
                      value={subAnswers[subquestion.id] || ""}
                      onChange={(e) =>
                        handleSubAnswerChange(subquestion.id, e.target.value)
                      }
                    />
                    <TextInput
                      type="text"
                      name={`${name}_comment_sub_${subquestion.id}`}
                      value={subComments[subquestion.id] || ""}
                      onChange={(e) =>
                        handleSubCommentChange(subquestion.id, e)
                      }
                    />
                  </div>
                )}
                {subquestion.type === "checkbox" && (
                  <div className="flex flex-col items-start gap-y-3 justify-center w-full">
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
                      value={subComments[subquestion.id] || ""}
                      onChange={(e) =>
                        handleSubCommentChange(subquestion.id, e)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Question0;
