import { redirect } from "next/navigation";

/**
 * The app's only meaningful page is `/posts`, so send the root there.
 */
export default function Home() {
  redirect("/posts");
}
