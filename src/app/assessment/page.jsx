"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Button from "@/components/button";
import Start from "../../../public/assets/mulai.png";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { IoLogOutOutline } from "react-icons/io5";

const Assessment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Mengambil accessToken dari localStorage

    const token = sessionStorage.getItem("accessToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Debugging line
        setUsername(decodedToken.username || "");
        setStatus(decodedToken.status || "");
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleOpenLogout = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsLogin(false);
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  const handleStart = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/assessment/bagian-0");
    }, 3000);
  };

  return (
    <div>
      <Navbar username={username} status={status} onClick={handleOpenLogout} />{" "}
      {isOpen && (
        <div className="absolute top-20 right-[218px] bg-merah rounded-b-lg p-4 py-4 w-[176px] ">
          <p
            className="text-base flex items-center justify-between cursor-pointer text-white font-semibold"
            onClick={handleLogout}
          >
            Keluar
            <IoLogOutOutline size={15} />
          </p>
        </div>
      )}
      <div className="flex flex-col items-center h-screen bg-gray-100">
        <div className="flex flex-col justify-center mt-28 items-center mb-8">
          <Image src={Start} alt="mulai assessmen" width={300} />
          <h1 className="text-base text-center mt-6 text-hitam2 font-extrabold">
            Instrumen Asessmen Kesiapsiagaan Paket Pelayanan Awal Minimum (PPAM){" "}
            <br /> (Minimum Initiative Services Package (MISP) Readiness
            Assessment)
          </h1>
        </div>
        <div className="">
          <Button
            label={
              isLoading ? (
                <p className="flex items-center gap-x-2">
                  Mulai Assessmen
                  <FaSpinner className="animate-spin" />
                </p>
              ) : (
                "Mulai Asesmen"
              )
            }
            variant="primary"
            onClick={handleStart}
            withIcon={false}
            disabled={isLoading} // Disable tombol saat loading
          />
        </div>
      </div>
    </div>
  );
};

export default Assessment;
