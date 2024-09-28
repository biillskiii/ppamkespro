import Image from "next/image";
import Error from "../../public/assets/404.png";
export default function NotFound() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <Image src={Error} alt="404" width={300} height={300} />
      <h2 className="font-bold text-3xl">Oops! Halaman tidak ditemukan.</h2>
      <p className="text-sm">
        Sepertinya halaman yang Anda cari tidak tersedia.
      </p>
      <p className="text-sm mt-5 ">
        Back to{" "}
        <a href="/" className="text-accent font-semibold">
          Login
        </a>
      </p>
    </div>
  );
}
