import React from "react";
import Question from "@/components/question";
import Sidebar from "@/components/sidebar";
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
  return (
    <div className="bg-[#F1F1F7]">
      <Sidebar />
      <div className="w-full  ml-[344px] space-y-6 p-4">
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
        <form action="" className="flex flex-col gap-y-5 ">
          {data.map((item, index) => (
            <div key={index} className="">
              <Question
                type={item.type}
                label={item.question}
                name={`input-${item.id}`}
                options={item.choice}
                placeholder="Komentar/Referensi/Rincian..."
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default ParentComponent;
