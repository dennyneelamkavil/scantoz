import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";

// export this helper so you can use `auth()` anywhere
export async function auth() {
  return getServerSession(authOptions);
}
