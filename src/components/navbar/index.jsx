import Image from "next/image";
import React from "react";
import Logo from "../../../public/assets/logo.png";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import Role from "../role";

const Navbar = ({ username, onClick, status }) => {
  return (
    <div className="bg-[#1446AB] w-full px-12 text-white h-[110px] flex justify-between">
      <div className="flex items-center gap-x-2">
        <Image src={Logo} alt="logo" width={32} />
        <p className="text-base font-medium">Assessmen Kesiapsiagaan</p>
      </div>
      <div className="flex items-center gap-x-5">
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={onClick}
        >
          <CgProfile size={35} />
          <span className="capitalize">{username}</span>{" "}
          {/* Pastikan bahwa user memiliki properti name */}
          <IoIosArrowDown size={16} />
        </p>
        <div className="border-l-2 px-4">
          <Role status={status} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
