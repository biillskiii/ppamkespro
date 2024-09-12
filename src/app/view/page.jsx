"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Pending from "../.././../public/assets/amico.png";
import ApprovedImage from "../.././../public/assets/approved.png";
import RejectedImage from "../.././../public/assets/reject.png";
import NoAccess from "../.././../public/assets/no-access.png";
import { jwtDecode } from "jwt-decode";
import { FaSpinner } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import Link from "next/link";

const StatusPage = () => {
  const [accessStatus, setAccessStatus] = useState(null); // Alias untuk status pengajuan
  const [date, setDate] = useState(null); // Alias untuk status pengajuan
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [rejectReason, setRejectReason] = useState(null); // State untuk alasan penolakan
  const [isLoading, setIsLoading] = useState(false); // State untuk alasan penolakan
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    setIsLoading(true);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const roleStatus = decodedToken.status || ""; // Ganti status role dengan alias
        const username = decodedToken.username || "";

        setUserRole(roleStatus); // Set status role
        setUsername(username);

        if (roleStatus === "viewer") {
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

  let handleDate = date
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
      const response = await axios.get("http://103.123.63.7/api/view-access", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      response.data;
      setAccessStatus(response.data.data.status);
      setDate(response.data.data.date);

      if (response.data.data.status === "rejected") {
        setRejectReason(
          response.data.data.rejectsReaseon ||
            "Tidak ada alasan yang diberikan."
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
    router.push("/view/form-ajuan");
  };

  const handleResubmit = async () => {
    router.push("/view/resubmit-ajuan");
  };

  const handleAccessData = () => {
    router.push("/view/data-assessmen");
  };

  if (accessStatus === "pending") {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start">
        <Navbar username={username} status={userRole} />{" "}
        {/* Tampilkan status role */}
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
      <div className="flex flex-col min-h-screen">
        <Navbar username={username} status={userRole} />{" "}
        {/* Tampilkan status role */}
        <div className="flex flex-1">
          <div className="w-64 bg-white ">
            <nav className="flex flex-col p-4">
              <Link
                href="/view"
                className="flex items-center gap-x-3 py-2 px-4 text-accent"
              >
                <HiMiniInboxArrowDown />
                Permintaan Akses
              </Link>
              <Link
                href="/view/data-assessmen"
                className="py-2 px-4 flex items-center gap-x-3 hover:text-accent"
              >
                <FaClipboardList />
                Data Assessment
              </Link>
            </nav>
          </div>
          <main className="flex-1 p-8 bg-[#F1F1F7]">
            <div className="flex flex-col items-center justify-center mt-14">
              <div className="px-32 py-10 rouned-lg flex flex-col items-center">
                <Image
                  src={ApprovedImage}
                  alt="Approved"
                  className="mb-6"
                  width={295.17}
                />
                <p className="text-2xl font-extrabold">
                  {" "}
                  Yeay! Permintaan akses telah{" "}
                  <span className="text-green-600 ">disetujui</span>!
                </p>
                <p className="text-base text-center mb-5">
                  Anda kini memiliki akses penuh ke data asesmen di seluruh
                  Indonesia.
                </p>
                <p className="text-gray-500 text-xs">
                  Permintaan oleh{" "}
                  <span className="text-gray-700 font-semibold te">
                    {username}
                  </span>{" "}
                  telah disetujui pada : <span>{handleDate}</span>
                </p>
                <button
                  onClick={handleAccessData}
                  className="mt-6 uppercase bg-accent text-white py-2 px-4 rounded-lg"
                >
                  Akses Data Assessmen
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (accessStatus === "rejected") {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start">
        <Navbar username={username} status={userRole} />{" "}
        {/* Tampilkan status role */}
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
              <span className="text-red-600 ">Ditolak</span> oleh admin
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
            {/* Tampilkan rejectReason */}
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
    <div className="">
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
