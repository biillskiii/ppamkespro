"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Maintenance from "../../public/assets/maintance.png";

const Page = () => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const targetDate = new Date("2024-09-23T16:59:00Z"); // 23:59 WIB is 16:59 UTC

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(`${hours} : ${minutes} : ${seconds}s`);
      } else {
        setTimeLeft("Maintenance completed");
      }
    };

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <Image src={Maintenance} alt="Maintenance" width={360} />
      <h1 className="font-extrabold text-2xl mt-5">
        Oops, sistem sedang dalam pemeliharaan.
      </h1>
      <p className="font-medium text-base">
        Harap periksa kembali nanti untuk melanjutkan aktivitas Anda.
      </p>
      <p className="text-sm mt-5 flex items-center text-[#636363]">
        Perkiraan waktu pemeliharaan selesai:{" "}
        <span className="text-accent flex items-center gap-x-5">
          23 September 2024 <span className="list-item">23.59 WIB</span>
        </span>
      </p>
      <p className="font-extrabold text-accent text-3xl mt-4">{timeLeft}</p>
    </div>
  );
};

export default Page;

// import React from 'react'
// import Login from "@/modules/login";

// const page = () => {
//   return <Login/>
// }

// export default page
