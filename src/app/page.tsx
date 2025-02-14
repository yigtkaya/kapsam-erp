import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function RootPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionid");

  if (sessionId) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
