import { redirect } from "@remix-run/node";

export default function Home() {
  return redirect("/play-against-ai");
}
