"use client";

import Navbar from "../components/Navbar";
import PlayAgainstAIContainer from "../components/PlayAgainstAI/PlayAgainstAIContainer";

export default function PlayAgainstAIRoute() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <PlayAgainstAIContainer />
    </div>
  );
}
