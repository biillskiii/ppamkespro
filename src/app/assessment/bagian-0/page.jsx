"use client";
import React, { useState, useEffect } from "react";
import Question from "@/components/question"; // Pastikan komponen ini sudah terimport dengan benar
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname untuk mendapatkan route saat ini
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import Button from "@/components/button"; // Pastikan komponen ini sudah terimport dengan benar
import Question0 from "@/components/q-bagian-0";
import DatePicker from "@/components/datepicker";
import Sidebar from "@/components/sidebar";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";

const Bagian0 = () => {
  const [isDone, setIsDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isData, setData] = useState([]);
  const [isDataArea, setDataArea] = useState({});
  const [isDataAreaLevel, setDataAreaLevel] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null); // State untuk mengontrol accordion
  const router = useRouter();
  const pathname = usePathname(); // Mendapatkan route saat ini
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null;

  // Effect untuk mengambil data dari API
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

  // Effect untuk memeriksa apakah semua pertanyaan telah dijawab
  useEffect(() => {
    if (isData.length > 0) {
      const allAnswered = isData.every((item) => answers[`input-${item.id}`]);
      setIsDone(allAnswered);
    }
  }, [answers, isData]);

  const handleBack = () => {
    router.push("/assessment");
  };

  const handleInputChange = (name, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value, // Menyimpan nilai input yang dipilih
    }));
  };

  const handleNext = async () => {
    try {
      const response = await axios.post(
        "https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/instrument",
        answers
      );

      if (response.status === 200) {
        router.push("/assessment/bagian-1");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <FaSpinner className="animate-spin text-accent" size={50} />
      </div>
    ); // Tampilkan loading indikator saat data sedang diambil
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
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
    }
  };

  return (
    <div className="bg-[#F1F1F7] h-screen overflow-x-hidden">
      <Sidebar activeId={0} />

      <div className="w-full ml-[344px] space-y-6 p-4">
        <div className="bg-[#1446AB] pl-4 py-4 rounded-2xl w-[1048px] ">
          <p className="text-white font-extrabold text-xl">
            Bagian 0 - Informasi umum
          </p>
        </div>
        <form
          // action=""
          onSubmit={onSubmit}
          className="flex flex-col gap-y-5"
        >
          <div className="flex w-[70%] gap-x-4 ">
            <Question0
              label={"1. Siapa yang Memimpin Penilaian?"}
              type={"text"}
              placeholder={"Nama pemimpin penilaian..."}
              name={"pemipin"}
              // onChange={{}}
            />
            <DatePicker
              // label={"2. Tanggal Penilaian"}
              name="tanggal"
              
            />
          </div>

          <Question0
            label={"3. Pada tingkat apa penilaian dilakukan?"}
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
            label={"4. Peserta yang terlibat dalam penilaian?"}
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
