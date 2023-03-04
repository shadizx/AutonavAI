import { useEffect, useState } from "react";
import AICarUI from "../Playground/AICarUI";
import CarUI from "./CarUI";
import ControlPanel from "./ControlPanel";
import Game from "./Game";

export default function PlayAgainstAIContainer() {
  const [game, setGame] = useState(new Game());
  const [isGameActive, setGameActive] = useState(game.active);

  useEffect(() => {});
  return (
    <div className="flex flex-wrap justify-center content-center h-screen">
      <AICarUI carController={game.ai} isGameActive={isGameActive} />
      <ControlPanel
        game={game}
        setGameActive={setGameActive}
        setGame={setGame}
      />
      <CarUI game={game} isGameActive={isGameActive} />
    </div>
  );
}
