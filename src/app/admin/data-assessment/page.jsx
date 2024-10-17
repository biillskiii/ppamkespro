"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { FaClipboardList } from "react-icons/fa";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { FaUserGear } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { HiMiniInboxArrowDown } from "react-icons/fa";
const Admin = () => {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState("Belum Diproses");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.status || "";

        if (userRole === "admin") {
          setUsername(decodedToken.username || "");
          setStatus(decodedToken.status || "");
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

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
      return;
    }

    axios
      .get("https://ppamkespro.com/api/response/metadata", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data.responses)) {
          setData(response.data.data.responses);
        } else {
          console.error(
            "Expected responses to be an array, got:",
            response.data
          );
          setData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, [router]);

  const filteredData = data
    .filter((item) =>
      item.submitter.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => {
      if (selectedFilter === "tanggal") {
        return true;
      }
      if (selectedFilter === "skor") {
        return true;
      }
      return true;
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-80 bg-white ">
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
              className="py-2 px-4 flex items-center gap-x-3 text-accent"
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
              className="py-2 px-4 flex items-center gap-x-3 hover:text-accent"
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

        {/* Main Content */}
        <main className="w-full  bg-gray-100 p-8">
          <div className="me-auto ">
            <h1 className="text-xl font-semibold mb-4">Daftar Data Asesmen</h1>
            <p className="text-gray-600 mb-6">
              Temukan data asesmen kesiapsiagaan dengan mudah.
            </p>

            {/* Search and Sort */}
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Cari data Kontributor"
                  className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={handleSearch}
                />
                <svg
                  className="absolute left-3 top-2 w-5 h-5 text-gray-500"
                  fill="currentColor"
                  xmlns="https://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.9 14.32a8 8 0 111.42-1.42l4.13 4.14a1 1 0 11-1.42 1.42l-4.13-4.14zM10 16a6 6 0 100-12 6 6 0 000 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <select
                className="border p-2 rounded-lg"
                value={selectedFilter}
                onChange={handleFilterChange}
              >
                <option value="default">Urutkan berdasarkan</option>
                <option value="tanggal">Tanggal</option>
                <option value="skor">Skor</option>
              </select>
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600">
                  <th className="py-2 border-b">Participant</th>
                  <th className="py-2 border-b">Selesai</th>
                  <th className="py-2 border-b">Skor</th>
                  <th className="py-2 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-2 border-b">{item.submitter}</td>
                    <td className="py-2 border-b">{item.date}</td>
                    <td className="py-2 border-b">{item.skor || "-"}</td>
                    <td className="py-2 border-b">
                      <Link href={`/admin/detail-data/${item.submitter}`}>
                        <button className="text-blue-500 bg-white rounded-lg border-2 border-border flex justify-center items-center w-8 h-8">
                          →
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-600">
                Menampilkan {paginatedData.length} dari {filteredData.length}{" "}
                data asesmen
              </p>
              <div className="flex space-x-1">
                {Array.from({
                  length: Math.ceil(filteredData.length / itemsPerPage),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white border"
                    } rounded-lg`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
