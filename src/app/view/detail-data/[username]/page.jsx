"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import Table from "@/components/table";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { MdMoveToInbox } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
const Admin = ({ params }) => {
  const [tableData, setTableData] = useState([]);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.status || "";

        if (userRole === "viewer") {
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
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const response = await axios.get(
          `https://ppamkespro.com/api/response/${params.username}`, // Fetching data based on username
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(params.username);
        const { data } = response.data;
        if (!data || !Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
        }

        const processedIds = new Set();

        const formattedData = data.flatMap((item, index) => {
          const { id, question, sub } = item;
          if (id > 195) return []; // Skip items with id > 195
          const shouldDisplayId = !processedIds.has(id);
          if (shouldDisplayId) {
            processedIds.add(id);
          }
          // Set the main item (Pertanyaan utama)
          const mainItem = {
            id: index + 1,
            number: "",
            question: question || "-",
            value: "-",
            comment: "-",
          };

          // Check if sub-items exist
          if (sub && Array.isArray(sub)) {
            // Process the sub-items
            const subItems = sub.map((subItem, subIndex) => {
              const shouldDisplayId = !processedIds.has(id);
              const response =
                subItem.respons.length > 0 ? subItem.respons[0] : {};
              return {
                id: shouldDisplayId ? id : "",
                number: "*",
                question: subItem.question || "-",
                value: response.value || "-",
                comment: response.comment || "-",
              };
            });

            // Return main item followed by its sub-items
            return [mainItem, ...subItems];
          }

          return [mainItem]; // Return only the main item if no sub-items
        });

        setTableData(formattedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.username) {
      fetchData();
    }
  }, [params.username]);

  const handleBack = () => {
    router.push("/view/data-assessmen");
  };

  const columnConfig = [
    { header: "No.", accessor: "number" }, // No. column configuration
    { header: "Pertanyaan", accessor: "question" },
    { header: "Jawaban", accessor: "value" },
    { header: "Komentar", accessor: "comment" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white ">
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

        {/* Main Content */}
        <main className="flex-1 bg-gray-100">
          <div className="max-w-6xl mx-auto pt-5">
            <h1 className="text-xl font-semibold mb-4">Daftar Data Asesmen</h1>
            <p className="text-gray-600 mb-6">
              Temukan data asesmen kesiapsiagaan dengan mudah.
            </p>

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <p
                  className="flex items-center gap-x-2 font-medium cursor-pointer"
                  onClick={handleBack}
                >
                  <IoMdArrowRoundBack size={15} /> Kembali
                </p>
                {/* Table Component */}
                <Table
                  type={"sub"}
                  columns={columnConfig}
                  data={tableData}
                />{" "}
                {/* Use tableData */}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
