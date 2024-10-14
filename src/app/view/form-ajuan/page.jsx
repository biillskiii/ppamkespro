"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/button";
import Navbar from "@/components/navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

const FormAjuan = () => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDataAccess, setSelectedDataAccess] = useState(""); // Selected data access
  const [provinces, setProvinces] = useState([]); // Store provinces from the API
  const [cities, setCities] = useState([]); // Store cities from the API
  const [selectedProvince, setSelectedProvince] = useState(""); // Track selected province
  const [selectedCity, setSelectedCity] = useState(""); // Track selected city
  const router = useRouter();

  // Fetch token and check status
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.status || "";

        if (userRole === "viewer") {
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
    setIsLoading(false);
  }, [router]);

  // Check submission status
  const checkSubmissionStatus = async (token) => {
    try {
      const response = await axios.get(
        "https://ppamkespro.com/api/view-status",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.submissionStatus === "submitted") {
        setHasSubmitted(true);
      }
    } catch (error) {
      console.error("Error checking submission status:", error);
    }
  };

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://api.example.com/provinces"); // Replace with actual API URL
        setProvinces(response.data); // Assuming the data contains a list of provinces
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch cities when a province is selected
  useEffect(() => {
    if (selectedProvince) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(
            `https://api.example.com/provinces/${selectedProvince}/cities` // Replace with actual API URL
          );
          setCities(response.data); // Assuming the data contains a list of cities
        } catch (error) {
          console.error("Failed to fetch cities:", error);
        }
      };

      fetchCities();
    } else {
      setCities([]); // Reset cities when no province is selected
    }
  }, [selectedProvince]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDataAccessChange = (e) => {
    const selectedAccess = e.target.value;
    setSelectedDataAccess(selectedAccess);
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value); // Update selected province
    setSelectedCity(""); // Reset city when province changes
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value); // Update selected city
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

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
      if (!token) {
        throw new Error("Token not found in sessionStorage");
      }

      const response = await axios.post(
        "https://ppamkespro.com/api/view-access",
        {
          reason: inputValue,
          dataAccess: selectedDataAccess,
          province: selectedProvince,
          city: selectedCity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setHasSubmitted(true);
        router.push("/view");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Pengajuan sudah ada. Harap tunggu persetujuan.");
        setHasSubmitted(true);
      } else {
        console.error("Error during submission:", error);
        toast.error("Gagal mengirim pengajuan. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-6xl text-accent" />
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
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <div>
            <label>Alasan Pengajuan</label>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Masukkan alasan pengajuan"
              className="w-full p-2 rounded-lg border"
              required
            />
          </div>

          <div>
            <label>Pilih Tingkat Akses Data</label>
            <select
              value={selectedDataAccess}
              onChange={handleDataAccessChange}
              className="w-full p-2 rounded-lg border"
              required
            >
              <option value="">Pilih akses</option>
              <option value="Nasional">Nasional</option>
              <option value="Sub Nasional (Provinsi)">
                Sub Nasional (Provinsi)
              </option>
              <option value="Sub Nasional (Kota/Kabupaten)">
                Sub Nasional (Kota/Kabupaten)
              </option>
            </select>
          </div>
          {selectedDataAccess === "Sub Nasional (Provinsi)" && (
            <div className="w-full">
              <label>Pilih Provinsi</label>
              <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full p-2 rounded-lg border"
                required
              >
                <option value="">Pilih provinsi</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedDataAccess === "Sub Nasional (Kota/Kabupaten)" && (
            <div className="w-full flex items-center gap-x-5">
              <div className="w-full">
                <label>Pilih Provinsi</label>
                <select
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  className="w-full p-2 rounded-lg border"
                  required
                >
                  <option value="">Pilih provinsi</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label>Pilih Kota/Kabupaten</label>
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="w-full p-2 rounded-lg border"
                  required
                >
                  <option value="">Pilih kota/kabupaten</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 mt-2 rounded-lg">{error}</p>}
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
