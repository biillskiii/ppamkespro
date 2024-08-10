import React from "react";
import CustomInput from "@/components/dropdown";
const index = () => {
  return (
    <div className="space-y-10">
      {/* Dropdown Input */}
      <CustomInput
        type="dropdown"
        label="Select an option:"
        name="dropdownExample"
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
      />
      {/* Dropdown Input Ya Tidak Tidak Tahu */}
      <CustomInput
        type="dropdown"
        options={[
          { label: "Iya", value: "iya" },
          { label: "Tidak", value: "tidak" },
          { label: "Tidak Tahu", value: "tidak_tahu" },
        ]}
        label="Pilih opsi"
        name="options"
        colorVariant={true} // Enable the color variant feature
        placeholder="Pilih salah satu"
      />

      {/* Radio Button Input */}
      <CustomInput
        type="checkbox"
        label="Choose multiple options:"
        name="customCheckbox"
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
      />

      {/* Text Input */}
      <CustomInput
        type="text"
        label="Enter text:"
        name="textInputExample"
        placeholder="Type something..."
      />
    </div>
  );
};

export default index;
