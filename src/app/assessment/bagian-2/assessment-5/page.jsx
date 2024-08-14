"use client";
import React, { useState, useEffect } from "react";
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
      router.push("/login");
    }
  }, [router]);
  useEffect(() => {
    setLoading(true);
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

          const filteredData = data.filter(
            (item) => item.number >= 48 && item.number <= 52
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
    router.push("/assessment/bagian-2/assessment-4");
  };

  const handleInputChange = (name, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    try {
      const response = await fetch(
        "https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/response",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(answers),
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

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      const mapData = [
        {
          instrumentId: 101,
          value: null,
          score: 0,
          comment: data["input-48_comment"],
        },
        {
          instrumentId: 102,
          value: data["input-49"],
          score: 0,
          comment: data["input-49_comment"],
        },
        {
          instrumentId: 104,
          value: `${data["input-50_sub_104"]}`,
          score: 0,
          comment: `${data["input-50_comment_sub_104"]}`,
        },
        {
          instrumentId: 105,
          value: `${data["input-50_sub_105"]}`,
          score: 0,
          comment: `${data["input-50_comment_sub_105"]}`,
        },
        {
          instrumentId: 106,
          value: `${data["input-50_sub_106"]}`,
          score: 0,
          comment: `${data["input-50_comment_sub_106"]}`,
        },
        {
          instrumentId: 107,
          value: `${data["input-50_sub_107"]}`,
          score: 0,
          comment: `${data["input-50_comment_sub_107"]}`,
        },
        {
          instrumentId: 108,
          value: `${data["input-50_sub_108"]}`,
          score: 0,
          comment: `${data["input-50_comment_sub_108"]}`,
        },
        {
          instrumentId: 109,
          value: `${data["input-50_sub_109"]}`,
          score: 0,
          comment: `${data["input-50_comment_sub_109"]}`,
        },
        {
          instrumentId: 111,
          value: `${data["input-51_sub_111"]}`,
          score: 0,
          comment: `${data["input-51_comment_sub_111"]}`,
        },
        {
          instrumentId: 112,
          value: `${data["input-51_sub_112"]}`,
          score: 0,
          comment: `${data["input-51_comment_sub_112"]}`,
        },
        {
          instrumentId: 114,
          value: `${data["input-52_sub_114"]}`,
          score: 0,
          comment: `${data["input-52_comment_sub_114"]}`,
        },
        {
          instrumentId: 115,
          value: `${data["input-52_sub_115"]}`,
          score: 0,
          comment: `${data["input-52_comment_sub_115"]}`,
        },
        {
          instrumentId: 116,
          value: `${data["input-52_sub_116"]}`,
          score: 0,
          comment: `${data["input-52_comment_sub_116"]}`,
        },
      ];

      const response = await axios.post(
        "https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/response",
        mapData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        router.push("/assessment/bagian-2/assessment-6");
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
    );
  }

  return (
    <div className="bg-[#F1F1F7] h-screen overflow-x-hidden">
      <Sidebar activeId={1} />
      <div className="w-full ml-[344px] space-y-6 p-4">
        <div className="bg-[#1446AB] p-4 rounded-2xl w-[1048px] h-[115px]">
          <p className="text-white font-extrabold text-xl">
            BAGIAN II—KESIAPAN UNTUK MEMBERIKAN LAYANAN SEPERTI YANG DIURAI
            DALAM PPAM
          </p>
          <hr className="w-full my-4 mx-auto" />
          <p className="uppercase font-medium text-base text-white">
            Komponen PPAM 5: Mencegah kehamilan yang tidak diinginkan
          </p>
        </div>
        <form
          // action=""
          className="flex flex-col gap-y-5"
          onSubmit={onSubmit}
        >
          {isData.map((item, index) => (
            <div key={index} className="">
              <Question
                type={item.type}
                label={item.question}
                no={item.number}
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
