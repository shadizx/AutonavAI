import { useCallback, useEffect, useRef, useState } from "react";
import PlayButton from "./PlayButton";
import RestartButton from "./RestartButton";
import Scoreboard from "./Scoreboard";
import type Game from "./Game";

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
  const requestRef = useRef<number>();

  const animate = useCallback(() => {
    setUserScore(game.user.result);
    requestRef.current = requestAnimationFrame(animate);
  }, [game.user.result]);

  useEffect(() => {
    animate();
    return () => cancelAnimationFrame(requestRef.current as number);
  }, [animate]);

  return (
    <div className="flex flex-wrap self-center justify-center w-64 bg-slate-700 rounded-2xl shadow-2xl mx-2">
      {userScore === 0 ? (
        <PlayButton setGameActive={setGameActive} />
      ) : (
        <RestartButton setGame={setGame} />
      )}
      <Scoreboard game={game} />
    </div>
  );
}
