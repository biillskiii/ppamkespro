"use client";
import Button from "@/components/button";
import Question from "@/components/question";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Link from "next/link";
const ParentComponent = () => {
  const [isDone, setIsDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isData, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const formRef = useRef(null);
  const [isPushed, setIsPushed] = useState(false);
  const [activeId, setActiveId] = useState("/assessment/bagian-2/assessment-9");
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null;

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        "Decoded Token:", decodedToken;
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
    fetch("https://103.123.63.7/api/instrument")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((responseData) => {
        "Data fetched:", responseData;

        if (responseData && Array.isArray(responseData.data)) {
          const data = responseData.data;

          const filteredData = data.filter(
            (item) => item.number >= 68 && item.number <= 73
          );

          "Filtered Data:", filteredData;

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
  // const toggleAccordion = (section) => {
  //   setActiveAccordion(activeAccordion === section ? null : section);
  // };

  useEffect(() => {
    if (isData.length > 0) {
      const allAnswered = isData.every(
        (item) => answers[`input-${item.number}`]
      );
      setIsDone(allAnswered);
    }
  }, [answers, isData]);

  const handleBack = () => {
    ("Back button clicked");
    router.push("/assessment/bagian-2/assessment-8");
  };

  const handleInputChange = (name, value) => {
    "Input Changed:", name, value; // Debug: Log name and value
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  // const handleNext = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/response",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(answers),
  //       }
  //     );

  //     if (response.ok) {
  //       router.push("/assessment/bagian-1/assessment2");
  //     } else {
  //       console.error("Error posting data:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error posting data:", error);
  //   }
  // };
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert FormData to a plain object
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      data;
      // Log form data for debugging
      "Form Data:", data;
      const getArrayValues = (prefix) => {
        const values = [];
        let index = 0;
        while (data[`${prefix}-${index}`] !== undefined) {
          values.push(data[`${prefix}-${index}`]);
          index++;
        }
        return values;
      };
      // Prepare the data for API
      const mapData = [
        {
          instrumentId: 184,
          value: data["input-68"] || "",
          comment: data["input-68_comment"] || "",
        },
        {
          instrumentId: 185,
          value: data["input-69"] || "",
          comment: data["input-69_comment"] || "",
        },
        {
          instrumentId: 186,
          value: data["input-70"] || "",
          comment: data["input-70_comment"] || "",
        },
        {
          instrumentId: 187,
          value: data["input-71"] || "",
          comment: data["input-71_comment"] || "",
        },
        {
          instrumentId: 189,
          value: getArrayValues("input-72_sub_189"),
          comment: data["input-72_comment_sub_189"] || "",
        },
        {
          instrumentId: 190,
          value: getArrayValues("input-72_sub_190"),
          comment: data["input-72_comment_sub_190"] || "",
        },
        {
          instrumentId: 191,
          value: getArrayValues("input-72_sub_191"),
          comment: data["input-72_comment_sub_191"] || "",
        },
        {
          instrumentId: 193,
          value: data["input-73_sub_193"] || "",
          comment: data["input-73_comment_sub_193"] || "",
        },
        {
          instrumentId: 194,
          value: data["input-73_sub_194"] || "",
          comment: data["input-73_comment_sub_194"] || "",
        },
        {
          instrumentId: 195,
          value: data["input-73_sub_195"] || "",
          comment: data["input-73_comment_sub_195"] || "",
        },
      ];

      "Mapped Data:", mapData;

      // Send the data as an object
      const response = await axios.post(
        "https://103.123.63.7/api/response",
        mapData, // Send data as an object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        localStorage.clear();
        setIsPushed(true);
        router.push("/assessment/data-diri");
      } else {
        console.error("Error posting data:", response.statusText);
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsPushed(false);
    }
  };

  const handleSidebarClick = () => {
    if (formRef.current) {
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
            Kegiatan prioritas lainnya: Perawatan aborsi yang aman sesuai dengan
            hukum yang berlaku
          </p>
        </div>
        <form
          onSubmit={(e) => {
            onSubmit(e);
            setIsPushed(true);
          }}
          ref={formRef}
        >
          {isData.map((item, index) => (
            <div key={index}>
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
              type="button"
            />
            <Button
              label={"Submit"}
              withIcon={"right"}
              type="submit"
              // disabled={!isDone}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentComponent;
