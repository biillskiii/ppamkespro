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
  const [activeId, setActiveId] = useState("/assessment/bagian-2/assessment-6");
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
            (item) => item.number >= 53 && item.number <= 57
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

  const handleBack = (e) => {
    e.preventDefault(); 
    router.push("/assessment/bagian-2/assessment-5");
  };

  const handleInputChange = (name, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    try {
      const response = await fetch("https://ppamkespro.com/api/response", {
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
          instrumentId: 317,
          value: null,
          score: 0,
          comment: data["input-53_comment"],
        },
        {
          instrumentId: 318,
          value: data["input-54"],
          score: 0,
          comment: data["input-54_comment"],
        },
        {
          instrumentId: 320,
          value: getArrayValues("input-55_sub_120"),
          score: 0,
          comment: `${data["input-55_comment_sub_120"]}`,
        },
        {
          instrumentId: 321,
          value: getArrayValues("input-55_sub_121"),
          score: 0,
          comment: `${data["input-55_comment_sub_121"]}`,
        },
        {
          instrumentId: 322,
          value: getArrayValues("input-55_sub_122"),
          score: 0,
          comment: `${data["input-55_comment_sub_122"]}`,
        },
        {
          instrumentId: 323,
          value: getArrayValues("input-55_sub_123"),
          score: 0,
          comment: `${data["input-55_comment_sub_123"]}`,
        },
        {
          instrumentId: 324,
          value: getArrayValues("input-55_sub_124"),
          score: 0,
          comment: `${data["input-55_comment_sub_124"]}`,
        },
        {
          instrumentId: 326,
          value: `${data["input-56_sub_126"]}`,
          score: 0,
          comment: `${data["input-56_comment_sub_126"]}`,
        },
        {
          instrumentId: 327,
          value: `${data["input-56_sub_127"]}`,
          score: 0,
          comment: `${data["input-56_comment_sub_127"]}`,
        },
        {
          instrumentId: 328,
          value: `${data["input-56_sub_128"]}`,
          score: 0,
          comment: `${data["input-56_comment_sub_128"]}`,
        },
        {
          instrumentId: 329,
          value: `${data["input-56_sub_129"]}`,
          score: 0,
          comment: `${data["input-56_comment_sub_129"]}`,
        },
        {
          instrumentId: 330,
          value: `${data["input-56_sub_130"]}`,
          score: 0,
          comment: `${data["input-56_comment_sub_130"]}`,
        },
        {
          instrumentId: 331,
          value: `${data["input-56_sub_131"]}`,
          score: 0,
          comment: `${data["input-56_comment_sub_131"]}`,
        },
        {
          instrumentId: 332,
          value: `${data["input-56_sub_132"]}`,
          score: 0,
          comment: `${data["input-56_comment_sub_132"]}`,
        },
        {
          instrumentId: 333,
          value: `${data["input-56_sub_133"]}`,
          score: 0,
          comment: `${data["input-56_comment_sub_133"]}`,
        },
        {
          instrumentId: 335,
          value: `${data["input-57_sub_135"]}`,
          score: 0,
          comment: `${data["input-57_comment_sub_135"]}`,
        },
        {
          instrumentId: 336,
          value: `${data["input-57_sub_136"]}`,
          score: 0,
          comment: `${data["input-57_comment_sub_136"]}`,
        },
        {
          instrumentId: 337,
          value: `${data["input-57_sub_137"]}`,
          score: 0,
          comment: `${data["input-57_comment_sub_137"]}`,
        },
      ];

      const response = await axios.post(
        "https://ppamkespro.com/api/response",
        mapData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        router.push("/assessment/bagian-2/assessment-7");
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
            BAGIAN II—KESIAPAN UNTUK MEMBERIKAN LAYANAN SEPERTI YANG DIURAI
            DALAM PPAM
          </p>
          <hr className="w-full my-4 mx-auto" />
          <p className="uppercase font-medium text-base text-white">
            Komponen PPAM 6: layanan minimun kesehatan reproduksi remaja
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
            <Button label={"Berikutnya"} type="submit" withIcon={"right"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentComponent;
