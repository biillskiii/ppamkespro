import React from "react";
// import Login from "@/modules/login";
import Image from "next/image";
import Maintenance from "../../public/assets/maintance.png";
const Page = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <Image src={Maintenance} alt="Maintenance" width={360} />
      <h1 className="font-extrabold text-2xl">
        Oops, sistem sedang dalam pemeliharaan.
      </h1>
      <p className="font-medium text-base">
        Harap periksa kembali nanti untuk melanjutkan aktivitas Anda.
      </p>
      <p className="text-sm mt-5 flex items-center text-[#636363]">
        Perkiraan waktu pemeliharaan selesai :{" "}
        <span className="text-accent flex items-center gap-x-5">
          23 September 2024 <span className="list-item">23.59 WIB</span>
        </span>
      </p>
    </div>
    // To use the login component, uncomment the next line
    // return <Login />;
  );
};

export default Page;
