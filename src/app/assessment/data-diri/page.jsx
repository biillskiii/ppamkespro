"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Table from "@/components/table-data";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { IoLogOutOutline } from "react-icons/io5";
import Button from "@/components/button";

const Viewer = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [instansi, setInstansi] = useState("");
  const [status, setStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const response = await fetch("https://103.123.63.7/api/response", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const { metadata } = result.data;

        if (!metadata) {
          console.error("Metadata not found:", result.data);
          return;
        }

        // Set the metadata values
        const formattedData = {
          leader: metadata.leader || "N/A", // Add safe access with optional chaining
          participant: metadata.participants || "N/A",
          date: metadata.date || "N/A",
          area: metadata.area || "N/A",
        };

        setTableData([formattedData]); // Using array since the Table expects an array
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
    router.push("/assessment/viewer");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    router.push("/");
  };

  // Update the column config to reflect the new data structure
  const columnConfig = [
    { header: "Leader", accessor: "leader" },
    { header: "Date", accessor: "date" },
    { header: "Participants", accessor: "participant" },
    { header: "Area", accessor: "area" },
  ];

  return (
    <div>
      <Navbar
        username={username}
        institute={instansi}
        status={status}
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
        <div>
          <h1 className="text-3xl mt-14 font-bold text-center">
            <span>{instansi}</span>
          </h1>
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
