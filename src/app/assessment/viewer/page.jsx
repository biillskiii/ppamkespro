"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Table from "@/components/table";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { IoLogOutOutline } from "react-icons/io5";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import axios from "axios";
const Viewer = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [currentAssessment, setCurrentAssessment] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [itemsPerPage] = useState(50);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [instansi, setInstansi] = useState("");
  const [error, setError] = useState(null);
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username || "");
        setInstansi(decodedToken.institute || "");
        setStatus(decodedToken.status || "");
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
          `https://ppamkespro.com/api/response`,
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
    fetchData();
  }, []);

  const handleOpenLogout = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    router.push("/");
  };
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
      setCurrentPage(1);
    }
  };

  const handlePrevPage = () => {
    const assessmentKeys = Object.keys(tableData);
    const currentIndex = assessmentKeys.indexOf(currentAssessment);

    if (currentIndex > 0) {
      setCurrentAssessment(assessmentKeys[currentIndex - 1]);
      setCurrentPage(1);
    }
  };

  const columnConfig = [
    { header: "No.", accessor: "number" },
    { header: "Pertanyaan", accessor: "question" },
    { header: "Jawaban", accessor: "value" },
    { header: "Komentar", accessor: "comment" },
  ];

  return (
    <div className="-z-50">
      <Navbar
        username={username}
        status={status}
        institute={instansi}
        onClick={handleOpenLogout}
      />
      {isOpen && (
        <div className="absolute top-20 z-20 right-[218px] bg-red-500 rounded-b-lg p-4 py-4 w-[176px]">
          <p
            className="text-base flex items-center justify-between cursor-pointer text-white font-semibold"
            onClick={handleLogout}
          >
            Keluar
            <IoLogOutOutline size={15} />
          </p>
        </div>
      )}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table type={"sub"} columns={columnConfig} data={currentItems} />
          <div className="flex justify-center items-end m-10 gap-x-5">
            <button
              onClick={handlePrevPage}
              disabled={Object.keys(tableData).indexOf(currentAssessment) === 0}
              className="px-4 py-3 bg-blue-500 text-white rounded"
            >
              <FaArrowLeft size={15} color="#ffff" />
            </button>

            <div className="mt-4">
              {Object.keys(tableData).map((assessment) => (
                <button
                  key={assessment}
                  onClick={() => {
                    setCurrentAssessment(assessment);
                    setCurrentPage(1); // Reset page to 1 when changing assessment
                  }}
                  className={`mr-2 px-4 py-2 rounded ${
                    currentAssessment === assessment
                      ? "bg-blue-500 text-white"
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
                Object.keys(tableData).indexOf(currentAssessment) ===
                Object.keys(tableData).length - 1
              }
              className="px-4 py-3 bg-blue-500 text-white rounded"
            >
              <FaArrowRight size={15} color="#ffff" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Viewer;
