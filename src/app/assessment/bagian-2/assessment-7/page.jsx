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
  const [activeId, setActiveId] = useState("/assessment/bagian-2/assessment-7");
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
      
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
      

        if (responseData && Array.isArray(responseData.data)) {
          const data = responseData.data;

          const filteredData = data.filter(
            (item) => item.number >= 58 && item.number <= 62
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
  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  useEffect(() => {
    if (isData.length > 0) {
      const allAnswered = isData.every(
        (item) => answers[`input-${item.number}`]
      );
      setIsDone(allAnswered);
    }
  }, [answers, isData]);

  const handleBack = () => {
    router.push("/assessment/bagian-2/assessmnet-6");
  };

  const handleInputChange = (name, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    try {
      const response = await fetch("http://103.123.63.7/api/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      if (response.ok) {
        router.push("/assessment/bagian-1/assessment2");
      } else {
        console.error("Error posting data:", response.statusText);
      }
    } catch (error) {
      toast.error("Failed to submit data. Please try again.");
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

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsPushed(true);
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const getArrayValues = (prefix) => {
        const values = [];
        let index = 0;
        while (data[`${prefix}-${index}`] !== undefined) {
          values.push(data[`${prefix}-${index}`]);
          index++;
        }
        return values;
      };
      const mapData = [
        {
          instrumentId: 138,
          value: null,
          score: 0,
          comment: data["input-58_comment"],
        },
        {
          instrumentId: 139,
          value: data["input-59"],
          score: 0,
          comment: data["input-59_comment"],
        },
        {
          instrumentId: 141,
          value: getArrayValues("input-60_sub_141"),
          score: 0,
          comment: `${data["input-60_comment_sub_141"]}`,
        },
        {
          instrumentId: 142,
          value: getArrayValues("input-60_sub_142"),
          score: 0,
          comment: `${data["input-60_comment_sub_142"]}`,
        },
        {
          instrumentId: 143,
          value: getArrayValues("input-60_sub_143"),
          score: 0,
          comment: `${data["input-60_comment_sub_143"]}`,
        },
        {
          instrumentId: 144,
          value: getArrayValues("input-60_sub_144"),
          score: 0,
          comment: `${data["input-60_comment_sub_144"]}`,
        },
        {
          instrumentId: 145,
          value: getArrayValues("input-60_sub_145"),
          score: 0,
          comment: `${data["input-60_comment_sub_145"]}`,
        },
        {
          instrumentId: 146,
          value: getArrayValues("input-60_sub_146"),
          score: 0,
          comment: `${data["input-60_comment_sub_146"]}`,
        },
        {
          instrumentId: 147,
          value: getArrayValues("input-60_sub_147"),
          score: 0,
          comment: `${data["input-60_comment_sub_147"]}`,
        },
        {
          instrumentId: 148,
          value: getArrayValues("input-60_sub_148"),
          score: 0,
          comment: `${data["input-60_comment_sub_148"]}`,
        },
        {
          instrumentId: 149,
          value: getArrayValues("input-60_sub_149"),
          score: 0,
          comment: `${data["input-60_comment_sub_149"]}`,
        },
        {
          instrumentId: 150,
          value: getArrayValues("input-60_sub_150"),
          score: 0,
          comment: `${data["input-60_comment_sub_150"]}`,
        },
        {
          instrumentId: 152,
          value: `${data["input-61_sub_152"]}`,
          score: 0,
          comment: `${data["input-61_comment_sub_152"]}`,
        },
        {
          instrumentId: 153,
          value: `${data["input-61_sub_153"]}`,
          score: 0,
          comment: `${data["input-61_comment_sub_153"]}`,
        },
        {
          instrumentId: 154,
          value: `${data["input-61_sub_154"]}`,
          score: 0,
          comment: `${data["input-61_comment_sub_154"]}`,
        },
        {
          instrumentId: 155,
          value: `${data["input-61_sub_155"]}`,
          score: 0,
          comment: `${data["input-61_comment_sub_155"]}`,
        },
        {
          instrumentId: 156,
          value: `${data["input-61_sub_156"]}`,
          score: 0,
          comment: `${data["input-61_comment_sub_156"]}`,
        },
        {
          instrumentId: 157,
          value: `${data["input-61_sub_157"]}`,
          score: 0,
          comment: `${data["input-61_comment_sub_157"]}`,
        },
        {
          instrumentId: 158,
          value: `${data["input-61_sub_158"]}`,
          score: 0,
          comment: `${data["input-61_comment_sub_158"]}`,
        },
        {
          instrumentId: 160,
          value: `${data["input-62_sub_160"]}`,
          score: 0,
          comment: `${data["input-62_comment_sub_160"]}`,
        },
        {
          instrumentId: 161,
          value: `${data["input-62_sub_161"]}`,
          score: 0,
          comment: `${data["input-62_comment_sub_161"]}`,
        },
        {
          instrumentId: 162,
          value: `${data["input-62_sub_162"]}`,
          score: 0,
          comment: `${data["input-62_comment_sub_162"]}`,
        },
      ];

      const response = await axios.post(
        "http://103.123.63.7/api/response",
        mapData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        router.push("/assessment/bagian-2/assessment-8");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setIsPushed(false);
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
            BAGIAN II—KESIAPAN UNTUK MEMBERIKAN LAYANAN SEPERTI YANG DIURAI
            DALAM PPAM
          </p>
          <hr className="w-full my-4 mx-auto" />
          <p className="uppercase font-medium text-base text-white">
            Komponen PPAM 7: Layananminum kesehatan Balita
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
              type="button"
            />
            <Button
              label={"Berikutnya"}
              withIcon={"right"}
              onClick={handleNext}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentComponent;
