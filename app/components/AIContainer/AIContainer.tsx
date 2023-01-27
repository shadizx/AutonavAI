import { useState } from "react";
import AICarController from "./AICarController";
import AICarUI from "./AICarUI";
import AIVisualizer from "./Network/AIVisualizer";

export default function AIContainer() {
  const [carController, setCarController] = useState(new AICarController());

  return (
    <div className="flex">
      <div id="AICarUI" className="mx-2">
        <AICarUI carController={carController} />
      </div>
      <div id="AIVisualizer" className="mx-2">
        <AIVisualizer carController={carController} />
      </div>
    </div>
  );
}
