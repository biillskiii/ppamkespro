"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/button";
import Question0 from "@/components/q-bagian-0";
import DatePicker from "@/components/datepicker";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import { formatISO } from "date-fns";
const Bagian0 = () => {
  const [answers, setAnswers] = useState({});
  const [isData, setData] = useState([]);
  const [isDataArea, setDataArea] = useState({});
  const [isDataAreaLevel, setDataAreaLevel] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [activeId, setActiveId] = useState("/assessment/bagian-0/");
  const [isLoading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null;
  const formRef = useRef(null);
  const [isPushed, setIsPushed] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const dropdownOptions = isDataAreaLevel.map((item) => ({
    value: item.value,
    label: item.name,
  }));
  useEffect(() => {
    setLoading(true);

    fetch("https://103.123.63.7/api/instrument")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((responseData) => {
        if (responseData && Array.isArray(responseData.data)) {
          const data = responseData.data;
          const filteredData = data.filter(
            (item) => item.number >= 1 && item.number <= 7
          );

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

    fetch("https://103.123.63.7/api/instrument/area")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((responseData) => {
        setDataArea(responseData.data);
        const transformed = Object.keys(responseData.data).map((key) => ({
          value: key,
          name: responseData.data[key].name,
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

  // const handleNext = async () => {
  //   try {
  //     if (formRef.current) {
  //       formRef.current.dispatchEvent(
  //         new Event("submit", { bubbles: true, cancelable: true })
  //       );
  //     }

  //     if (isDone) {
  //       const response = await axios.post(
  //         "https://103.123.63.7/api/response",
  //         answers,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );

  //       if (response.status === 200) {
  //         router.push("/assessment/bagian-1");
  //       }
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error posting data:",
  //       error.response ? error.response.data : error.message
  //     );
  //   }
  // };
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsPushed(true);
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      // Debug: log data dari form

      // Convert date to ISO 8601 format
      const formattedDate = formatISO(new Date(data["date"]));

      // Construct the mapData object with the correct values
      const mapData = {
        leader: data["leader_comment"] || "", // Ensure default value or validation
        participant: data["participant_comment"] || "",
        date: formattedDate || "", // Ensure this is in ISO string format
        area: data["area_comment"] || "",
      };
      const response = await axios.post(
        "https://103.123.63.7/api/response/metadata",
        mapData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        router.push("/assessment/bagian-1");
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
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
              name={"leader"}
            />
            <DatePicker name="date" />
          </div>

          <Question0
            label={"Pada tingkat apa penilaian dilakukan?"}
            placeholder={
              isDataArea[selectedLevel]?.name ||
              "Masukan nama Provinsi atau Kabupaten/Kota..."
            }
            name={"area"}
            type={"dropdown"}
            options={isDataAreaLevel.map((item) => item.value)}
            suggestions={isDataArea[selectedOption]}
            selectedValue={selectedOption}
            setSelectedValue={setSelectedOption}
          />

          <Question0
            label={"Peserta yang terlibat dalam penilaian?"}
            placeholder={"Nama peserta penilaian..."}
            name={"participant"}
            type={"text"}
          />

          <div className="flex items-center ml-80 my-10 gap-x-5 w-3/12">
            <Button
              label={"Sebelumnya"}
              onClick={handleBack}
              withIcon={"left"}
              variant="disabled"
              type="button"
              disabled
            />
            <Button label={"Berikutnya"} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bagian0;
