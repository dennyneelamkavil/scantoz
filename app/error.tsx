"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowLeft, Home, RotateCcw } from "lucide-react";

import GridShape from "@/components/common/GridShape";
import { useGoBack } from "@/hooks";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const goBack = useGoBack();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />

      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-xl">
          Something went wrong
        </h1>

        <Image
          src="/images/error/500.svg"
          alt="Error"
          className="dark:hidden"
          width={472}
          height={152}
        />
        <Image
          src="/images/error/500-dark.svg"
          alt="Error"
          className="hidden dark:block"
          width={472}
          height={152}
        />

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          An unexpected error occurred. Please try again or return to the
          dashboard.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={goBack}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>

          {reset && (
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <RotateCcw className="mr-2" size={20} />
              Try Again
            </button>
          )}

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <Home className="mr-2" size={20} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - Scantoz
      </p>
    </div>
  );
}
