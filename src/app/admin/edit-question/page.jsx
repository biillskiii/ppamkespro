"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { FaClipboardList } from "react-icons/fa";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { FaUserGear } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
const EditAssessmentPage = () => {
  const router = useRouter();

  const handleEditClick = () => {
    // Navigasi ke halaman edit sesuai dengan kebutuhan
    router.push("/admin/edit");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white">
          <nav className="flex flex-col p-4">
            <Link
              href="/admin"
              className="flex items-center gap-x-3 py-2 px-4 hover:text-accent"
            >
              <HiMiniInboxArrowDown />
              Tinjauan Permintaan
            </Link>
            <Link
              href="/admin/data-assessment"
              className="py-2 px-4 flex items-center gap-x-3 hover:text-accent"
            >
              <FaClipboardList />
              Data Assessment
            </Link>
            <Link
              href="/admin/manajemen-pengguna"
              className="py-2 px-4 flex items-center gap-x-3 hover:text-accent"
            >
              <FaUserGear /> User Management
            </Link>
            <Link
              href="/admin/edit-question"
              className="py-2 px-4 flex items-center gap-x-3 text-accent"
            >
              <FaEdit /> Edit Question
            </Link>
            <Link
              href="/admin/tinjauan-submitter"
              className="py-2 px-4 flex items-center gap-x-3 hover:text-accent"
            >
              <HiMiniInboxArrowDown /> Tinjauan Submitter
            </Link>
          </nav>
        </div>
        <main className="flex-1 p-8 bg-[#F1F1F7]">
          <div className="w-full min-h-screen flex flex-col items-start justify-start bg-gray-100">
            <div className="text-start mb-6">
              <h1 className="text-2xl font-semibold">Edit Asesmen</h1>
              <p className="text-gray-500">
                Lakukan perubahan terhadap asesmen. Anda dapat mengedit data
                asesmen sesuai dengan kebutuhan.
              </p>
            </div>

            <div className="bg-white rounded-xl mx-auto border-2 mt-10 border-border p-8 w-[777px] text-center">
              <div className="mb-4">
                {/* Gambar edit.png */}
                <Image
                  src="/assets/edit.png" // Path gambar di folder public/assets/edit.png
                  alt="Edit Asesmen"
                  width={300} // Lebar gambar
                  height={200} // Tinggi gambar
                  className="mx-auto"
                />
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-bold">
                  Instrumen Asesmen Kesiapsiagaan Paket Pelayanan Awal Minimum
                  (PPAM)
                </h2>
                <p className="text-gray-500 text-sm">
                  (Minimum Initiative Services Package (MISP) Readiness
                  Assessment)
                </p>
              </div>
              <button
                onClick={handleEditClick}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                EDIT ASESMEN
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditAssessmentPage;
