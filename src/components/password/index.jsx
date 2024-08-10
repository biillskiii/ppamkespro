'use client'
import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const PasswordInput = ({ name, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center border p-2 rounded-md w-full">
      <input
        type={showPassword ? "text" : "password"}
        id={name}
        name={name}
        placeholder={placeholder}
        className="flex-grow focus:outline-none"
      />
      <div
        className="ml-2 cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
      </div>
    </div>
  );
};

export default PasswordInput;
