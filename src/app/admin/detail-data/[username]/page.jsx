"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import Table from "@/components/table"; // Assuming you have a table component
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { IoMdArrowRoundBack } from "react-icons/io";

const DetailData = ({ params }) => {
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
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const response = await axios.get(
          `http://103.123.63.7/api/response/${params.username}`, // Fetching data based on username
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
    router.push("/admin/data-assessment");
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
      <div className="p-8">
        <button
          onClick={handleBack}
          className="flex items-center mb-4 text-blue-500"
        >
          <IoMdArrowRoundBack className="mr-2" /> Back to Data Assessment
        </button>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table type={"sub"} data={tableData} columns={columnConfig} />
        )}
      </div>
    </div>
  );
};

export default DetailData;
