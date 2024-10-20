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
  const [activeId, setActiveId] = useState("/assessment/bagian-2/assessment-3");
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
            (item) => item.number >= 37 && item.number <= 42
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
    router.push("/assessment/bagian-2/assessment-2");
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
          instrumentId: 259,
          value: null,
          score: 0,
          comment: data["input-37_comment"],
        },
        {
          instrumentId: 260,
          value: null,
          score: 0,
          comment: data["input-38_comment"],
        },
        {
          instrumentId: 261,
          value: data["input-39"],
          score: 0,
          comment: data["input-39_comment"],
        },
        {
          instrumentId: 263,
          value: getArrayValues("input-40_sub_63"),
          score: 0,
          comment: `${data["input-40_comment_sub_63"]}`,
        },
        {
          instrumentId: 264,
          value: getArrayValues("input-40_sub_64"),
          score: 0,
          comment: `${data["input-40_comment_sub_64"]}`,
        },
        {
          instrumentId: 265,
          value: getArrayValues("input-40_sub_65"),
          score: 0,
          comment: `${data["input-40_comment_sub_65"]}`,
        },
        {
          instrumentId: 266,
          value: getArrayValues("input-40_sub_66"),
          score: 0,
          comment: `${data["input-40_comment_sub_66"]}`,
        },
        {
          instrumentId: 268,
          value: `${data["input-41_sub_68"]}`,
          score: 0,
          comment: `${data["input-41_comment_sub_68"]}`,
        },
        {
          instrumentId: 269,
          value: `${data["input-41_sub_69"]}`,
          score: 0,
          comment: `${data["input-41_comment_sub_69"]}`,
        },
        {
          instrumentId: 270,
          value: `${data["input-41_sub_70"]}`,
          score: 0,
          comment: `${data["input-41_comment_sub_70"]}`,
        },
        {
          instrumentId: 271,
          value: `${data["input-41_sub_71"]}`,
          score: 0,
          comment: `${data["input-41_comment_sub_71"]}`,
        },
        {
          instrumentId: 272,
          value: `${data["input-41_sub_72"]}`,
          score: 0,
          comment: `${data["input-41_comment_sub_72"]}`,
        },
        {
          instrumentId: 273,
          value: `${data["input-41_sub_73"]}`,
          score: 0,
          comment: `${data["input-41_comment_sub_73"]}`,
        },
        {
          instrumentId: 274,
          value: `${data["input-41_sub_74"]}`,
          score: 0,
          comment: `${data["input-41_comment_sub_74"]}`,
        },
        {
          instrumentId: 275,
          value: `${data["input-41_sub_75"]}`,
          score: 0,
          comment: `${data["input-41_comment_sub_75"]}`,
        },
        {
          instrumentId: 276,
          value: `${data["input-41_sub_76"]}`,
          score: 0,
          comment: `${data["input-41_comment_sub_76"]}`,
        },
        {
          instrumentId: 278,
          value: `${data["input-42_sub_78"]}`,
          score: 0,
          comment: `${data["input-42_comment_sub_78"]}`,
        },
        {
          instrumentId: 279,
          value: `${data["input-42_sub_79"]}`,
          score: 0,
          comment: `${data["input-42_comment_sub_79"]}`,
        },
        {
          instrumentId: 280,
          value: `${data["input-42_sub_80"]}`,
          score: 0,
          comment: `${data["input-42_comment_sub_80"]}`,
        },
      ];

      const response = await axios.post(
        "https://ppamkespro.com/api/response",
        mapData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        router.push("/assessment/bagian-2/assessment-4");
      }
    } catch (error) {
      setIsPushed(false);
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
            Komponen PPAM 3: Mencegah penularan dan mengurangi kesakitan dan
            kematian akibat HIV dan IMS lainnya
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
