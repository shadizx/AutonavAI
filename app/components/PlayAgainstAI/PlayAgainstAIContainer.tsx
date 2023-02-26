import { useState } from "react";
import AICarController from "../AICarController";
import CarUI from "../Car/CarUI";
import CarController from "../CarController";
import AIControlPanel from "../Playground/AIControlPanel/AIControlPanel";

export default function PlayAgainstAIContainer() {
  const [AICarHandler, setAICarHandler] = useState(new AICarController());
  const [userCarHandler, setUserCarHandler] = useState(new CarController());

  return (
    <div className="flex flex-wrap justify-center content-center h-screen">
      <AIControlPanel carController={AICarHandler} />
      <AIControlPanel carController={AICarHandler} />
      <CarUI carController={userCarHandler} />
    </div>
  );
}
