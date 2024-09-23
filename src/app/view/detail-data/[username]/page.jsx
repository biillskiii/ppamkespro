"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import Table from "@/components/table";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { FaFileDownload } from "react-icons/fa";
import { MdMoveToInbox } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import * as XLSX from "xlsx";

const View = ({ params }) => {
  const [tableData, setTableData] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.status || "";

        if (userRole === "viewer") {
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
          `https://ppamkespro.com/api/response/${params.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { responses } = response.data.data;

        if (responses && typeof responses === "object") {
          const formattedData = Object.keys(responses).reduce((acc, key) => {
            acc[key] = responses[key].flatMap((item) => {
              const baseItem = {
                number: item.number,
                question: item.question || "-",
                value: item.value || "-",
                comment: item.comment || "-",
                isSub: false,
              };

              if (item.sub && Array.isArray(item.sub)) {
                const subItems = item.sub.map((subItem) => {
                  const subValue = subItem.value || "-";

                  return {
                    number: "*",
                    question: `${subItem.question || "-"}`,
                    value: subValue,
                    comment: subItem.comment || "-",
                    isSub: true,
                  };
                });
                return [baseItem, ...subItems];
              }

              return [baseItem];
            });
            return acc;
          }, {});

          setTableData(formattedData);
        } else {
          console.error("Unexpected response format:", responses);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data.");
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
  const handleNextPage = () => {
    const assessmentKeys = Object.keys(tableData);
    const currentIndex = assessmentKeys.indexOf(currentAssessment);

    if (currentIndex < assessmentKeys.length - 1) {
      setCurrentAssessment(assessmentKeys[currentIndex + 1]);
      setCurrentPage(1); // Reset to first page of new assessment
    }
  };

  const handlePrevPage = () => {
    const assessmentKeys = Object.keys(tableData);
    const currentIndex = assessmentKeys.indexOf(currentAssessment);

    if (currentIndex > 0) {
      setCurrentAssessment(assessmentKeys[currentIndex - 1]);
      setCurrentPage(1); // Reset to first page of new assessment
    }
  };

  // Inside your rendering logic
  const currentAssessmentData = tableData[currentAssessment] || []; // Ensure this is correct
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentAssessmentData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const downloadXLSX = () => {
    if (Object.keys(tableData).length > 0) {
      const wb = XLSX.utils.book_new();

      const headerStyle = {
        fill: { fgColor: { rgb: "0000FF" } },
        font: { color: { rgb: "FFFFFF" }, bold: true },
      };

      Object.keys(tableData).forEach((assessment) => {
        const assessmentData = tableData[assessment].filter(
          (item) => !item.isSub
        );
        const ws = XLSX.utils.json_to_sheet(assessmentData);

        // Apply header style
        ws["!rows"] = [{ hpt: 20, hpx: 20 }];
        ws["A1"].s = headerStyle; // Assuming the first header is in A1

        Object.keys(ws).forEach((key) => {
          if (key[0] === "!") return;
          const cell = ws[key];

          if (cell.v === "Iya" || cell.v === "Ideal") {
            cell.s = { fill: { fgColor: { rgb: "00FF00" } } };
          } else if (cell.v === "tidak" || cell.v === "tidak memadai") {
            cell.s = { fill: { fgColor: { rgb: "FF0000" } } };
          } else if (cell.v === "tidak tahu") {
            cell.s = { fill: { fgColor: { rgb: "808080" } } };
          }
        });

        XLSX.utils.book_append_sheet(wb, ws, `Assessment ${assessment}`);
      });

      XLSX.writeFile(wb, `${params.username}_data.xlsx`);
    }
  };
  const columnConfig = [
    { header: "No.", accessor: "number" },
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
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="flex items-center mb-4 text-blue-500"
              >
                <IoMdArrowRoundBack className="mr-2" /> Back to Data Assessment
              </button>
              <button
                onClick={downloadXLSX}
                disabled={currentItems.length === 0}
                className={`bg-white border-accent border-2 text-accent px-4 py-2 rounded flex items-center ${
                  currentItems.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <FaFileDownload className="mr-2" /> Download XLSX
              </button>
            </div>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div>
                {/* Table Component */}
                <Table
                  type={"sub"}
                  columns={columnConfig}
                  data={currentItems}
                />{" "}
                <div className="flex justify-center items-end my-10 gap-x-5">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentAssessment === Object.keys(tableData)[0]} // Disable if on first assessment
                    className="px-4 py-3 bg-accent text-white rounded"
                  >
                    <FaArrowLeft size={15} color="#ffff" />
                  </button>

                  <div className="mt-4">
                    {Object.keys(tableData).map((assessment) => (
                      <button
                        key={assessment}
                        onClick={() => {
                          setCurrentAssessment(assessment);
                          setCurrentPage(1);
                        }}
                        className={`mr-2 px-4 py-2 rounded ${
                          currentAssessment === assessment
                            ? "bg-accent text-white"
                            : "bg-gray-300"
                        }`}
                      >
                        {assessment}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={
                      currentAssessment ===
                      Object.keys(tableData)[Object.keys(tableData).length - 1]
                    }
                    className="px-4 py-3 bg-accent text-white rounded"
                  >
                    <FaArrowRight size={15} color="#ffff" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default View;
