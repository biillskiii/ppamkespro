"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Table from "@/components/table";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { IoLogOutOutline } from "react-icons/io5";
import Button from "@/components/button";

const Viewer = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    console.log("Component mounted");
    const token = sessionStorage.getItem("accessToken");
    console.log("Token:", token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username || "");
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
        console.log("Fetching data");
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
        console.log("Fetched Data:", result);
        const { data } = result;

        if (!data || !Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
        }

        const filteredData = data.filter((item) => item.number <= 0);

        const formattedData = filteredData.map((item) => {
          const question = item.question || "-";
          return {
            question: question,
            value: item.value || "-",
            comment: item.comment || "-",
          };
        });

        console.log("Formatted Data:", formattedData);
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

  const handleResult = () => {
    router.push("/viewer");
    console.log("Button clicked");
  };

  const handleLogout = () => {
    setIsLogin(false);
    sessionStorage.removeItem("accessToken");
    router.push("/");
  };

  const columnConfig = [
    { accessor: "question" },
    { accessor: "value" },
    { accessor: "comment" },
  ];

  return (
    <div>
      <Navbar username={username} status={status} onClick={handleOpenLogout} />
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
        <div>
          <Table columns={columnConfig} data={tableData} />
          <div className="w-32 mx-auto z-52">
            <Button
              label={"Lihat Hasil"}
              onClick={handleResult}
              variant="primary"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Viewer;
