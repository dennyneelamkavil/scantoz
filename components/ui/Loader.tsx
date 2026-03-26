"use client";

import Image from "next/image";

export default function Loader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white dark:bg-black">
      {/* Spinner Container */}
      <div className="relative w-24 h-24">
        {/* Brand Gradient Ring */}
        <div
          className="
            absolute inset-0 rounded-full
            animate-spinSmooth
            bg-[conic-gradient(
              at_center,
              #5B46A300_0%,
              #5B46A366_20%,
              #7AC943AA_45%,
              #5B46A3FF_70%,
              #4A3A8CFF_100%
            )]
          "
        />

        {/* Inner Mask */}
        <div className="absolute inset-2 rounded-full bg-white dark:bg-black" />

        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Scantoz Logo"
          fill
          className="object-contain p-4"
        />
      </div>

      {/* Loading Text */}
      <p className="text-[#5B46A3] dark:text-[#7AC943] text-sm font-medium">
        Loading
        <span className="dot-1">.</span>
        <span className="dot-2">.</span>
        <span className="dot-3">.</span>
      </p>
    </div>
  );
}
