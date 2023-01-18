import { useState } from "react";
import Car from "../Car/Car";
import AICarUI from "./AICarUI";
import AIVisualizer from "./Network/AIVisualizer";

export default function AIContainer() {
  // initialize default car
  const [car, setCar] = useState(new Car(0, 0, 0, 0, null, ""));

  return (
    <div>
      <div id="AICarUI" className="inline-block">
        <AICarUI setCar={setCar} />
      </div>
      <div id="AIVisualizer" className="inline-block">
        <AIVisualizer car={car} />
      </div>
    </div>
  );
}
