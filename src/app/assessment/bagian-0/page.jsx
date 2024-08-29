"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/button";
import Question0 from "@/components/q-bagian-0";
import DatePicker from "@/components/datepicker";
import Sidebar from "@/components/sidebar";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

const Bagian0 = () => {
  const [answers, setAnswers] = useState({});
  const [isData, setData] = useState([]);
  const [isDataArea, setDataArea] = useState({});
  const [isDataAreaLevel, setDataAreaLevel] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null;
  const formRef = useRef(null);
  const [isPushed, setIsPushed] = useState(false);
  const [activeId, setActiveId] = useState("/assessment/bagian-0/");

  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:3001/instrument")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((responseData) => {
        console.log("Data instrument fetched:", responseData);

        if (responseData && Array.isArray(responseData.data)) {
          const data = responseData.data;
          const filteredData = data.filter(
            (item) => item.number >= 1 && item.number <= 7
          );
          console.log("Filtered Data:", filteredData); // Log data yang telah difilter
          setData(filteredData);
        } else {
          console.error("Invalid data format received:", responseData);
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });

    fetch("https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/instrument/area")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((responseData) => {
        console.log("Data area fetched:", responseData);
        setDataArea(responseData.data);
        const transformed = Object.keys(responseData.data).map((key) => ({
          value: key,
        }));
        setDataAreaLevel(transformed);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (isData.length > 0) {
      const allAnswered = isData.every((item) => answers[`input-${item.id}`]);
      setIsDone(allAnswered);
    }
  }, [answers, isData]);

  const handleBack = () => {
    router.push("/assessment");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <FaSpinner className="animate-spin text-accent" size={50} />
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsPushed(true);
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      const mapData = [
        {
          instrumentId: 196,
          value: null,
          score: 0,
          comment: data.pemipin_comment,
        },
        {
          instrumentId: 197,
          value: data.tanggal,
          score: 0,
          comment: null,
        },
        {
          instrumentId: 198,
          value: data.tingkat,
          score: 0,
          comment: data.tingkat_comment,
        },
        {
          instrumentId: 199,
          value: null,
          score: 0,
          comment: data.peserta_comment,
        },
      ];

      const response = await axios.post(
        "https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/response",
        mapData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        router.push("/assessment/bagian-1");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setIsPushed(false);
    }
  };

  const handleSidebarClick = () => {
    if (formRef.current) {
      setIsPushed(false);
      formRef.current.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  };

  return (
    <div className="bg-[#F1F1F7] h-screen overflow-x-hidden">
      <Sidebar
        activeId={activeId}
        setActiveId={setActiveId}
        onClick={handleSidebarClick}
      />

      <div className="w-full ml-[344px] space-y-6 p-4">
        <div className="bg-[#1446AB] pl-4 py-4 rounded-2xl w-[1048px] ">
          <p className="text-white font-extrabold text-xl">
            Bagian 0 - Informasi umum
          </p>
        </div>
        <form
          // action=""
          ref={formRef}
          onSubmit={(e) => {
            onSubmit(e);
            setIsPushed(true);
          }}
          className="flex flex-col gap-y-5"
        >
          <div className="flex w-[70%] gap-x-4 ">
            <Question0
              label={"Siapa yang Memimpin Penilaian?"}
              type={"text"}
              placeholder={"Nama pemimpin penilaian..."}
              name={"pemipin"}
              // onChange={{}}
            />
            <DatePicker name="tanggal" />
          </div>

          <Question0
            label={"Pada tingkat apa penilaian dilakukan?"}
            placeholder={
              "Masukan nama Provinsi (Jika Tingkat Nasional), Kabupaten/Kota (Jika Tingkat Sub Nasional)..."
            }
            name={"tingkat"}
            type={"dropdown"}
            options={isDataAreaLevel}
            suggestions={isDataArea[selectedLevel]}
            selectedValue={selectedLevel}
            setSelectedValue={setSelectedLevel}
            // onChange={{}}
          />

          <Question0
            label={"Peserta yang terlibat dalam penilaian?"}
            placeholder={"Nama peserta penilaian..."}
            name={"peserta"}
            type={"text"}
            // options={{}}
            // onChange={{}}
          />

          <div className="flex  items-center ml-80 my-10 gap-x-5 w-3/12">
            <Button
              label={"Sebelumnya"}
              onClick={handleBack}
              withIcon={"left"}
              variant="disabled"
              type="button"
              disabled
            />
            <Button
              label={"Berikutnya"}
              // onClick={handleNext}
              withIcon={"right"}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bagian0;
