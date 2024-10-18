import React from "react";

const Select = ({ label, options, value, onChange, placeholder = "Pilih" }) => (
  <div>
    <label>{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 rounded-lg border"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
