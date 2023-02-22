import { useState } from "react";
import AICarController from "../AICarController";
import AICarUI from "./AICarUI";
import AIControlPanel from "./AIControlPanel/AIControlPanel";
import AIVisualizer from "./AIVisualizer";

export default function PlaygroundContainer() {
  const [carController, setCarController] = useState(new AICarController());

  return (
    <div className="flex flex-wrap justify-center content-center h-screen">
      <AICarUI carController={carController} />
      <AIControlPanel carController={carController} />
      <AIVisualizer carController={carController} />
    </div>
  );
}
