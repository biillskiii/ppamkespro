"use client";
import React, { useState, useEffect } from "react";
import Question from "@/components/question"; // Pastikan komponen ini sudah terimport dengan benar
import { useRouter } from "next/navigation";
import Button from "@/components/button"; // Pastikan komponen ini sudah terimport dengan benar
import { jwtDecode } from "jwt-decode";
import { FaSpinner } from "react-icons/fa";
import Sidebar from "@/components/sidebar";
const ParentComponent = () => {
  const [isDone, setIsDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isData, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [username, setUsername] = useState("");
  const router = useRouter();
  useEffect(() => {
    // Mengambil accessToken dari localStorage

    const token = sessionStorage.getItem("accessToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Debugging line
        setUsername(decodedToken.username || "");
        setStatus(decodedToken.status || "");
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      router.push("/login");
    }
  }, [router]);
  // Effect untuk mengambil data dari API
  useEffect(() => {
    setLoading(true); // Menandai bahwa data sedang diambil
    fetch("https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/instrument") // Pastikan URL ini benar
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

          // Filter data untuk mengambil hanya item dengan ID antara 8-13
          const filteredData = data.filter(
            (item) => item.number >= 8 && item.number <= 13
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
  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };
  // Effect untuk memeriksa apakah semua pertanyaan telah dijawab
  useEffect(() => {
    if (isData.length > 0) {
      const allAnswered = isData.every(
        (item) => answers[`input-${item.number}`]
      );
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
      const response = await fetch(
        "https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/response",
        {
          // Pastikan URL ini benar
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(answers), // Mengirim data dalam format JSON
        }
      );

      if (response.ok) {
        router.push("/assessment/bagian-1/assessment2");
      } else {
        console.error("Error posting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <FaSpinner className="animate-spin text-accent" size={50} />
      </div>
    ); // Tampilkan loading indikator saat data sedang diambil
  }

  return (
    <div className="bg-[#F1F1F7] h-screen overflow-x-hidden">
      <Sidebar activeId={1} />
      <div className="w-full ml-[344px] space-y-6 p-4">
        <div className="bg-[#1446AB] p-4 rounded-2xl w-[1048px] h-[115px]">
          <p className="text-white font-extrabold text-xl">
            BAGIAN I—KESIAPAN KESELURUHAN TINGKAT NASIONAL: KEBIJAKAN,
            KOORDINASI DAN SUMBER DAYA
          </p>
          <hr className="w-full my-4 mx-auto" />
          <p className="uppercase font-medium text-base text-white">
            Kebijakan dan Rencana Penanggulangan Bencana Nasional dan Daerah
          </p>
        </div>
        <form action="" className="flex flex-col gap-y-5">
          {isData.map((item, index) => (
            <div key={index}>
              <Question
                type={item.type}
                label={item.question}
                name={`input-${item.number}`}
                options={(Array.isArray(item.choice) ? item.choice : []).map(
                  (choice) =>
                    typeof choice === "object"
                      ? { value: choice.value }
                      : { value: choice }
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
