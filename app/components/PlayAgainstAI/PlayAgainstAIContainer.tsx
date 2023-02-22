import { useState } from "react";
import AICarController from "../AICarController";
import AIControlPanel from "../Playground/AIControlPanel/AIControlPanel";

export default function PlayAgainstAIContainer() {
  const [carController, setCarController] = useState(new AICarController());

  return (
    <div className="flex flex-wrap justify-center content-center h-screen">
      <AIControlPanel carController={carController} />
      <AIControlPanel carController={carController} />
      <AIControlPanel carController={carController} />
    </div>
  );
}
