"use client";
import React, { useState, useEffect, useRef } from "react";
import Question from "@/components/question";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { jwtDecode } from "jwt-decode"; // Adjust the import to `jwt-decode` for proper usage
import { FaSpinner } from "react-icons/fa";
import Sidebar from "@/components/sidebar";
import axios from "axios";

const ParentComponent = () => {
  const [isDone, setIsDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isData, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef(null);
  const [isPushed, setIsPushed] = useState(false);
  const [activeId, setActiveId] = useState("/assessment/bagian-1/");

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    setLoading(true);
    fetch("https://ppamkespro.com/api/instrument")
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
            (item) => item.number >= 1 && item.number <= 7 && item.topicId > 0
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
  }, []);
  useEffect(() => {
    if (isData.length > 0) {
      const allAnswered = isData.every(
        (item) => answers[`input-${item.number}`]
      );
      setIsDone(allAnswered);
    }
  }, [answers, isData]);

  const handleBack = (e) => {
    e.preventDefault();
    router.push("/assessment/bagian-0");
  };

  const handleInputChange = (name, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsPushed(true);

      // Fetch the token from sessionStorage
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found in sessionStorage");
      }

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      const mapData = [
        {
          instrumentId: 203,
          value: data["input-1"],
          score: 0,
          comment: data["input-1_comment"],
        },
        {
          instrumentId: 204,
          value: data["input-2"],
          score: 0,
          comment: data["input-2_comment"],
        },
        {
          instrumentId: 205,
          value: data["input-3"],
          score: 0,
          comment: data["input-3_comment"],
        },
        {
          instrumentId: 206,
          value: data["input-4"],
          score: 0,
          comment: data["input-4_comment"],
        },
        {
          instrumentId: 207,
          value: data["input-5"],
          score: 0,
          comment: data["input-5_comment"],
        },
        {
          instrumentId: 208,
          value: data["input-6"],
          score: 0,
          comment: data["input-6_comment"],
        },
        {
          instrumentId: 209,
          value: data["input-7"],
          score: 0,
          comment: data["input-7_comment"],
        },
      ];

      const response = await axios.post(
        "https://ppamkespro.com/api/response",
        mapData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setIsPushed(true);
        router.push("/assessment/bagian-1/assessment-2");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setIsPushed(false);
    }
  };

  const handleNext = async () => {
    try {
      const response = await fetch("https://ppamkespro.com/api/response", {
        method: "POST",
        body: JSON.stringify(answers),
      });

      if (response.ok) {
        router.push("/assessment/bagian-1/assessment2");
      } else {
      }
    } catch (error) {
      console.error("Failed to submit data. Please try again.");
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

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <FaSpinner className="animate-spin text-accent" size={50} />
      </div>
    );
  }

  return (
    <div className="bg-[#F1F1F7] h-screen overflow-x-hidden">
      <Sidebar
        activeId={activeId}
        setActiveId={setActiveId}
        onClick={handleSidebarClick}
      />
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
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="flex flex-col gap-y-5"
        >
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
                subquestions={item.sub || []}
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
            <Button label={"Berikutnya"} withIcon={"right"} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentComponent;
