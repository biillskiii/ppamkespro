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
        const { data } = result;

        if (!data || !Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
        }

        // Mengatur data berdasarkan ID question
        const questions = {
          196: { question: "", value: "", comment: "" },
          197: { question: "", value: "", comment: "" },
          198: { question: "", value: "", comment: "" },
          199: { question: "", value: "", comment: "" },
        };

        data.forEach((item) => {
          if (questions[item.id]) {
            questions[item.id].question = item.question || "";
            questions[item.id].value = item.value || "";
            questions[item.id].comment = item.comment || "";
          }
        });

        const formattedData = [
          {
            header1: questions[196].question,
            header2: questions[197].question,
            header3: questions[198].question,
            header4: questions[199].question,
          },
          {
            col5: `${questions[196].value} ${questions[196].comment}`,
            col6: `${questions[197].value}  ${questions[197].comment}`,
            col7: `${questions[198].value}  ${questions[198].comment}`,
            col8: `${questions[199].value}  ${questions[199].comment}`,
          },
        ];

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
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    router.push("/");
  };

  const columnConfig = [
    { header: "header1", accessor: "col5" },
    { header: "header2", accessor: "col6" },
    { header: "header3", accessor: "col7" },
    { header: "header4", accessor: "col8" },
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
            Data, <span>{username}</span> <span>{instansi}</span>
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
