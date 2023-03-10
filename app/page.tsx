"use client";

import Navbar from "./components/Navbar";
import PlaygroundContainer from "./components/Playground/PlaygroundContainer";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <PlaygroundContainer />
    </div>
  );
}
