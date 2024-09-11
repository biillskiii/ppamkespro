import React from "react";

const Role = ({ status }) => {
  // Define the default styles
  let bgColor = "#CFF0FF";
  let textColor = "#208EC1";

  // Modify the styles based on the status
  if (status === "viewer") {
    bgColor = "#EFDDFF";
    textColor = "#833AC3";
  }

  return (
    <div
      className="rounded-3xl flex justify-center items-center w-[112px] h-[35px]"
      style={{ backgroundColor: bgColor }}
    >
      <p
        className="text-base capitalize font-medium"
        style={{ color: textColor }}
      >
        {status}
      </p>
    </div>
  );
};

export default Role;
