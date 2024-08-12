"use client";
import React, { useState, useEffect } from "react";
import Question from "@/components/question"; // Pastikan komponen ini sudah terimport dengan benar
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname untuk mendapatkan route saat ini
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import Button from "@/components/button"; // Pastikan komponen ini sudah terimport dengan benar

const Bagian0 = () => {
  const [isDone, setIsDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isData, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null); // State untuk mengontrol accordion
  const router = useRouter();
  const pathname = usePathname(); // Mendapatkan route saat ini

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
            (item) => item.number >= 1 && item.number <= 7
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
    return <div>Loading...</div>; // Tampilkan loading indikator saat data sedang diambil
  }

  return (
    <div className="bg-[#F1F1F7] h-screen overflow-x-hidden">
      <div className="bg-white pl-[31.83px] pt-[32px] w-[296px] h-screen fixed">
        <p
          className="flex items-center gap-x-2 font-medium cursor-pointer"
          onClick={handleBack}
        >
          <IoMdArrowRoundBack size={15} />
          Kembali
        </p>
        <h1 className="mt-8 flex items-center gap-x-2 text-2xl font-semibold">
          <svg
            width="26"
            height="27"
            viewBox="0 0 26 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.58649 10.0324L7.97352 11.4195L10.7476 8.64539M14.2152 10.7259H19.0698M6.58649 16.9676L7.97352 18.3546L10.7476 15.5805M14.2152 17.6611H19.0698M1.29863 17.5661C0.67129 14.8917 0.671291 12.1083 1.29863 9.43391C2.16729 5.73068 5.0588 2.83916 8.76204 1.9705C11.4365 1.34317 14.2198 1.34317 16.8942 1.9705C20.5975 2.83916 23.489 5.73068 24.3576 9.43391C24.985 12.1083 24.985 14.8917 24.3576 17.5661C23.489 21.2693 20.5975 24.1608 16.8942 25.0295C14.2198 25.6568 11.4365 25.6568 8.76204 25.0295C5.05881 24.1608 2.16729 21.2693 1.29863 17.5661Z"
              stroke="#161616"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Assessment
        </h1>
        <div className="mt-2 border-b-2 w-10/12 border-black"></div>

        {/* Bagian 01 */}
        <div
          className={`flex flex-col mt-10 w-10/12 cursor-pointer ${
            pathname === "/assessment/bagian-1" ? "bg-accent rounded-lg" : ""
          }`}
          onClick={() => toggleAccordion("bagian01")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <FaCircleCheck size={24} color={isDone ? "#1446AB" : "#CCC"} />{" "}
              <span>Bagian 01</span>{" "}
            </div>
            {activeAccordion === "bagian01" ? (
              <IoIosArrowDown size={16} />
            ) : (
              <IoIosArrowForward size={16} />
            )}
          </div>
          {activeAccordion === "bagian01" && (
            <div className="pl-6 mt-4">
              {/* Tambahkan item assessment untuk Bagian 01 */}
              <p className="mb-2">Assessment 1</p>
              <p className="mb-2">Assessment 2</p>
              <p className="mb-2">Assessment 3</p>
              <p className="mb-2">Assessment 4</p>
            </div>
          )}
        </div>

        {/* Bagian 02 */}
        <div
          className={`flex flex-col mt-10 w-10/12 cursor-pointer ${
            pathname === "/assessment/bagian-2" ? "bg-accent rounded-lg" : ""
          }`}
          onClick={() => toggleAccordion("bagian02")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <FaCircleCheck size={24} color={isDone ? "#1446AB" : "#CCC"} />{" "}
              <span>Bagian 02</span>{" "}
            </div>
            {activeAccordion === "bagian02" ? (
              <IoIosArrowDown size={16} />
            ) : (
              <IoIosArrowForward size={16} />
            )}
          </div>
          {activeAccordion === "bagian02" && (
            <div className="pl-6 mt-4">
              {/* Tambahkan item assessment untuk Bagian 02 */}
              <a href="/assessment/bagian-2/assessment-1" className="mb-2">
                Assessment 1
              </a>
              <a href="/assessment/bagian-2/assessment-2" className="mb-2">
                Assessment 2
              </a>
              <a href="/assessment/bagian-2/assessment-3" className="mb-2">
                Assessment 3
              </a>
              <a href="/assessment/bagian-2/assessment-4" className="mb-2">
                Assessment 4
              </a>
              <a href="/assessment/bagian-2/assessment-5" className="mb-2">
                Assessment 5
              </a>
              <a href="/assessment/bagian-2/assessment-6" className="mb-2">
                Assessment 6
              </a>
              <a href="/assessment/bagian-2/assessment-7" className="mb-2">
                Assessment 7
              </a>
              <a href="/assessment/bagian-2/assessment-8" className="mb-2">
                Assessment 8
              </a>
              <a href="/assessment/bagian-2/assessment-9" className="mb-2">
                Assessment 9
              </a>
            </div>
          )}
        </div>
      </div>

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
                options={item.choice}
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

export default Bagian0;
