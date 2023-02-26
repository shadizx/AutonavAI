import { useState } from "react";
import AICarController from "../AICarController";
import CarUI from "./CarUI";
import CarController from "./CarController";
import ControlPanel from "./ControlPanel";
import AICarUI from "../Playground/AICarUI";

export default function PlayAgainstAIContainer() {
  const [AICarHandler, setAICarHandler] = useState(new AICarController());
  const [userCarHandler, setUserCarHandler] = useState(new CarController(4, 4));
  const [isGameStarted, startGame] = useState(false);

  return (
    <div className="flex flex-wrap justify-center content-center h-screen">
      <AICarUI carController={AICarHandler} isGameStarted={isGameStarted} />
      <ControlPanel startGame={startGame} />
      <CarUI carController={userCarHandler} isGameStarted={isGameStarted} />
    </div>
  );
}
