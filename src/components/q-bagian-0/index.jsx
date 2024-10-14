import React, { useState, useEffect } from "react";
import CheckboxInput from "../checkbox";
import DropdownInput from "../dropdown0";
import TextInput from "../input-text";

const Question0 = ({
  type,
  options = [], // Options should contain objects with id and name
  label,
  name,
  placeholder,
  onChange,
  suggestions = [], // Default empty array for suggestions
  selectedValue,
  setSelectedValue,
}) => {
  const [answer, setAnswer] = useState("");
  const [comment, setComment] = useState("");
  const [showSubNasional, setShowSubNasional] = useState(false);
  const [subNasionalValue, setSubNasionalValue] = useState("");
  const [cityValue, setCityValue] = useState("");

  useEffect(() => {
    if (selectedValue === "Sub Nasional") {
      setShowSubNasional(true);
    } else {
      setShowSubNasional(false);
      setSubNasionalValue("");
      setCityValue("");
    }
  }, [selectedValue]);

  const handleSubNasionalChange = (value) => {
    setSubNasionalValue(value);
    onChange(`${name}_sub_nasional`, value);
    setCityValue(""); // Reset city value when province changes
  };

  const handleCityChange = (value) => {
    setCityValue(value);
    onChange(`${name}_city`, value);
  };

  const handleAnswerChange = (value) => {
    setAnswer(value);
    onChange(name, value);
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
              suggestions={suggestions}
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
              suggestions={suggestions}
            />
          </div>
        )}

        {type === "dropdown" && (
          <div className="w-full flex flex-col items-start gap-y-2">
            <div className="w-full flex flex-row justify-start items-start gap-x-2">
              <DropdownInput
                options={options} // Pass objects with id and name
                name={name}
                placeholder={"Pilih Salah Satu"}
                value={answer}
                onChange={(e) => {
                  const selectedOption = options.find(
                    (option) => option.name === e.target.value
                  );
                  if (selectedOption) {
                    handleAnswerChange(selectedOption.id); // Use ID here
                    setSelectedValue(selectedOption.name); // Set selected value to name
                  }
                }}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Question0;
