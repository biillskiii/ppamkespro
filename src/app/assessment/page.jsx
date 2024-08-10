"use client";
import React, { useState, useEffect } from "react";
import Question from "@/components/question";
import { IoMdArrowRoundBack } from "react-icons/io";

const data = [
  {
    id: 1,
    number: 1,
    topicId: 1,
    question:
      "Apakah negara Anda mempunyai Kebijakan dan/atau Program Kesiapsiagaan dan/atau Tanggap Darurat Nasional?",
    type: "dropdown",
    choice: [
      { label: "Ya", value: "Ya" },
      { label: "Tidak", value: "Tidak" },
      { label: "Tidak Tahu", value: "Tidak Tahu" },
    ],
  },
  {
    id: 2,
    number: 2,
    topicId: 1,
    question:
      "Apakah negara Anda mempunyai Program Kesiapsiagaan Kesehatan Nasional?",
    type: "checkbox",
    choice: [
      { label: "Rumah sakit", value: "rs" },
      { label: "Puskesmas", value: "psk" },
      { label: "Klinik Swasta", value: "ks" },
    ],
  },
  {
    id: 3,
    number: 3,
    topicId: 3,
    question:
      "Apakah negara Anda mempunyai Kebijakan dan/atau Program Kesiapsiagaan dan/atau Tanggap Darurat Nasional?",
    type: "dropdown",
    choice: [
      { label: "Ya", value: "Ya" },
      { label: "Tidak", value: "Tidak" },
      { label: "Tidak Tahu", value: "Tidak Tahu" },
    ],
  },
  {
    id: 4,
    number: 4,
    topicId: 4,
    question:
      "Apakah negara Anda mempunyai Program Kesiapsiagaan Kesehatan Nasional?",
    type: "checkbox",
    choice: [
      { label: "Rumah sakit", value: "rs" },
      { label: "Puskesmas", value: "psk" },
      { label: "Klinik Swasta", value: "ks" },
    ],
  },
  {
    id: 5,
    number: 5,
    topicId: 5,
    question:
      "Apakah negara Anda mempunyai Kebijakan dan/atau Program Kesiapsiagaan dan/atau Tanggap Darurat Nasional?",
    type: "dropdown",
    choice: [
      { label: "Ya", value: "Ya" },
      { label: "Tidak", value: "Tidak" },
      { label: "Tidak Tahu", value: "Tidak Tahu" },
    ],
  },
  {
    id: 6,
    number: 6,
    topicId: 6,
    question:
      "Apakah negara Anda mempunyai Program Kesiapsiagaan Kesehatan Nasional?",
    type: "checkbox",
    choice: [
      { label: "Rumah sakit", value: "rs" },
      { label: "Puskesmas", value: "psk" },
      { label: "Klinik Swasta", value: "ks" },
    ],
  },
  // Add more questions as needed
];

const ParentComponent = () => {
  const [formData, setFormData] = useState({});

  // Load data from localStorage when component mounts
  useEffect(() => {
    const savedData = {};
    data.forEach((item) => {
      const savedValue = localStorage.getItem(item.id);
      if (savedValue) {
        savedData[item.id] = savedValue;
      }
    });
    setFormData(savedData);
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    Object.keys(formData).forEach((key) => {
      localStorage.setItem(key, formData[key]);
    });
  }, [formData]);

  const handleChange = (id, value) => {
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  return (
    <div className="bg-[#F1F1F7]">
      <div className="bg-white pl-[31.83px] pt-[32px] w-[296px] h-screen fixed">
        <p className="flex items-center gap-x-2 font-medium cursor-pointer">
          <IoMdArrowRoundBack size={15} />
          Kembali
        </p>
        <h1 className="mt-8 flex items-center gap-x-2 text-2xl font-semibold">
          <svg
            width="26"
            height="27"
            viewBox="0 0 26 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.58649 10.0324L7.97352 11.4195L10.7476 8.64539M14.2152 10.7259H19.0698M6.58649 16.9676L7.97352 18.3546L10.7476 15.5805M14.2152 17.6611H19.0698M1.29863 17.5661C0.67129 14.8917 0.671291 12.1083 1.29863 9.43391C2.16729 5.73068 5.0588 2.83916 8.76204 1.9705C11.4365 1.34317 14.2198 1.34317 16.8942 1.9705C20.5975 2.83916 23.489 5.73068 24.3576 9.43391C24.985 12.1083 24.985 14.8917 24.3576 17.5661C23.489 21.2693 20.5975 24.1608 16.8942 25.0295C14.2198 25.6568 11.4365 25.6568 8.76204 25.0295C5.05881 24.1608 2.16729 21.2693 1.29863 17.5661Z"
              stroke="#161616"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Assessment
        </h1>
        <div className="mt-2 border-b-2 w-10/12 border-black"></div>
      </div>
      <div className="w-full ml-[344px] space-y-6 p-4">
        <div className="bg-[#1446AB] p-4 rounded-2xl w-[1048px] h-[115px]">
          <p className="text-white font-extrabold text-xl">
            Bagian II—Kesiapan Memberikan Layanan sebagaimana Diuraikan dalam
            PPAM
          </p>
          <hr className="w-full my-4 mx-auto" />
          <p className="font-medium text-base text-white">
            PPAM 3: MENCEGAH PENULARAN DAN MENGURANGI KESAKITAN DAN KEMATIAN
            AKIBAT HIV DAN IMS LAINNYA
          </p>
        </div>
        <form action="" className="flex flex-col gap-y-5">
          {data.map((item, index) => (
            <div key={index} className="">
              <Question
                type={item.type}
                label={item.question}
                name={`input-${item.id}`}
                options={item.choice}
                placeholder="Komentar/Referensi/Rincian..."
                onChange={(value) => handleChange(item.id, value)}
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default ParentComponent;
