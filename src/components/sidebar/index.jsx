import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

const Sidebar = () => {
  return (
    <div className="bg-white pl-[31.83px] pt-[32px] w-[296px] h-screen fixed shadow-md">
      <p className="flex items-center gap-x-2 font-medium cursor-pointer">
        <IoMdArrowRoundBack size={15} />
        Kembali
      </p>
      <h1 className="mt-8  flex items-center gap-x-2 text-2xl font-semibold">
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
  );
};

export default Sidebar;
