"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import Question0 from "@/components/q-bagian-0";
import DatePicker from "@/components/datepicker";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import { formatISO } from "date-fns";

const Bagian0 = () => {
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [activeId, setActiveId] = useState("/assessment/bagian-0/");
  const [isLoadingQuestions, setLoadingQuestions] = useState(false);
  const [isLoadingAreas, setLoadingAreas] = useState(false);
  const [isPushed, setIsPushed] = useState(false);

  const router = useRouter();
  const formRef = useRef(null);
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const response = await axios.get(
          "https://ppamkespro.com/api/instrument"
        );
        const filteredQuestions = response.data.data.filter(
          (item) => item.number >= 1 && item.number <= 4
        );
        setQuestions(filteredQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      setLoadingAreas(true);
      try {
        const response = await fetch(
          "https://ppamkespro.com/api/instrument/area"
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const responseData = await response.json();
        setAreas(responseData.data);
      } catch (error) {
        console.error("Error fetching area data:", error);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, []);

  const handleBack = () => {
    router.push("/assessment");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsPushed(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const formattedDate = formatISO(new Date(data["date"]));

      const mapData = {
        leader: data["leader_comment"] || "",
        date: formattedDate || "",
        participant: data["participant_comment"] || "",
        provinceId: selectedProvince ? Number(selectedProvince) : null,
        cityId: selectedCity ? Number(selectedCity) : null,
      };

      const response = await axios.post(
        "https://ppamkespro.com/api/response/metadata",
        mapData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        router.push("/assessment/bagian-1");
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
      setIsPushed(false);
      formRef.current.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  };

  useEffect(() => {
    const province = localStorage.getItem("selectedProvince");
    if (province) {
      setSelectedProvince(province);
    }
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const area = areas.find((area) => area.id === Number(selectedProvince));
      setCities(area ? area.cities : []);
      localStorage.setItem("selectedProvince", selectedProvince);
    } else {
      setCities([]);
    }
  }, [selectedProvince, areas]);

  useEffect(() => {
    if (selectedProvince) {
      localStorage.setItem("selectedProvince", selectedProvince);
    }
  }, [selectedProvince]);

  return (
    <div className="bg-[#F1F1F7] h-screen overflow-x-hidden">
      <Sidebar
        activeId={activeId}
        setActiveId={setActiveId}
        onClick={handleSidebarClick}
      />

      <div className="container w-[1048px] ml-[344px] space-y-6 p-4">
        <div className="bg-[#1446AB] pl-4 py-4 rounded-2xl w-[1048px]">
          <p className="text-white font-extrabold text-xl">
            Bagian 0 - Informasi umum
          </p>
        </div>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="flex flex-col gap-y-5"
        >
          {isLoadingQuestions ? (
            <p>Loading questions...</p>
          ) : (
            questions.length > 0 && (
              <>
                <div className="flex w-[1048px] gap-x-4">
                  <Question0
                    label={questions[0]?.question}
                    type={"text"}
                    placeholder={questions[0]?.question || ""}
                    name={"leader"}
                    value={answers.leader || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        leader: e.target.value,
                      }))
                    }
                  />

                  <DatePicker label={questions[1].question} name="date" />
                </div>

                <Question0
                  label={questions[2].question}
                  placeholder={questions[2].question}
                  name={"areaType"}
                  type={"dropdown"}
                  options={["Nasional", "Sub Nasional"].map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                  onChange={(name, value) => {
                    setAnswers((prev) => ({ ...prev, [name]: value }));
                  }}
                />

                {selectedValue === "Sub Nasional" && (
                  <>
                    <Question0
                      label="Pilih Provinsi"
                      name="province"
                      type="dropdown"
                      options={areas.map((area) => ({
                        value: area.id,
                        label: area.name,
                      }))}
                      selectedValue={selectedProvince}
                      setSelectedValue={setSelectedProvince}
                    />
                    {selectedProvince && cities.length > 0 && (
                      <Question0
                        label="Pilih Kota"
                        placeholder="Pilih Kota"
                        name="city"
                        type="dropdown"
                        options={cities.map((city) => ({
                          value: city.id,
                          label: city.name,
                        }))}
                        selectedValue={selectedCity}
                        setSelectedValue={setSelectedCity}
                      />
                    )}
                  </>
                )}

                <Question0
                  label={questions[3]?.question}
                  placeholder={questions[3]?.question || ""}
                  name={"participant"}
                  type={"text"}
                  value={answers.participant || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      participant: e.target.value,
                    }))
                  }
                />
              </>
            )
          )}

          <div className="flex items-center ml-80 my-10 gap-x-5 w-3/12">
            <Button
              label={"Sebelumnya"}
              onClick={handleBack}
              withIcon={"left"}
              variant="disabled"
              type="button"
              disabled
            />
            <Button label={"Berikutnya"} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bagian0;
