import React from "react";
import Input from "@/modules/components/input";
import DatePicker from "@/components/datepicker";
import Button from "@/modules/components/button";
const page = () => {
  return (
    <div className="space-y-10 p-5">
      <Input />
      <DatePicker />
      <Button />
    </div>
  );
};
export default page;
