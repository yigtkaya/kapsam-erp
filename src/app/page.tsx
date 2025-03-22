import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionid");

  // Redirect to dashboard if authenticated, login if not
  if (sessionId?.value) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  // This return is never reached due to redirects,
  // but required for TypeScript
  return null;
}
