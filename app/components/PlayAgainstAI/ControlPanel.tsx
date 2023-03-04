import { useEffect, useRef, useState } from "react";
import PlayButton from "./PlayButton";
import type Game from "./Game";
import RestartButton from "./RestartButton";

interface ControlPanelProps {
  game: Game;
  setGameActive: any;
  setGame: any;
}

export default function ControlPanel({
  game,
  setGameActive,
  setGame,
}: ControlPanelProps) {
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setUserScore(game.user.result);
      setAiScore(game.ai.result);
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(requestRef.current as number);
  }, [game.ai.result, game.user.result]);

  return (
    <div className="flex flex-wrap self-center justify-center w-64 bg-slate-700 rounded-2xl shadow-2xl mx-2">
      {userScore === 0 ? (
        <PlayButton setGameActive={setGameActive} />
      ) : (
        <RestartButton setGame={setGame} />
      )}
    </div>
  );
}
