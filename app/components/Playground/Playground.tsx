import { useState } from "react";
import AICarController from "../AICarController";
import AICarUI from "./AICarUI";
import ControlPanel from "./ControlPanel/ControlPanel";
import AIVisualizer from "./AIVisualizer";

export default function Playground() {
  const [carController, setCarController] = useState(new AICarController());

  return (
    <div className="flex">
      <div id="AICarUI" className="mx-2">
        <AICarUI carController={carController} />
      </div>
      <div id="AIControlPanel" className="flex mx-2 items-center">
        <ControlPanel carController={carController} />
      </div>
      <div id="AIVisualizer" className="flex mx-2">
        <AIVisualizer carController={carController} />
      </div>
    </div>
  );
}
