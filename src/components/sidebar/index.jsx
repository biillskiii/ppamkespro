"use client";

import React, { useState, useEffect } from "react";
import {
  IoMdArrowRoundBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const Sidebar = ({ activeId }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const router = useRouter();

  // Load active accordion from local storage
  useEffect(() => {
    const savedAccordion = localStorage.getItem("activeAccordion");
    if (savedAccordion) {
      setActiveAccordion(savedAccordion);
    }
  }, []);

  const toggleAccordion = (section) => {
    // Toggle accordion open/close
    setActiveAccordion((prev) => {
      const newActiveAccordion = prev === section ? null : section;
      localStorage.setItem("activeAccordion", newActiveAccordion);
      return newActiveAccordion;
    });
  };

  const handleNavigation = (href, section) => {
    router.push(href);
    if (section) {
      toggleAccordion(section); // Ensure the section stays open
    }
  };

  const handleBack = () => {
    router.push("/assessment");
  };

  const menus = [
    {
      id: 0,
      title: "Bagian 0",
      href: "/assessment/bagian-0/",
    },
    {
      title: "Bagian I",
      subMenu: [
        {
          id: 1,
          title: "Asesmen 1",
          desc: "Pertanyaan 1–7",
          href: "/assessment/bagian-1/",
        },
        {
          id: 2,
          title: "Asesmen 2",
          desc: "Pertanyaan 8–13",
          href: "/assessment/bagian-1/assessment-2",
        },
        {
          id: 3,
          title: "Asesmen 3",
          desc: "Pertanyaan 14–17",
          href: "/assessment/bagian-1/assessment-3",
        },
        {
          id: 4,
          title: "Asesmen 4",
          desc: "Pertanyaan 18–21",
          href: "/assessment/bagian-1/assessment-4",
        },
      ],
    },
    {
      title: "Bagian II",
      subMenu: [
        {
          id: 5,
          title: "Asesmen 1",
          desc: "Pertanyaan 22–30",
          href: "/assessment/bagian-2/",
        },
        {
          id: 6,
          title: "Asesmen 2",
          desc: "Pertanyaan 31–36",
          href: "/assessment/bagian-2/assessment-2",
        },
        {
          id: 7,
          title: "Asesmen 3",
          desc: "Pertanyaan 37–42",
          href: "/assessment/bagian-2/assessment-3",
        },
        {
          id: 8,
          title: "Asesmen 4",
          desc: "Pertanyaan 43–47",
          href: "/assessment/bagian-2/assessment-4",
        },
        {
          id: 9,
          title: "Asesmen 5",
          desc: "Pertanyaan 48–52",
          href: "/assessment/bagian-2/assessment-5",
        },
        {
          id: 10,
          title: "Asesmen 6",
          desc: "Pertanyaan 53–57",
          href: "/assessment/bagian-2/assessment-6",
        },
        {
          id: 11,
          title: "Asesmen 7",
          desc: "Pertanyaan 58–62",
          href: "/assessment/bagian-2/assessment-7",
        },
        {
          id: 12,
          title: "Asesmen 8",
          desc: "Pertanyaan 63-67",
          href: "/assessment/bagian-2/assessment-8",
        },
        {
          id: 13,
          title: "Asesmen 9",
          desc: "Pertanyaan 68-73",
          href: "/assessment/bagian-2/assessment-9",
        },
      ],
    },
  ];
  function Menu({ title, desc, subMenu = [], href }) {
    const isActive = activeAccordion === title;
    const isHighlighted =
      activeId === href || subMenu.some((item) => item.href === activeId);

    function Assesstment({ title, desc, href }) {
      return (
        <div className="border-white border-2 -ml-5 mb-5 rounded-lg bg-white">
          <button
            className="flex  flex-col items-start  h-8 w-full"
            onClick={() =>
              handleNavigation(href, title === "Bagian I" ? title : null)
            }
          >
            <a
              href="#"
              className={`mb-2
                ${
                  isHighlighted
                    ? "bg-white text-accent"
                    : "bg-white text-accent"
                } rounded-lg py-2 text-start pl-2 font-semibold  w-full
              `}
            >
              {title}
            </a>
          </button>
          <p className="text-xs text-accent pl-2 pb-3 ">{desc}</p>
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col mt-10 w-10/12 cursor-pointer justify-center ${
          isHighlighted ? "bg-accent text-white" : "bg-accent text-white"
        } py-4 px-4 rounded-lg font-semibold`}
        onClick={() => {
          if (title === "Bagian 0") {
            handleNavigation(href);
          } else {
            toggleAccordion(title);
          }
        }}
      >
        <div className={`flex items-center h-auto justify-between`}>
          <div className="flex items-center h-full gap-x-2">
            <FaCircleCheck size={24} color="#fff" /> <span>{title}</span>
          </div>
          {title === "Bagian 0" ? null : isActive ? (
            <IoIosArrowDown size={16} />
          ) : (
            <IoIosArrowForward size={16} />
          )}
        </div>
        {isActive && title !== "Bagian 0" && (
          <div className="pl-6 mt-4">
            {subMenu.map((item, index) => (
              <Assesstment
                key={index}
                title={item.title}
                desc={item.desc}
                href={item.href}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white pl-[31.83px] pt-[32px] w-[296px] h-screen fixed overflow-y-auto">
      <p
        className="flex items-center gap-x-2 font-medium cursor-pointer"
        onClick={handleBack}
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

      {menus.map((item, index) => (
        <Menu
          key={index}
          title={item.title}
          subMenu={item.subMenu}
          href={item.href}
        />
      ))}
    </div>
  );
};

export default Sidebar;
