import { Metadata } from "next";
import Error403Client from "@/components/error/Error403Client";

export const metadata: Metadata = {
  title: "403 – Access Denied | Scantoz Admin",
  description:
    "You do not have permission to access this page in the Scantoz admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Error403() {
  return <Error403Client />;
}
