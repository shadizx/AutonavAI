import { useState } from "react";
import AICarController from "../AICarController";
import CarUI from "./CarUI";
import CarController from "./CarController";
import ControlPanel from "./ControlPanel";
import AICarUI from "../Playground/AICarUI";
import Game from "./Game";

export default function PlayAgainstAIContainer() {
  const [aiController, setAiController] = useState(new AICarController());
  const [userController, setUserController] = useState(new CarController(4, 4));
  const [game, setGame] = useState(
    new Game(aiController, userController, setAiController, setUserController)
  );

  return (
    <div className="flex flex-wrap justify-center content-center h-screen">
      <AICarUI carController={aiController} game={game} />
      <ControlPanel game={game} setGame={setGame} />
      <CarUI carController={userController} game={game} />
    </div>
  );
}
