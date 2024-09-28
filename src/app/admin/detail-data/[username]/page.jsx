"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import Table from "@/components/table";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  FaFileDownload,
  FaClipboardList,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { FaUserGear } from "react-icons/fa6";
import Link from "next/link";
import * as XLSX from "xlsx";

const DetailData = ({ params }) => {
  const [tableData, setTableData] = useState({});
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
        if (userRole !== "admin") {
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

  // Ensure safe access to current assessment data
  const currentAssessmentData = Array.isArray(tableData[currentAssessment])
    ? tableData[currentAssessment]
    : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentAssessmentData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
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


  const downloadXLSX = () => {
    if (Object.keys(tableData).length > 0) {
      const wb = XLSX.utils.book_new();

      Object.keys(tableData).forEach((assessment) => {
        const assessmentData = tableData[assessment];
        const ws = XLSX.utils.json_to_sheet(assessmentData);
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
    <div className="flex flex-col w-full min-h-screen">
      <Navbar />
      <div className="flex">
        <div className="w-80 bg-white">
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
          </nav>
        </div>
        <div className="flex w-full flex-col bg-gray-100 p-8">
          <div className="flex justify-between">
            <button
              onClick={() => router.push("/admin/data-assessment")}
              className="flex items-center mb-4 text-accent font-semibold px-3 py-2 rounded-md bg-white border-2 border-accent "
            >
              <IoMdArrowRoundBack className="mr-2" /> Back
            </button>
            <button
              onClick={downloadXLSX}
              disabled={currentItems.length === 0}
              className={`bg-white border-accent border-2 text-accent px-4 py-2 rounded flex items-center ${
                currentItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FaFileDownload className="mr-2" /> Download XLSX
            </button>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <Table type={"sub"} data={currentItems} columns={columnConfig} />
              <div className="flex justify-center items-end gap-x-5">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailData;
