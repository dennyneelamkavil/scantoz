import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scantoz - Admin Dashboard",
  description: "Admin dashboard for Scantoz",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Home() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Dashboard
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Analytics and reports will appear here
      </p>
    </div>
  );
}
