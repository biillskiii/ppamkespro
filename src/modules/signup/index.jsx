"use client";
import React, { useState } from "react";
import Image from "next/image";
import IconLogin from "../../../public/assets/test-icon.png";
import Logo from "../../../public/assets/logo.png";
import Frame from "../../../public/assets/frame-3.png";
import TextInput from "@/components/input-login";
import PasswordInput from "@/components/password";
import Button from "@/components/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    institute: "",
    password: "",
    confirmPassword: "",
    status: "submitter",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.institute ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Semua input wajib diisi!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok!");
      return;
    }

    try {
      const response = await fetch(
        "https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/account/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Pendaftaran akun berhasil!");
        router.push("/login");
      } else {
        toast.error(`Gagal mendaftar: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Terjadi kesalahan saat mendaftar. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <ToastContainer />
      {/* Left side with image background */}
      <div className="w-[60%] relative">
        <div className="absolute top-0 right-0 bottom-0 left-0 -z-10">
          <Image
            src={Frame}
            alt="Background Image"
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div className="relative flex flex-col justify-center items-center min-h-screen z-10">
          <div className="w-full flex flex-col items-start justify-start">
            <div className="flex justify-start pl-8 -mt-14 items-center gap-x-5">
              <Image src={Logo} alt="Logo" width={40} height={40} />
              <p className="text-white font-semibold text-base">
                Assesment <br /> Kesiapsiagaan
              </p>
            </div>
            <div className="px-10 mx-auto space-y-12 flex flex-col mt-20 items-center z-20">
              <Image
                src={IconLogin}
                alt="Login Image"
                width={450}
                className=""
              />
              <p className=" text-center font-bold text-white text-4xl">
                Instrumen Asessmen <br />
                Kesiapsiagaan{" "}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-[40%] bg-white flex flex-col justify-center items-center">
        <div className="max-w-lg w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold ">Daftar Akun</h2>
            <p className="text-start text-base">
              Sudah memiliki akun?{" "}
              <a href="/login" className="font-bold text-accent">
                Masuk Akun
              </a>
            </p>
          </div>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <TextInput
                label={"Masukan nama pengguna"}
                name={"username"}
                placeholder={"Misal: John Doe"}
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 w-full">
              <TextInput
                label={"Masukan email pengguna"}
                name={"email"}
                type={"email"}
                placeholder={"Misal: johndoe@xyz.com"}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 w-full">
              <TextInput
                label={"Nama institute"}
                name={"institute"}
                placeholder={"Misal: Dinas Kesehatan Kota Semarang"}
                value={formData.institute}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-x-12">
              <div className="mb-6">
                <PasswordInput
                  label={"Buat kata sandi"}
                  name={"password"}
                  placeholder={"8 karakter di awali huruf besar"}
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-6">
                <PasswordInput
                  label={"Masukan ulang kata sandi"}
                  name={"confirmPassword"}
                  placeholder={"8 karakter di awali huruf besar"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <Button label={"Daftar Akun"} type="submit" withIcon={false} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
