"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Pending from "../../../public/assets/amico.png";
import RejectedImage from "../../../public/assets/reject.png";
import NoAccess from "../../../public/assets/no-access.png";
import { jwtDecode } from "jwt-decode"; // Hapus { }, jwtDecode tidak memerlukan {}
import { FaSpinner } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5"; // Mengganti import untuk icon logout yang digunakan
import Button from "@/components/button"; // Pastikan komponen Button ada
import Start from "../../../public/assets/mulai.png";
const StatusPage = () => {
  const [accessStatus, setAccessStatus] = useState(null);
  const [date, setDate] = useState(null);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [rejectReason, setRejectReason] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Tambahan untuk handling logout menu
  const router = useRouter();
  const [instansi, setInstansi] = useState("");
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    setIsLoading(true);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const roleStatus = decodedToken.status || "";
        const username = decodedToken.username || "";

        setUserRole(roleStatus);
        setUsername(username);
        setInstansi(decodedToken.institute || "");
        if (roleStatus === "submitter") {
          checkAccessStatus();
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

  const handleDate = date
    ? new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  const checkAccessStatus = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      console.error("Token is missing");
      router.push("/");
      return;
    }

    try {
      const response = await axios.get(
        "https://ppamkespro.com/api/submit-access",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAccessStatus(response.data.data.status);
      setDate(response.data.data.date);

      if (response.data.data.status === "rejected") {
        setRejectReason(
          response.data.data.rejectReason || "Tidak ada alasan yang diberikan."
        );
      }
    } catch (error) {
      console.error("Error fetching access status:", error);

      if (error.response?.status === 401) {
        router.push("/login");
      }
    }
    setIsLoading(false);
  };

  const handleAjuan = () => {
    router.push("/assessment/form-ajuan");
  };

  const handleOpenLogout = () => {
    setIsOpen(!isOpen);
  };
  const handleResubmit = async () => {
    router.push("/assessment/resubmit-ajuan");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/");
  };
  const handleStart = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/assessment/bagian-0");
    }, 3000);
  };
  if (accessStatus === "pending") {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start">
        <Navbar
          username={username}
          status={userRole}
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
        <div className="flex flex-col items-center justify-center mt-14">
          <h1 className="font-bold text-3xl mb-2">Status Pengajuan Akses</h1>
          <p className="text-gray-700 mb-10 text-center px-4">
            Pantau status permintaan akses Anda untuk mendapatkan akses penuh ke
            data asesmen di seluruh Indonesia.
          </p>
          <div className="bg-white px-32 py-10 rounded-lg shadow-lg flex flex-col items-center">
            <Image
              src={Pending}
              alt="Illustration"
              className="mb-6"
              width={295.17}
            />
            <p className="text-2xl font-extrabold">
              Permintaan akses Anda sedang{" "}
              <span className="text-accent">diproses</span>
            </p>
            <p className="text-center mt-4">
              Admin sedang memproses permintaan akses Anda. Silakan cek kembali
              secara berkala
              <br />
              untuk mengetahui status terbaru.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (accessStatus === "approved") {
    return (
      <div>
        <Navbar
          username={username}
          institute={instansi}
          status={status}
          onClick={handleOpenLogout}
        />{" "}
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
              Instrumen Asessmen Kesiapsiagaan Paket Pelayanan Awal Minimum
              (PPAM) <br /> (Minimum Initiative Services Package (MISP)
              Readiness Assessment)
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
  }

  if (accessStatus === "rejected") {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start">
        <Navbar username={username} status={userRole} />
        <div className="flex flex-col items-center justify-center mt-10">
          <h1 className="font-bold text-3xl mb-2">Status Pengajuan Akses</h1>
          <p className="text-gray-700 mb-10 text-center px-4">
            Maaf, permintaan akses Anda ditolak. Anda bisa melakukan pengajuan
            ulang.
          </p>
          <div className="bg-white px-32 py-5 rounded-lg shadow-lg flex flex-col items-center">
            <Image
              src={RejectedImage}
              alt="Rejected"
              className="mb-6"
              width={295.17}
            />
            <p className="text-2xl font-extrabold">
              Oops, permintaan akses Anda{" "}
              <span className="text-red-600">Ditolak</span> oleh admin
            </p>
            <p className="text-center mt-4">
              Silakan melakukan pengajuan ulang jika ada perubahan pada
              informasi yang Anda kirimkan.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Permintaan oleh{" "}
              <span className="text-gray-700 font-semibold">{username}</span>{" "}
              telah ditolak dengan alasan :{" "}
              <span className="text-red-500 font-semibold">{rejectReason}</span>
            </p>
            <button
              onClick={handleResubmit}
              className="mt-6 uppercase bg-accent font-semibold text-white py-2 px-4 rounded-lg"
            >
              Ajukan Ulang Permintaan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <FaSpinner className="animate-spin text-6xl text-accent" />
        </div>
      ) : (
        <div className="w-full ">
          <Navbar />
          <div className="flex flex-col mt-20 gap-y-1 items-center text-center">
            <Image
              src={NoAccess}
              alt="no access"
              width={500}
              className="mb-10"
            />
            <h1 className="font-extrabold text-2xl">
              Anda belum mengajukan permintaan akses data
            </h1>
            <p className="font-medium text-sm mb-5">
              Ajukan permintaan sekarang untuk mengakses data instrumen asesmen
              PPAM yang Anda butuhkan.
            </p>
            <button
              className="mx-auto uppercase px-6 py-3 rounded-lg bg-accent text-white"
              onClick={handleAjuan}
            >
              Buat Pengajuan Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPage;
