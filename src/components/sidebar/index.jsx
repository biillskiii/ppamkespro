'use client';

import React, { useState } from "react";
import {
  IoMdArrowRoundBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";

const Sidebar = ({ activeId }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [sesiAktif, setSesiAktif] = useState({
    Bagian: 0,
    Assesmen: 0
  });
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

  const menus = [
    {
      id: 0,
      title: "Bagian 0",
      href: "/assesstment/bagian-0",
    },
    {
      title: "Bagian I",
      href: "/assesstment/bagian-1",
      subMenu: [
        {
          id: 1,
          title:
            "Asesmen 1",
          desc: "Pertanyaan 1–7",
          href: "/assesstment/bagian-0",
        },
        {
          id: 2,
          title:
            "Asesmen 2",
          desc: "Pertanyaan 8–13",
          href: "/assesstment/bagian-1?input-8_comment=&input-9_comment=&input-10_comment=&input-11_comment=&input-12_comment=&input-13_comment=",
        },
        {
          id: 3,
          title: "Asesmen 3",
          desc: "Pertanyaan 14–17",
          href: "#",
        },
        {
          id: 4,
          title: "Asesmen 4",
          desc: "Pertanyaan 18–21",
          href: "#",
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
          href: "#",
        },
        {
          id: 6,
          title:
            "Asesmen 2",
          desc: "Pertanyaan 31–36",
          href: "#",
        },
        {
          id: 7,
          title:
            "Asesmen 3",
          desc: "Pertanyaan 37–42",
          href: "#",
        },
        {
          id: 8,
          title:
            "Asesmen 4",
          desc: "Pertanyaan 43–47",
          href: "#",
        },
        {
          id: 9,
          title: "Asesmen 5",
          desc: "Pertanyaan 48–52",
          href: "#",
        },
        {
          id: 10,
          title: "Asesmen 6",
          desc: "Pertanyaan 53–57",
          href: "#",
        },
        {
          id: 11,
          title: "Komponen PPAM 7: Layananminum kesehatan Balita",
          desc: "Pertanyaan 58–62",
          href: "#",
        },
        {
          id: 12,
          title: "Komponen PPAM 8: Layanan Minimum Kesehatan Lansia",
          desc: "Pertanyaan 63-67",
          href: "#",
        },
        {
          id: 13,
          title:
            "Kegiatan prioritas lainnya: Perawatan aborsi yang aman sesuai dengan hukum yang berlaku",
          desc: "Pertanyaan 68-73",
          href: "#",
        },
      ],
    },
  ];

  function Menu({title, subMenu=[{
    title: 'Bagian'
  }], accordion}) {

    const isActive = activeAccordion === title;

    function Assesstment({ title, desc, id }) {
      return (
        <button className="flex h-full w-full">
          <a
            href="#"
            className={`mb-2
              ${
                activeId === id
                  ? "bg-accent rounded-lg py-4 pl-4 text-white"
                  : ""
              }
            `}
            onClick={() => handleSectionClick(title)}
          >
            {title}
          </a>
        </button>
      );
    }

    // console.log(subMenu)
    return (
      <div
        className={`flex flex-col mt-10 w-10/12 cursor-pointer justify-center ${ (activeId === 0) && (title === 'Bagian 0') ? ' bg-accent py-3 pl-3 rounded-lg text-white' : ''}`}
        onClick={ () => toggleAccordion(title)}
        // style={
        //   bacg
        // }
      >
        <div className={`flex items-center h-auto justify-between `}>
          <div className="flex items-center h-full gap-x-2">
            <FaCircleCheck size={24} color="#CCC" /> <span>{title}</span>
          </div>
          {title === 'Bagian 0' ? () => {} :  activeAccordion === title ? (
            <IoIosArrowDown size={16} />
          ) : (
            <IoIosArrowForward size={16} />
          )}
        </div>
        {activeAccordion === title && activeAccordion !== 'Bagian 0' && (
          <div className="pl-6 mt-4">
            {/* Tambahkan item assessment untuk Bagian 02 */}
            { subMenu.length > 1 && subMenu.map( (item, index) => (
              <Assesstment key={index} title={`Asesmen-${index + 1}`} accordion={title} id={item.id} />
            ))}
          </div>
        )}
      </div>
    );
  }

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

      {/* Check */}
      { menus.map( (item, index) => (
        <Menu key={index} title={item.title} subMenu={item.subMenu} />
      ))}
    </div>
  );
};

export default Sidebar;
