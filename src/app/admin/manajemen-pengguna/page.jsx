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
import { HiDotsVertical } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
const Admin = () => {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState("viewer" && "submitter");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);

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

  const fetchData = (filterType) => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
      return;
    }

    let url = "https://ppamkespro.com/api/account?";
    if (filterType === "viewer") {
      url += "viewer=true";
    } else if (filterType === "submitter") {
      url += "submitter=true";
    } else if (filterType === "blocked") {
      url += "blocked=true";
    } else {
      url = "https://ppamkespro.com/api/account";
    }

    axios
      .get(url, {
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
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const openBlockModal = (user) => {
    setUserToBlock(user);
    setIsModalOpen(true);
  };

  const blockUser = () => {
    axios
      .put(
        `https://ppamkespro.com/api/account/block/${userToBlock}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(() => {
        alert("User blocked successfully");
        setIsModalOpen(false);
        fetchData(filter); // Refresh the user list
      })
      .catch((error) => {
        console.error("Error blocking user:", error.message);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToBlock(null);
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
              className="py-2 px-4 flex items-center gap-x-3 text-accent"
            >
              <FaUserGear /> User Management
            </Link>
            <Link
              href="/admin/edit-question"
              className="py-2 px-4 flex items-center gap-x-3 hover:text-accent"
            >
              <FaEdit /> Edit Question
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#F1F1F7]">
          {/* Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <button
                className={`rounded-lg px-6 py-2 ${
                  filter === "viewer"
                    ? "bg-accent text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setFilter("viewer")}
              >
                Viewer
              </button>
              <button
                className={`rounded-lg px-6 py-2 ${
                  filter === "submitter"
                    ? "bg-accent text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setFilter("submitter")}
              >
                Submitter
              </button>
              <button
                className={`rounded-lg px-6 py-2 ${
                  filter === "blocked"
                    ? "bg-accent text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setFilter("blocked")}
              >
                Di Blokir
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-auto">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium bg-gray-50">
                <tr>
                  <th className="px-6 py-4">#Nomor</th>
                  <th className="px-6 py-4">Kontributor</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr key={index} className="border-b relative">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4 capitalize font-semibold">
                      {user.status}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setSelectedUserId(
                            selectedUserId === user.username
                              ? null
                              : user.username
                          )
                        }
                      >
                        <HiDotsVertical />
                      </button>

                      {selectedUserId === user.username && (
                        <div
                          className={`absolute right-3 top-0 mt-2 ${
                            user.status !== "blocked"
                              ? "bg-red-500"
                              : "bg-green-500"
                          } text-white border rounded-md shadow-lg z-10`}
                        >
                          <ul>
                            {user.status === "blocked" ? (
                              <li
                                className="p-2 cursor-pointer"
                                onClick={() => openReviveModal(user.username)}
                              >
                                Revive
                              </li>
                            ) : (
                              <li
                                className="p-2 cursor-pointer"
                                onClick={() => openBlockModal(user.username)}
                              >
                                Block
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {/* Pagination component can be added here */}
          </div>
        </main>

        {/* Block Confirmation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                Are you sure you want to block {userToBlock}?
              </h2>
              <div className="w-full flex items-center space-x-4">
                <button
                  onClick={closeModal}
                  className="border-2 w-1/2 border-accent text-accent uppercase px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={blockUser}
                  className="bg-accent w-1/2 text-white uppercase px-4 py-2 rounded-lg"
                >
                  Block
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
