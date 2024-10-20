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
  const [activeId, setActiveId] = useState("/assessment/bagian-2/assessment-2");
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
            (item) => item.number >= 31 && item.number <= 36
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
    router.push("/assessment/bagian-2/");
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
          instrumentId: 237,
          value: data["input-31"],
          score: 0,
          comment: data["input-31_comment"],
        },
        {
          instrumentId: 238,
          value: null,
          score: 0,
          comment: data["input-32_comment"],
        },
        {
          instrumentId: 239,
          value: data["input-33"],
          score: 0,
          comment: data["input-33_comment"],
        },
        {
          instrumentId: 241,
          value: getArrayValues("input-34_sub_41"),
          score: 0,
          comment: `${data["input-34_comment_sub_41"]}`,
        },
        {
          instrumentId: 242,
          value: getArrayValues("input-34_sub_42"),
          score: 0,
          comment: `${data["input-34_comment_sub_42"]}`,
        },
        {
          instrumentId: 243,
          value: getArrayValues("input-34_sub_43"),
          score: 0,
          comment: `${data["input-34_comment_sub_43"]}`,
        },
        {
          instrumentId: 244,
          value: getArrayValues("input-34_sub_44"),
          score: 0,
          comment: `${data["input-34_comment_sub_44"]}`,
        },
        {
          instrumentId: 245,
          value: getArrayValues("input-34_sub_45"),
          score: 0,
          comment: `${data["input-34_comment_sub_45"]}`,
        },
        {
          instrumentId: 246,
          value: getArrayValues("input-34_sub_46"),
          score: 0,
          comment: `${data["input-34_comment_sub_46"]}`,
        },
        {
          instrumentId: 247,
          value: getArrayValues("input-34_sub_47"),
          score: 0,
          comment: `${data["input-34_comment_sub_47"]}`,
        },
        {
          instrumentId: 248,
          value: getArrayValues("input-34_sub_48"),
          score: 0,
          comment: `${data["input-34_comment_sub_48"]}`,
        },
        {
          instrumentId: 249,
          value: getArrayValues("input-34_sub_49"),
          score: 0,
          comment: `${data["input-34_comment_sub_49"]}`,
        },
        {
          instrumentId: 251,
          value: `${data["input-35_sub_51"]}`,
          score: 0,
          comment: `${data["input-35_comment_sub_51"]}`,
        },
        {
          instrumentId: 252,
          value: `${data["input-35_sub_52"]}`,
          score: 0,
          comment: `${data["input-35_comment_sub_52"]}`,
        },
        {
          instrumentId: 253,
          value: `${data["input-35_sub_53"]}`,
          score: 0,
          comment: `${data["input-35_comment_sub_53"]}`,
        },
        {
          instrumentId: 254,
          value: `${data["input-35_sub_54"]}`,
          score: 0,
          comment: `${data["input-35_comment_sub_54"]}`,
        },
        {
          instrumentId: 256,
          value: `${data["input-36_sub_56"]}`,
          score: 0,
          comment: `${data["input-36_comment_sub_56"]}`,
        },
        {
          instrumentId: 257,
          value: `${data["input-36_sub_57"]}`,
          score: 0,
          comment: `${data["input-36_comment_sub_57"]}`,
        },
        {
          instrumentId: 258,
          value: `${data["input-36_sub_58"]}`,
          score: 0,
          comment: `${data["input-36_comment_sub_58"]}`,
        },
      ];

      const response = await axios.post(
        "https://ppamkespro.com/api/response",
        mapData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        router.push("/assessment/bagian-2/assessment-3");
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
            Komponen PPAM 2: Mencegah kekerasan seksual dan menanggapi kebutuhan
            para penyintas
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
