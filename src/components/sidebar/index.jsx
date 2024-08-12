import React, { useState } from "react";
import {
  IoMdArrowRoundBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa";

const Sidebar = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const toggleAccordion = (section) => {
    if (activeAccordion === section) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(section);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="bg-white pl-[31.83px] pt-[32px] w-[296px] h-screen fixed">
      <p
        className="flex items-center gap-x-2 font-medium cursor-pointer"
        onClick={() => console.log("Back button clicked")}
      >
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
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Assessment
      </h1>
      <div className="mt-2 border-b-2 w-10/12 border-black"></div>

      {/* Bagian 01 */}
      <div
        className="flex flex-col mt-10 w-10/12 cursor-pointer"
        onClick={() => toggleAccordion("bagian01")}
      >
        <a href="/assessment/bagian-0" className="flex items-center gap-x-2">
          <FaCircleCheck size={24} className="text-white" />{" "}
          <span>Bagian 0</span>
        </a>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <FaCircleCheck size={24} /> <span>Bagian 01</span>
          </div>
          {activeAccordion === "bagian01" ? (
            <IoIosArrowDown size={16} />
          ) : (
            <IoIosArrowForward size={16} />
          )}
        </div>
        {activeAccordion === "bagian01" && (
          <div className="pl-6 mt-4">
            {/* Tambahkan item assessment untuk Bagian 01 */}
            <div
              className={`flex items-center justify-between mb-10 ${
                activeSection === "assessment-1"
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }`}
              onClick={() => handleSectionClick("assessment-1")}
            >
              <a href="/assessment/bagian-01/assessment-1" className="mb-2">
                Assessment 1
              </a>
            </div>
            <a
              href="/assessment/bagian-01/assessment-2"
              className={`mb-2 ${
                activeSection === "assessment-2"
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }`}
              onClick={() => handleSectionClick("assessment-2")}
            >
              Assessment 2
            </a>
            <a
              href="/assessment/bagian-01/assessment-3"
              className={`mb-2 ${
                activeSection === "assessment-3"
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }`}
              onClick={() => handleSectionClick("assessment-3")}
            >
              Assessment 3
            </a>
            <a
              href="/assessment/bagian-01/assessment-4"
              className={`mb-2 ${
                activeSection === "assessment-4"
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }`}
              onClick={() => handleSectionClick("assessment-4")}
            >
              Assessment 4
            </a>
          </div>
        )}
      </div>

      {/* Bagian 02 */}
      <div
        className="flex flex-col mt-10 w-10/12 cursor-pointer"
        onClick={() => toggleAccordion("bagian02")}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <FaCircleCheck size={24} color="#CCC" /> <span>Bagian 02</span>
          </div>
          {activeAccordion === "bagian02" ? (
            <IoIosArrowDown size={16} />
          ) : (
            <IoIosArrowForward size={16} />
          )}
        </div>
        {activeAccordion === "bagian02" && (
          <div className="pl-6 mt-4">
            {/* Tambahkan item assessment untuk Bagian 02 */}
            <a
              href="/assessment/bagian-2/assessment-1"
              className={`mb-2 ${
                activeSection === "assessment-2-1"
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }`}
              onClick={() => handleSectionClick("assessment-2-1")}
            >
              Assessment 1
            </a>
            <a
              href="/assessment/bagian-2/assessment-2"
              className={`mb-2 ${
                activeSection === "assessment-2-2"
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }`}
              onClick={() => handleSectionClick("assessment-2-2")}
            >
              Assessment 2
            </a>
            <a
              href="/assessment/bagian-2/assessment-3"
              className={`mb-2 ${
                activeSection === "assessment-2-3"
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }`}
              onClick={() => handleSectionClick("assessment-2-3")}
            >
              Assessment 3
            </a>
            <a
              href="/assessment/bagian-2/assessment-4"
              className={`mb-2 ${
                activeSection === "assessment-2-4"
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }`}
              onClick={() => handleSectionClick("assessment-2-4")}
            >
              Assessment 4
            </a>
            <a
              href="/assessment/bagian-2/assessment-5"
              className={`mb-2 ${
                activeSection === "assessment-2-5"
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }`}
              onClick={() => handleSectionClick("assessment-2-5")}
            >
              Assessment 5
            </a>
            <a
              href="/assessment/bagian-2/assessment-6"
              className={`mb-2 ${
                activeSection === "assessment-2-6"
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }`}
              onClick={() => handleSectionClick("assessment-2-6")}
            >
              Assessment 6
            </a>
            <a
              href="/assessment/bagian-2/assessment-7"
              className={`mb-2 ${
                activeSection === "assessment-2-7"
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }`}
              onClick={() => handleSectionClick("assessment-2-7")}
            >
              Assessment 7
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
