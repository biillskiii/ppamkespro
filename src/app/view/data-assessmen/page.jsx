"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { MdMoveToInbox } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa6";
import axios from "axios";

const DataViewer = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("default");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [approvalDate, setApprovalDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.status || "";

        if (userRole === "viewer") {
          setUsername(decodedToken.username || "");
          setStatus(decodedToken.status || "");
          setApprovalDate(decodedToken.approvalDate || "");
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

  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        item.submitter.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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

  const handleDetailData = (item) => {
    router.push(`/view/detail-data/${item.submitter}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar username={username} status={status} />
      <div className="flex flex-1">
        <div className="w-64 bg-white">
          <nav className="flex flex-col p-4">
            <Link
              href="/view"
              className="flex items-center gap-x-3 py-2 px-4 hover:text-accent"
            >
              <MdMoveToInbox size={20} />
              Permintaan Akses
            </Link>
            <Link
              href="/view/data-assessmen"
              className="py-2 px-4 flex items-center gap-x-3 text-accent"
            >
              <FaClipboardList size={20} />
              Data Assessment
            </Link>
          </nav>
        </div>
        <main className="flex-1 p-8 bg-[#F1F1F7]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Daftar Data Asesmen</h1>
            <p className="text-gray-600 mb-6">
              Temukan data asesmen kesiapsiagaan dengan mudah.
            </p>

            {/* Search and Sort */}
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Cari data (nama lembaga/provinsi/kota/kabupaten)..."
                  className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={handleSearch}
                />
                <svg
                  className="absolute left-3 top-2 w-5 h-5 text-gray-500"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
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
            {filteredData.length === 0 ? (
              <p>Loading data...</p>
            ) : (
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
                        <button
                          onClick={() => handleDetailData(item)}
                          className="text-blue-500 bg-white rounded-lg border-2 border-border flex justify-center items-center w-8 h-8"
                        >
                          →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

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

export default DataViewer;
