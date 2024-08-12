import React from "react";

const Role = ({ status }) => {
  return (
    <div className="rounded-3xl bg-[#CFF0FF] flex justify-center items-center  w-[112px] h-[35px]">
      <p className="text-base font-medium text-[#208EC1]">{status}</p>
    </div>
  );
};

export default Role;
