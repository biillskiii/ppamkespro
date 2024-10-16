"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/button";
import TextInput from "@/components/input-text";
import Navbar from "@/components/navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // Note: jwtDecode is not destructured
import { useRouter } from "next/navigation";
import Image from "next/image";
import Pending from "../../../../public/assets/amico.png"; // Replace with actual path to your image
import { IoLogOutOutline } from "react-icons/io5";
const FormAjuan = () => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.status || "";

        if (userRole === "submitter") {
          setUsername(decodedToken.username || "");
          setStatus(decodedToken.status || "");

          checkSubmissionStatus(token);
        } else {
          router.push("/403");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const checkSubmissionStatus = async (token) => {
    try {
      const response = await axios.get(
        "https://ppamkespro.com/api/submit-status",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state based on the response
      if (response.data.submissionStatus === "submitted") {
        setHasSubmitted(true);
      } else {
        setHasSubmitted(false);
      }
    } catch (error) {
      console.error("Error checking submission status:", error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    if (!inputValue.trim()) {
      setError("Alasan pengajuan harus diisi.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Token not found in sessionStorage");
      }

      const response = await axios.put(
        "https://ppamkespro.com/api/submit-access",
        { status: "resubmit", reason: inputValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setHasSubmitted(true);
        router.push("/assessment");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Pengajuan sudah ada. Harap tunggu persetujuan.");
        setHasSubmitted(true);
        router.push("/assessment");
      } else {
        console.error("Error during submission:", error);
        toast.error("Gagal mengirim pengajuan. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenLogout = () => {
    setIsOpen(!isOpen);
  };
  if (hasSubmitted) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start">
        {/* Navbar */}
        <Navbar
          username={username}
          status={status}
          onClick={handleOpenLogout}
        />
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
        {/* Content */}
        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="font-bold text-3xl mb-2">Status Pengajuan Akses</h1>
          <p className="text-gray-700 mb-10 text-center px-4">
            Pantau status permintaan akses Anda untuk mendapatkan akses penuh ke
            data asesmen di seluruh Indonesia.
          </p>
          <div className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center">
            <Image
              src={Pending}
              alt="Illustration"
              className="mb-6"
              width={295.17}
            />
            <p className="text-xl text-gray-800">
              Permintaan akses Anda sedang{" "}
              <span className="text-blue-600 font-bold">diproses</span>
            </p>
            <p className="text-gray-600 text-center mt-4">
              Admin sedang memproses permintaan akses Anda. Silakan cek kembali
              secara berkala untuk mengetahui status terbaru.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Navbar username={username} status={status} />
      <div className="flex px-52 flex-col items-center justify-start mt-20 h-screen">
        <h1 className="font-bold text-3xl">Ajukan Permintaan Akses Baru</h1>
        <p className="mb-20">
          Lengkapi informasi di bawah untuk mengajukan permintaan akses data
          asesmen PPAM
        </p>
        <form className="w-full" onSubmit={handleSubmit}>
          <TextInput
            label={"Alasan Pengajuan"}
            name={"reason"}
            placeholder={"Masukkan alasan pengajuan"}
            type={"text"}
            onChange={handleInputChange}
            value={inputValue}
            required // Ensures the field is required
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="mt-5 mx-auto w-52">
            <Button
              label={isSubmitting ? "Mengirim..." : "KIRIM PENGAJUAN"}
              type={"submit"}
              variant={inputValue ? "primary" : "disabled"}
              disabled={isSubmitting || !inputValue.trim()}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAjuan;
