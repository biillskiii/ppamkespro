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

    fetch("https://ppamkespro.com/api/instrument/area")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((responseData) => {
        setDataArea(responseData.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
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
  //         "https://ppamkespro.com/api/response",
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

      const formattedDate = formatISO(new Date(data["date"]));

      // Prepare data to be sent to the API, omitting data["area"]
      const mapData = {
        leader: data["leader_comment"] || "", // Ensure default value or validation
        participant: data["participant_comment"] || "",
        date: formattedDate || "",
        province: `Provinsi ${data["area_sub_nasional"]} ` || "",
        city: `Kota ${data["area_city"]}`,
      };

      const response = await axios.post(
        "https://ppamkespro.com/api/response/metadata",
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

      <div className="container w-[1048px] ml-[344px] space-y-6 p-4">
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
          <div className="flex w-[1048px] gap-x-4 ">
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
            placeholder={"Masukan nama Provinsi atau Kabupaten/Kota..."}
            name={"area"}
            type={"dropdown"}
            options={["Nasional", "Sub Nasional"]}
            suggestions={isDataArea}
            selectedValue={selectedOption}
            setSelectedValue={setSelectedOption}
            onChange={(name, value) => {
              setAnswers((prev) => ({ ...prev, [name]: value }));
            }}
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
