import React from "react";
import Image from "next/image";
import IconLogin from "../../../public/assets/test-icon.png";
import Logo from "../../../public/assets/logo.png";
import Frame from "../../../public/assets/frame-3.png";
import CustomInput from "@/components/dropdown";
import Button from "@/components/button";
import TextInput from "@/components/input-text";
import PasswordInput from "@/components/password";
const Login = () => {
  const handleLogin = {};
  return (
    <div className="min-h-screen flex">
      {/* Left side with image background */}
      <div className="w-[60%] relative">
        {/* Image as background with cover fit */}
        <div className="absolute top-0 right-0 bottom-0 left-0 -z-10">
          <Image
            src={Frame}
            alt="Background Image"
            layout="fill"
            objectFit="cover" // Ensures the image covers the full container without being stretched
          />
        </div>

        <div className="relative flex flex-col justify-center items-center min-h-screen z-10">
          <div className="w-full flex flex-col items-start justify-start ">
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
            <h2 className="text-2xl font-bold ">Masuk Akun</h2>
            <p className="text-start text-base">
              Belum memiliki akun?{" "}
              <a href="/signup" className="font-bold text-accent">
                Buat Akun
              </a>
            </p>
          </div>
          <form>
            <div className="mb-4">
              <TextInput
                label={"Masukan nama pengguna atau email pengguna"}
                name={"username"}
                placeholder={"Misal: John Doe atau johndoe@xyz.com"}
              />
            </div>
            <div className="mb-6">
              <PasswordInput
                label={"Masukan kata sandi"}
                name={"password"}
                placeholder={"8 karakter di awali huruf besar"}
              />
            </div>
            <div className="flex w-full items-center justify-between">
              <Button label={"Masuk"} onClick={handleLogin} withIcon={false} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
