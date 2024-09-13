"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  IoMdArrowRoundBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { FaCircleCheck, FaSpinner } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";

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
        desc: "Pertanyaan 63–67",
        href: "/assessment/bagian-2/assessment-8",
      },
      {
        id: 13,
        title: "Asesmen 9",
        desc: "Pertanyaan 68–73",
        href: "/assessment/bagian-2/assessment-9",
      },
    ],
  },
];

const Menu = ({
  title,
  subMenu = [],
  href,
  activeId,
  activeAccordion,
  toggleAccordion,
  handleNavigation,
  onClick = () => {},
  isLoading,
}) => {
  const isActive = activeAccordion === title;
  const isHighlighted =
    (activeId === href && title === "Bagian 0") ||
    (activeId !== href &&
      title !== "Bagian 0" &&
      subMenu.some((item) => item.href === activeId));

  return (
    <div
      className={`flex flex-col mt-10 w-10/12 cursor-pointer justify-center ${
        isHighlighted
          ? "bg-accent text-white"
          : "bg-transparent border border-border text-accent"
      } py-4 px-4 rounded-lg font-semibold`}
      onClick={() => {
        if (title === "Bagian 0") {
          handleNavigation(href);
        } else {
          toggleAccordion(title);
        }
      }}
    >
      <div className="flex items-center h-auto justify-between">
        <div className="flex items-center h-full gap-x-2">
          <FaCircleCheck
            size={24}
            className={`${isHighlighted ? "text-gray-200" : "text-accent"}`}
          />{" "}
          <span>{title}</span>
        </div>
        {title !== "Bagian 0" &&
          (isActive ? (
            <IoIosArrowDown size={16} />
          ) : (
            <IoIosArrowForward size={16} />
          ))}
      </div>
      {isActive && title !== "Bagian 0" && (
        <div className="pl-6 mt-4">
          {subMenu.map((item, index) => (
            <Assesstment
              key={index}
              title={item.title}
              desc={item.desc}
              href={item.href}
              handleNavigation={handleNavigation}
              isHighlighted={activeId === item.href}
              onClick={onClick}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Assesstment = ({
  title,
  desc,
  href,
  handleNavigation,
  isHighlighted,
  onClick = () => {},
  isLoading,
}) => (
  <div
    className={`border-white border-2 -ml-5 mb-5 rounded-lg ${
      isHighlighted ? "bg-accent text-white" : "bg-white"
    }`}
  >
    <button
      className="flex flex-col items-start h-8 w-full"
      onClick={() => {
        handleNavigation(href, title);
        onClick();
      }}
    >
      <span
        className={`mb-2 ${
          isHighlighted ? "bg-accent text-white" : "bg-white text-accent"
        } rounded-lg py-2 text-start pl-2 font-semibold w-full`}
      >
        {isLoading ? <FaSpinner className="animate-spin" /> : title}
      </span>
    </button>
    <p
      className={`text-xs ${
        isHighlighted ? "text-white" : "text-accent"
      } pl-2 pb-3`}
    >
      {desc}
    </p>
  </div>
);

const Sidebar = ({ activeId, onClick = () => {} }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedAccordion = localStorage.getItem("activeAccordion");
    if (savedAccordion) {
      setActiveAccordion(savedAccordion);
    }
  }, []);

  const toggleAccordion = (section) => {
    setActiveAccordion((prev) => {
      const newActiveAccordion = prev === section ? null : section;
      localStorage.setItem("activeAccordion", newActiveAccordion);
      return newActiveAccordion;
    });
  };

  const handleNavigation = useCallback(
    debounce((href, section = null) => {
      setIsLoading(true); // Set loading state to true
      router.push(href);
      if (section && activeAccordion !== section) {
        toggleAccordion(section);
      }
      setIsLoading(false); // Reset loading state after navigation
    }, 300),
    [activeAccordion, toggleAccordion, router]
  );

  const handleBack = () => {
    setIsLoading(true); // Set loading state to true
    router.push("/assessment");
    setIsLoading(false); // Reset loading state after navigation
  };

  return (
    <div className="bg-white pl-[31.83px] pt-[32px] w-[296px] h-screen fixed overflow-y-auto">
      <p
        className="flex items-center gap-x-2 font-medium cursor-pointer"
        onClick={handleBack}
      >
        {isLoading ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <IoMdArrowRoundBack size={15} />
        )}{" "}
        Kembali
      </p>
      <h1 className="mt-8 flex items-center gap-x-2 text-2xl font-semibold">
        <svg
          width="26"
          height="27"
          viewBox="0 0 26 27"
          fill="none"
          xmlns="https://www.w3.org/2000/svg"
        >
          <path
            d="M6.58649 10.0324L7.97352 11.4195L10.7476 8.64539M14.2152 10.7259H19.0698M6.58649 16.9676L7.97352 18.3546L10.7476 15.5805M14.2152 17.6611H19.0698M1.29863 17.5661C0.67129 14.8917 0.671291 12.1083 1.29863 9.43391C2.16729 5.73068 5.0588 2.83916 8.76204 1.9705C11.4365 1.34317 14.2198 1.34317 16.8942 1.9705C20.5975 2.83916 23.489 5.73068 24.3576 9.43391C24.985 12.1083 24.985 14.8917 24.3576 17.5661C23.489 21.2693 20.5975 24.1608 16.8942 25.0295C14.2198 25.6568 11.4365 25.6568 8.76204 25.0295C5.0588 24.1608 2.16729 21.2693 1.29863 17.5661Z"
            stroke="#1D1D1F"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Asesmen
      </h1>
      <hr className="w-10/12 text-border mt-3" />
      <div className="pb-5">
        {menus.map((menu, index) => (
          <Menu
            key={index}
            title={menu.title}
            subMenu={menu.subMenu}
            href={menu.href}
            activeId={activeId}
            activeAccordion={activeAccordion}
            toggleAccordion={toggleAccordion}
            handleNavigation={handleNavigation}
            isLoading={isLoading}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
