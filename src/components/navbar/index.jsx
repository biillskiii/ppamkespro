"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Logo from "../../../public/assets/logo.png";
import LogoUnnes from "../../../public/assets/logo-unnes.png";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import Role from "../role";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null); // State to store user info
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken); // Set the decoded token data to user state
        setIsLogin(true);
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout(); // Logout if token is invalid
      }
    } else {
      router.push("/"); // Redirect to login if no token found
    }
  }, [router]);

  const handleLogout = () => {
    setIsLogin(false);
    sessionStorage.removeItem("accessToken");
    router.push("/");
  };

  const handleOpenLogout = () => {
    setIsOpen(!isOpen);
  };

  if (!isLogin || !user) {
    return null; // Prevent rendering if the user is not logged in or token is invalid
  }

  return (
    <div className="bg-[#1446AB] w-full px-12 text-white h-[110px] flex justify-between">
      <div className="flex items-center gap-x-2">
        <div className="px-4 py-2 rounded-lg flex items-center gap-x-2">
          <div className="bg-white rounded-full w-10 h-10 flex justify-center items-center">
            <Image src={Logo} alt="logo" width={32} />
          </div>
          <div className="bg-white rounded-full w-10 h-10 flex justify-center items-center p-2">
            <Image src={LogoUnnes} alt="logo-unnes" width={32} />
          </div>
        </div>
        <p className="text-base font-medium">Assessmen Kesiapsiagaan</p>
      </div>
      <div className="flex items-center gap-x-5">
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={handleOpenLogout}
        >
          <CgProfile size={35} />
          <span className="capitalize">
            {user.username}, {user.institute}
          </span>
          <IoIosArrowDown size={16} />
        </p>
        {isOpen && (
          <div className="absolute top-20 z-20 right-[218px] bg-red-500 rounded-b-lg p-4 py-4 w-[176px] ">
            <p
              className="text-base flex items-center justify-between cursor-pointer text-white font-semibold"
              onClick={handleLogout}
            >
              Keluar
              <IoLogOutOutline size={15} />
            </p>
          </div>
        )}
        <div className="border-l-2 px-4">
          <Role status={user.status} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
