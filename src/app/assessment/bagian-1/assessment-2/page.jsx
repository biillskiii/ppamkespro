"use client";
import React, { useState, useEffect } from "react";
import Question from "@/components/question"; // Ensure this component is correctly imported
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import Button from "@/components/button"; // Ensure this component is correctly imported
import Sidebar from "@/components/sidebar";
import { FaSpinner } from "react-icons/fa";

const ParentComponent = () => {
  const [isDone, setIsDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isData, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  // Effect to fetch data from API
  useEffect(() => {
    setLoading(true); // Mark that data is being fetched
    fetch("https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/instrument")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((responseData) => {
        console.log("Data fetched:", responseData);

        if (responseData && Array.isArray(responseData.data)) {
          const data = responseData.data;

          // Filter data to get only items with ID between 14-17
          const filteredData = data.filter(
            (item) => item.number >= 8 && item.number <= 13
          );

          console.log("Filtered Data:", filteredData);

          setData(filteredData); // Set data to state
        } else {
          console.error("Invalid data format received:", responseData);
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false); // Finished fetching data
      });
  }, []);

  // Effect to check if all questions have been answered
  useEffect(() => {
    if (isData.length > 0) {
      const allAnswered = isData.every((item) => {
        if (item.type === "sub") {
          return item.sub.every((sub) => answers[`input-${sub.id}`]);
        }
        return answers[`input-${item.number}`];
      });
      setIsDone(allAnswered);
    }
  }, [answers, isData]);

  const handleBack = () => {
    router.push("/assessment");
  };

  const handleInputChange = (name, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value, // Save the input value
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
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <FaSpinner className="animate-spin text-accent" size={50} />
      </div>
    ); // Show loading indicator while data is being fetched
  }

  return (
    <div className="bg-[#F1F1F7] h-screen overflow-x-hidden">
      <Sidebar activeId={2} />
      <div className="w-full ml-[344px] space-y-6 p-4">
        <div className="bg-[#1446AB] p-4 rounded-2xl w-[1048px] h-[115px]">
          <p className="text-white font-extrabold text-xl">
            BAGIAN I—KESIAPAN KESELURUHAN TINGKAT NASIONAL: KEBIJAKAN,
            KOORDINASI DAN SUMBER DAYA
          </p>
          <hr className="w-full my-4 mx-auto" />
          <p className="uppercase font-medium text-base text-white">
            Mekanisme Koordinasi Penanggulangan Bencana berkaitan dengan kespro
          </p>
        </div>
        <form action="" className="flex flex-col gap-y-5">
          {isData.map((item, index) => (
            <div key={index} className="">
              <Question
                type={item.type}
                no={item.number}
                label={item.question}
                name={`input-${item.number}`}
                options={
                  item.choice
                    ? item.choice.map((choice) => ({
                        value: choice.value,
                        label: choice.value,
                      }))
                    : []
                }
                placeholder="Komentar/Referensi/Rincian..."
                onChange={(name, value) => handleInputChange(name, value)}
                subname={item.subname}
                subquestions={item.sub || []} // Pass subquestions if any
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
