"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Table from "@/components/table";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { IoLogOutOutline } from "react-icons/io5";

const Viewer = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [instansi, setInstansi] = useState("");
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
      }
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const response = await fetch(
          "https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/response",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Fetched Data:", result); // Debugging
        const { data } = result;

        if (!data || !Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
        }

        const processedIds = new Set();

        
        const formattedData = data.flatMap((item) => {
          const { id, number, question, sub } = item;
          if (id > 195) return [];

          // Check if the ID has been processed
          const shouldDisplayId = !processedIds.has(id);
          if (shouldDisplayId) {
            processedIds.add(id);
          }

          if (sub && Array.isArray(sub)) {
            const subedArray = [
              {
                id: id,
                number: "", // No number for non-sub items
                question: item.question || "-",
                value: item.value || "-",
                comment: item.comment || "-",
              },
            ];
            const subArr = sub.map((subItem, subIndex) => ({
              // id: number,
              number: subIndex + 1,
              // question: item.question || "-",
              question: subItem.question || "-",
              value: subItem.value || "-",
              comment: subItem.comment || "-",
            }));
            subedArray.push(...subArr);
            console.log(subedArray);
            return subedArray;
          }
          return [
            {
              id: shouldDisplayId ? id : "", // Display ID only for the first occurrence
              number: "", // No number for non-sub items
              question: item.question || "-", // Use the main question for main items
              value: item.value || "-",
              comment: item.comment || "-",
            },
          ];
        });

        // console.log("Formatted Data:", formattedData); // Debugging
        setTableData(formattedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
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
    setIsLogin(false);
    sessionStorage.removeItem("accessToken");
    router.push("/");
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
        <div className="absolute top-20 z-20 right-[218px] bg-red-500 rounded-b-lg p-4 py-4 w-[176px] ">
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
        <Table type={"sub"} columns={columnConfig} data={tableData} />
      )}
    </div>
  );
};

export default Viewer;
