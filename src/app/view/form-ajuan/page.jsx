"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import Select from "@/components/select";
import useAreas from "@/app/hooks/useAreas";
import Button from "@/components/button";
import Navbar from "@/components/navbar";
import Pending from "../../../../public/assets/amico.png";
import Image from "next/image";
const FormAjuan = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedDataAccess, setSelectedDataAccess] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(""); // Untuk menyimpan status detail
  const [username, setUsername] = useState("");
  const {
    provinces,
    cities,
    fetchCities,
    isLoading,
    error: areaError,
  } = useAreas();
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.status === "viewer") {
          setUsername(decodedToken.username || "");
          checkSubmissionStatus(token); // Panggil fungsi pengecekan status
        } else {
          router.push("/403");
        }
      } catch {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  // Fungsi untuk mengecek status pengajuan akses
  const checkSubmissionStatus = async (token) => {
    try {
      const response = await axios.get(
        "https://ppamkespro.com/api/view-access",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const status = response.data.submissionStatus;

      // Cek apakah status adalah 'submitted', 'accepted', atau 'approved'
      if (
        status === "submitted" ||
        status === "accepted" ||
        status === "approved"
      ) {
        setSubmissionStatus(status); // Simpan status pengajuan
        setHasSubmitted(true); // Tampilkan UI berbeda ketika pengajuan telah dilakukan
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Pengajuan sudah ada. Harap tunggu persetujuan.");
        setSubmissionStatus("submitted"); // Status 409 biasanya menunjukkan bahwa pengajuan sudah ada
        setHasSubmitted(true);
      } else {
        console.error("Error during submission:", error);
        toast.error("Gagal mengirim pengajuan. Silakan coba lagi.");
      }
    }
  };

  // Fungsi untuk mengajukan akses
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !inputValue.trim() ||
      !selectedDataAccess ||
      (selectedDataAccess !== "Nasional" &&
        (!selectedProvince ||
          (selectedDataAccess === "Sub Nasional (Kota/Kabupaten)" &&
            !selectedCity)))
    ) {
      setError("Semua bidang harus diisi.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      const mapData = {
        reason: inputValue,
        provinceId: selectedProvince ? parseInt(selectedProvince) : null,
        cityId:
          selectedDataAccess === "Sub Nasional (Kota/Kabupaten)" && selectedCity
            ? parseInt(selectedCity)
            : null,
      };

      const response = await axios.post(
        "https://ppamkespro.com/api/view-access",
        mapData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        toast.success("Pengajuan berhasil dikirim!");
        setSubmissionStatus("submitted"); // Setelah sukses pengajuan, set status menjadi submitted
        setHasSubmitted(true);
        // router.push("/view"); // Jika ingin mengarahkan setelah pengajuan
      }
    } catch {
      toast.error("Gagal mengirim pengajuan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render tampilan berdasarkan status pengajuan
  if (
    hasSubmitted &&
    (submissionStatus === "accepted" || submissionStatus === "approved")
  ) {
    // Tampilan untuk pengajuan yang telah diterima atau disetujui
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start">
        <Navbar username={username} />

        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="font-bold text-3xl mb-2">
            Akses Anda Telah Disetujui
          </h1>
          <p className="text-gray-700 mb-10 text-center px-4">
            Anda telah mendapatkan akses penuh ke data asesmen.
          </p>
          <div className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center">
            <p className="text-xl text-gray-800">
              Selamat! Akses Anda{" "}
              <span className="text-blue-600 font-bold">telah diterima</span>.
            </p>
            <p className="text-gray-600 text-center mt-4">
              Anda sekarang dapat mengakses semua data yang tersedia.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan ketika pengajuan sedang diproses
  if (hasSubmitted && submissionStatus === "submitted") {
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

  // Formulir pengajuan akses jika belum ada pengajuan atau belum disetujui
  return (
    <div>
      <ToastContainer />
      <Navbar username={username} />
      <div className="flex px-52 flex-col items-center justify-start mt-20 h-screen">
        <h1 className="font-bold text-3xl">Ajukan Permintaan Akses Baru</h1>
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <div>
            <label>Alasan Pengajuan</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 rounded-lg border"
              placeholder="Masukkan alasan pengajuan"
              required
            />
          </div>

          <Select
            label="Pilih Tingkat Akses Data"
            options={[
              { id: "Nasional", name: "Nasional" },
              {
                id: "Sub Nasional (Provinsi)",
                name: "Sub Nasional (Provinsi)",
              },
              {
                id: "Sub Nasional (Kota/Kabupaten)",
                name: "Sub Nasional (Kota/Kabupaten)",
              },
            ]}
            value={selectedDataAccess}
            onChange={(e) => {
              setSelectedDataAccess(e.target.value);
              if (e.target.value === "Nasional") {
                setSelectedProvince("");
                setSelectedCity("");
              }
            }}
          />

          {(selectedDataAccess === "Sub Nasional (Provinsi)" ||
            selectedDataAccess === "Sub Nasional (Kota/Kabupaten)") && (
            <Select
              label="Pilih Provinsi"
              options={provinces}
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedCity("");
                fetchCities(e.target.value);
              }}
            />
          )}

          {selectedDataAccess === "Sub Nasional (Kota/Kabupaten)" &&
            selectedProvince && (
              <Select
                label="Pilih Kota/Kabupaten"
                options={cities}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              />
            )}

          {error && <p className="text-red-500">{error}</p>}

          <div className="mt-20 mx-auto w-52">
            <Button
              label={isSubmitting ? "Mengirim..." : "KIRIM PENGAJUAN"}
              type="submit"
              disabled={
                isSubmitting ||
                !inputValue.trim() ||
                !selectedDataAccess ||
                (selectedDataAccess !== "Nasional" &&
                  (!selectedProvince ||
                    (selectedDataAccess === "Sub Nasional (Kota/Kabupaten)" &&
                      !selectedCity)))
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAjuan;
