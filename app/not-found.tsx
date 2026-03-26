import { Metadata } from "next";
import NotFoundClient from "@/components/error/NotFoundClient";

export const metadata: Metadata = {
  title: "404 – Page Not Found | Scantoz Admin",
  description:
    "The page you are looking for does not exist or has been moved in the Scantoz admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
