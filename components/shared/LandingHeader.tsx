import React from "react";
import Image from "next/image";
import Link from "next/link";

const LandingHeader = () => (
  <div className="fixed flex items-center justify-between w-screen px-8 my-8">
    <Link href="/">
      <Image
        src="/assets/Logo.png"
        height={135 / 3}
        width={827 / 3}
        priority
        className="cursor-pointer"
      />
    </Link>
    <div className="flex ml-auto">
      <Link href="/prices">
        <strong className="ml-4 text-2xl font-medium cursor-pointer hover:underline">
          Preços
        </strong>
      </Link>
      <Link href="/login">
        <strong className="ml-4 text-2xl font-medium cursor-pointer hover:underline">
          Login
        </strong>
      </Link>
      <Link href="/create-account">
        <strong className="ml-4 text-2xl font-medium cursor-pointer hover:underline">
          Criar conta
        </strong>
      </Link>
    </div>
  </div>
);

export default LandingHeader;
