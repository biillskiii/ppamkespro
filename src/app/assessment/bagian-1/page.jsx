"use client";
import React, { useState, useEffect, useRef } from "react";
import Question from "@/components/question";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { jwtDecode } from "jwt-decode";
import { FaSpinner } from "react-icons/fa";
import Sidebar from "@/components/sidebar";
import axios from "axios";

const ParentComponent = () => {
  const [isDone, setIsDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isData, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null;
  const formRef = useRef(null);
  const [isPushed, setIsPushed] = useState(false);
  const [activeId, setActiveId] = useState("/assessment/bagian-1/");
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        setUsername(decodedToken.username || "");
        setStatus(decodedToken.status || "");
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    setLoading(true);
    fetch("http://103.123.63.7/api/instrument")
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

          const filteredData = data.filter(
            (item) => item.number >= 1 && item.number <= 7
          );

          console.log("Filtered Data:", filteredData);

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

  const handleBack = () => {
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
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      const mapData = [
        {
          instrumentId: 1,
          value: data["input-1"],
          score: 0,
          comment: data["input-1_comment"],
        },
        {
          instrumentId: 2,
          value: data["input-2"],
          score: 0,
          comment: data["input-2_comment"],
        },
        {
          instrumentId: 3,
          value: data["input-3"],
          score: 0,
          comment: data["input-3_comment"],
        },
        {
          instrumentId: 4,
          value: data["input-4"],
          score: 0,
          comment: data["input-4_comment"],
        },
        {
          instrumentId: 5,
          value: data["input-5"],
          score: 0,
          comment: data["input-5_comment"],
        },
        {
          instrumentId: 6,
          value: data["input-6"],
          score: 0,
          comment: data["input-6_comment"],
        },
        {
          instrumentId: 7,
          value: data["input-7"],
          score: 0,
          comment: data["input-7_comment"],
        },
      ];

      const response = await axios.post(
        "http://103.123.63.7/api/response",
        mapData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        router.push("/assessment/bagian-1/assessment-2");
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
          // action=""
          ref={formRef}
          onSubmit={(e) => {
            onSubmit(e);
            setIsPushed(true);
          }}
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
              // type="button"
            />
            <Button
              label={"Berikutnya"}
              // onClick={handleNext}
              withIcon={"right"}
              // variant={!isDone && "disabeled"}
              // disabled={!isDone}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentComponent;
