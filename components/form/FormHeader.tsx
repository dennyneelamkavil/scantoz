"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type FormHeaderProps = {
  title: string;
};

export default function FormHeader({ title }: FormHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex h-9 w-9 items-center justify-center rounded-lg
                   text-gray-600 hover:bg-gray-100
                   dark:text-gray-400 dark:hover:bg-white/5"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        {title}
      </h1>
    </div>
  );
}
