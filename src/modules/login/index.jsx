"use client";
import React, { useState } from "react";
import Image from "next/image";
import IconLogin from "../../../public/assets/test-icon.png";
import Logo from "../../../public/assets/logo.png";
import LogoUnnes from "../../../public/assets/logo-unnes.png";
import Frame from "../../../public/assets/frame-3.png";
import Button from "@/components/button";
import TextInput from "@/components/input-login";
import PasswordInput from "@/components/password";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    let isValid = true;

    // Reset errors
    setErrors({ username: "", password: "" });

    // Validate inputs
    if (!username) {
      setErrors((prev) => ({
        ...prev,
        username: "Username is required",
      }));
      toast.error("Username is required");
      isValid = false;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      toast.error("Password is required");
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await fetch(
          "https://swhytbiyrgsovsl-evfpthsuvq-et.a.run.app/account/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username.trim(),
              password: password.trim(),
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong");
        }

        const data = await response.json();
        console.log("Login successful", data);
        toast.success("Login successful");

        sessionStorage.setItem("accessToken", data.data.accessToken);

        router.push("/assessment");
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Login failed: " + error.message);
        setErrors((prev) => ({
          ...prev,
          username: error.message,
        }));
      }
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <ToastContainer />

      <div className="w-[55%] relative">
        <div className="absolute top-0 right-0 bottom-0 left-0 -z-10">
          <Image
            src={Frame}
            alt="Background Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex justify-center w-28 ml-[350px]  bg-white shadow-xl px- rounded-2xl py-2 mt-10 items-center  lg:gap-x-5 z-50">
          <Image src={Logo} alt="Logo" className="w-8 h-8 lg:w-9 lg:h-9" />
          <Image
            src={LogoUnnes}
            alt="Logo"
            className="w-5 -ml-[8px]  h-4 lg:w-[30px] lg:h-[42px] "
          />

          {/* <p className="text-white font-semibold text-xs lg:text-base">
            Assesmen <br /> Kesiapsiagaan
          </p> */}
        </div>
        <div className="relative flex flex-col justify-center items-center min-h-screen -mt-32 z-10">
          <div className="w-full flex flex-col items-start justify-start">
            <div className="px-10 mx-auto space-y-12 flex flex-col mt-20 items-center z-20">
              <Image
                src={IconLogin}
                alt="Login Image"
                className="w-[50vw] max-w-[250px] lg:max-w-[400px] max-h-[50vh] object-contain"
              />

              <p className="text-center font-bold text-white text-xs sm:text-sm md:text-lg lg:text-4xl ">
                Instrumen Asessmen <br />
                Kesiapsiagaan
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[40%] bg-white flex flex-col justify-center items-center px-10">
        <div className="max-w-lg w-full mt-14">
          <div className="mb-6">
            <h2 className="text-2xl font-bold ">Masuk Akun</h2>
            <p className="text-start text-base">
              Belum memiliki akun?{" "}
              <a href="/signup" className="font-bold text-accent">
                Buat Akun
              </a>
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <TextInput
                label={"Masukan nama pengguna"}
                name={"username"}
                placeholder={"Misal: John Doe atau johndoe@xyz.com"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={errors.username}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
            <div className="mb-6">
              <PasswordInput
                label={"Masukan kata sandi"}
                name={"password"}
                placeholder={"8 karakter di awali huruf besar"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div className="flex w-full items-center justify-between">
              <Button label={"Masuk"} type="submit" withIcon={false} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
