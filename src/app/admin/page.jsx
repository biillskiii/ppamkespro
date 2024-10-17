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
import TextInput from "@/components/input-text";
const Admin = () => {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState("Belum Diproses");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

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
      .get("https://ppamkespro.com/api/view-access", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, [router]);

  const handleAccept = (username) => {
    const token = sessionStorage.getItem("accessToken");
    axios
      .put(
        `https://ppamkespro.com/api/view-access/${username}`,
        {
          status: "approve",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.username === username ? { ...item, status: "approved" } : item
          )
        );
      })
      .catch((error) => {
        console.error("Error accepting request:", error);
      });
  };

  const handleReject = (username) => {
    setSelectedUser(username);
    setShowRejectModal(true);
  };

  const submitRejection = () => {
    const token = sessionStorage.getItem("accessToken");

    axios
      .put(
        `https://ppamkespro.com/api/view-access/${selectedUser}`,
        {
          status: "reject",
          rejectReason: rejectReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.username === selectedUser
              ? { ...item, status: "rejected" }
              : item
          )
        );
        setShowRejectModal(false);
        setRejectReason("");
      })
      .catch((error) => {
        console.error("Error rejecting request:", error);
      });
  };

  const filteredData = data.filter((item) => {
    if (filter === "Belum Diproses") return item.status === "pending";
    if (filter === "Diterima") return item.status === "approved";
    if (filter === "Ditolak") return item.status === "rejected";
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 font-semibold";
      case "approved":
        return "text-green-500 font-semibold";
      case "rejected":
        return "text-red-500 font-semibold";

      default:
        return "";
    }
  };

  const hasPendingStatus = data.some((item) => item.status === "pending");
  const hasRecjectedStatus = data.some((item) => item.status === "rejected");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white ">
          <nav className="flex flex-col p-4">
            <Link
              href="/admin"
              className="flex items-center gap-x-3 py-2 px-4 text-accent"
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
        <main className="flex-1 p-8 bg-[#F1F1F7]">
          <h2 className="text-xl font-bold mb-4">
            Tinjau Permintaan Akses Pengguna
          </h2>
          <p className="mb-4">
            Lihat dan kelola permintaan akses data dari pengguna. Berikan
            persetujuan atau tolak permintaan berdasarkan kebijakan yang
            berlaku.
          </p>

          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setFilter("Belum Diproses")}
              className={`px-4 py-2 rounded-full ${
                filter === "Belum Diproses"
                  ? "bg-accent text-white border-blue-900 border-2"
                  : "bg-gray-100 border-border border-2"
              }`}
            >
              Belum Diproses
            </button>
            <button
              onClick={() => setFilter("Diterima")}
              className={`px-4 py-2 rounded-full ${
                filter === "Diterima"
                  ? "bg-accent text-white border-blue-900 border-2"
                  : "bg-gray-100 border-border border-2"
              }`}
            >
              Diterima
            </button>
            <button
              onClick={() => setFilter("Ditolak")}
              className={`px-4 py-2 rounded-full ${
                filter === "Ditolak"
                  ? "bg-accent text-white border-blue-900 border-2"
                  : "bg-gray-100 border-border border-2"
              }`}
            >
              Ditolak
            </button>
          </div>

          {filteredData.length > 0 ? (
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="py-2 border-b">#Nomor</th>
                  <th className="py-2 border-b">Nama Pengguna</th>
                  <th className="py-2 border-b">Alasan Permintaan</th>
                  <th className="py-2 border-b">Status</th>
                  {filter === "Ditolak" && (
                    <th className="py-2 border-b">Alasan Penolakan</th>
                  )}
                  {filter === "Diterima" && filter === "Ditolak" ? (
                    <th className="py-2 border-b hidden">Tindakan</th>
                  ) : (
                    <th className="py-2 border-b">Tindakan</th>
                  )}
                </tr>
              </thead>
              <tbody className="border-2">
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 border-b text-center">{index + 1}</td>
                    <td className="py-2 border-b text-center">
                      {item.username}
                    </td>
                    <td className="py-2 border-b text-center">{item.reason}</td>
                    <td
                      className={`py-2 border-b capitalize text-center ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </td>
                    {filter === "Ditolak" && (
                      <td className="py-2 border-b text-center">
                        {item.rejectReason}
                      </td>
                    )}

                    <td className="py-2 border-b text-center">
                      {item.status === "pending" && (
                        <>
                          <button
                            className="bg-[#E4FDEB] border-2 rounded-lg border-green-500 w-8 h-8 text-green-500 mr-2"
                            onClick={() => handleAccept(item.username)}
                          >
                            ✓
                          </button>
                          <button
                            className="bg-[#FEE7E7] border-2 rounded-lg border-red-500 w-8 h-8 text-red-500"
                            onClick={() => handleReject(item.username)}
                          >
                            ✗
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Tidak ada data untuk ditampilkan.</p>
          )}

          {showRejectModal && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setShowRejectModal(false)}
            >
              <div
                className="bg-white p-6 rounded-lg w-96"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl text-center font-bold mb-4">
                  Berikan Alasan Penolakan
                </h3>
                <TextInput
                  type="text"
                  placeholder="Masukan alasan penolakan"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="w-full flex justify-between mt-4">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="w-1/2 py-2 mr-2 uppercase text-accent font-semibold border-2 border-accent rounded-lg "
                  >
                    Batalkan
                  </button>
                  <button
                    onClick={submitRejection}
                    className="w-1/2 py-2 bg-accent uppercase font-semibold text-white rounded-lg disabled:bg-accent/50 disabled:cursor-not-allowed"
                    disabled={!rejectReason.trim()}
                  >
                    Tolak akses
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
