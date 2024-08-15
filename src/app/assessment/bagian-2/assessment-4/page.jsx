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
            (item) => item.number >= 43 && item.number <= 47
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
    router.push("/assessment/bagian-2/assessment-3");
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
          instrumentId: 81,
          value: null,
          score: 0,
          comment: data["input-43_comment"],
        },
        {
          instrumentId: 82,
          value: null,
          score: 0,
          comment: data["input-44_comment"],
        },
        {
          instrumentId: 84,
          value: `${data["input-45_sub_84"]}`,
          score: 0,
          comment: `${data["input-45_comment_sub_84"]}`,
        },
        {
          instrumentId: 85,
          value: `${data["input-45_sub_85"]}`,
          score: 0,
          comment: `${data["input-45_comment_sub_85"]}`,
        },
        {
          instrumentId: 86,
          value: `${data["input-45_sub_86"]}`,
          score: 0,
          comment: `${data["input-45_comment_sub_86"]}`,
        },
        {
          instrumentId: 87,
          value: `${data["input-45_sub_87"]}`,
          score: 0,
          comment: `${data["input-45_comment_sub_87"]}`,
        },
        {
          instrumentId: 88,
          value: `${data["input-45_sub_88"]}`,
          score: 0,
          comment: `${data["input-45_comment_sub_88"]}`,
        },
        {
          instrumentId: 90,
          value: `${data["input-46_sub_90"]}`,
          score: 0,
          comment: `${data["input-46_comment_sub_90"]}`,
        },
        {
          instrumentId: 91,
          value: `${data["input-46_sub_91"]}`,
          score: 0,
          comment: `${data["input-46_comment_sub_91"]}`,
        },
        {
          instrumentId: 92,
          value: `${data["input-46_sub_92"]}`,
          score: 0,
          comment: `${data["input-46_comment_sub_92"]}`,
        },
        {
          instrumentId: 93,
          value: `${data["input-46_sub_93"]}`,
          score: 0,
          comment: `${data["input-46_comment_sub_93"]}`,
        },
        {
          instrumentId: 94,
          value: `${data["input-46_sub_94"]}`,
          score: 0,
          comment: `${data["input-46_comment_sub_94"]}`,
        },
        {
          instrumentId: 95,
          value: `${data["input-46_sub_95"]}`,
          score: 0,
          comment: `${data["input-46_comment_sub_95"]}`,
        },
        {
          instrumentId: 96,
          value: `${data["input-46_sub_96"]}`,
          score: 0,
          comment: `${data["input-46_comment_sub_96"]}`,
        },
        {
          instrumentId: 98,
          value: `${data["input-47_sub_98"]}`,
          score: 0,
          comment: `${data["input-47_comment_sub_98"]}`,
        },
        {
          instrumentId: 99,
          value: `${data["input-47_sub_99"]}`,
          score: 0,
          comment: `${data["input-47_comment_sub_99"]}`,
        },
        {
          instrumentId: 100,
          value: `${data["input-47_sub_100"]}`,
          score: 0,
          comment: `${data["input-47_comment_sub_100"]}`,
        },
      ];

      const response = await axios.post(
        "https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/response",
        mapData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        isPushed && router.push("/assessment/bagian-2/assessment-5");
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
      <Sidebar activeId={1} onClick={handleSidebarClick} />
      <div className="w-full ml-[344px] space-y-6 p-4">
        <div className="bg-[#1446AB] p-4 rounded-2xl w-[1048px] h-[115px]">
          <p className="text-white font-extrabold text-xl">
            BAGIAN II—KESIAPAN UNTUK MEMBERIKAN LAYANAN SEPERTI YANG DIURAI
            DALAM PPAM
          </p>
          <hr className="w-full my-4 mx-auto" />
          <p className="uppercase font-medium text-base text-white">
            Komponen PPAM 4: Mencegah meningkatnya kesakitan dan kematian
            maternal dan neonatal
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
            <Button label={"Berikutnya"} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentComponent;
