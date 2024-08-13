"use client";
import React, { useState, useEffect } from "react";
import Question from "@/components/question"; // Pastikan komponen ini sudah terimport dengan benar
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import Button from "@/components/button"; // Pastikan komponen ini sudah terimport dengan benar
import Sidebar from "@/components/sidebar";

const ParentComponent = () => {
  const [isDone, setIsDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isData, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  // Effect untuk mengambil data dari API
  useEffect(() => {
    setLoading(true); // Menandai bahwa data sedang diambil
    fetch("https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/instrument")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((responseData) => {
        console.log("Data fetched:", responseData); // Log data yang diambil

        if (responseData && Array.isArray(responseData.data)) {
          const data = responseData.data;

          // Filter data untuk mengambil hanya item dengan ID antara 1-7
          const filteredData = data.filter(
            (item) => item.number >= 14 && item.number <= 17
          );

          console.log("Filtered Data:", filteredData); // Log data yang telah difilter

          setData(filteredData); // Set data ke state
        } else {
          console.error("Invalid data format received:", responseData);
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false); // Selesai mengambil data
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
        "http://127.0.0.1:3001/instrument",
        answers
      );

      if (response.status === 200) {
        router.push("/assessment/bagian-1");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Tampilkan loading indikator saat data sedang diambil
  }

  return (
    <div className="bg-[#F1F1F7] h-screen overflow-x-hidden">
      <Sidebar activeId={2} />
      <div className="w-full ml-[344px] space-y-6 p-4">
        <div className="bg-[#1446AB] p-4 rounded-2xl w-[1048px] h-[115px]">
          <p className="text-white font-extrabold text-xl">
            Bagian II—Kesiapan Memberikan Layanan sebagaimana Diuraikan dalam
            PPAM
          </p>
          <hr className="w-full my-4 mx-auto" />
          <p className="font-medium text-base text-white">
            PPAM 3: MENCEGAH PENULARAN DAN MENGURANGI KESAKITAN DAN KEMATIAN
            AKIBAT HIV DAN IMS LAINNYA
          </p>
        </div>
        <form action="" className="flex flex-col gap-y-5">
          {isData.map((item, index) => (
            <div key={index} className="">
              <Question
                type={item.type}
                label={item.question}
                name={`input-${item.number}`}
                options={item.choice.map((choice) =>
                  typeof choice === "object"
                    ? { value: choice.value, label: choice.label }
                    : { value: choice, label: choice }
                )}
                placeholder="Komentar/Referensi/Rincian..."
                onChange={(value) =>
                  handleInputChange(`input-${item.number}`, value)
                }
              />
            </div>
          ))}

          <div className="flex items-center ml-80 my-10 gap-x-5 w-3/12">
            <Button
              label={"Sebelumnya"}
              onClick={handleBack}
              withIcon={"left"}
              variant="secondary"
            />
            <Button
              label={"Berikutnya"}
              onClick={handleNext}
              withIcon={"right"}
              disabled={!isDone}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentComponent;
