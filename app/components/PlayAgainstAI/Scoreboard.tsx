import { useCallback, useEffect, useRef, useState } from "react";
import type Game from "./Game";

interface ScoreboardProps {
  game: Game;
}

export default function Scoreboard({ game }: ScoreboardProps) {
  const [userResult, setUserResult] = useState(0);
  const [aiResult, setAIResult] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAIScore] = useState(0);
  const [result, setResult] = useState("");
  const requestRef = useRef<number>();

  const loadLocalStorage = () => {
    if (typeof window !== "undefined") {
      const localUserScore = localStorage.getItem("userScore");
      const localAiScore = localStorage.getItem("aiScore");
      setUserScore(localUserScore ? parseInt(localUserScore) : 0);
      setAIScore(localAiScore ? parseInt(localAiScore) : 0);
    }
  };

  const setLocalStorage = useCallback(
    (result: string) => {
      if (typeof window !== "undefined") {
        result === "You Won"
          ? localStorage.setItem("userScore", String(userScore + 1))
          : localStorage.setItem("aiScore", String(aiScore + 1));
      }
    },
    [aiScore, userScore]
  );

  const updateScore = useCallback(() => {
    let resultString = "";
    if (userResult > aiResult) {
      resultString = "You Won";
      setLocalStorage(resultString);
    } else if (aiResult > userResult) {
      resultString = "You Lost";
      setLocalStorage(resultString);
    } else if (userResult === 1 && aiResult === 1) {
      resultString = "Tie";
    }
    setResult(resultString);
  }, [aiResult, setLocalStorage, userResult]);

  const checkScore = useCallback(() => {
    setAIResult(game.ai.result);
    setUserResult(game.user.result);
    if (result === "") updateScore();
    if (game.ai.result === 0 && game.user.result === 0 && result != "")
      setResult("");
    requestRef.current = requestAnimationFrame(checkScore);
  }, [game.ai.result, game.user.result, result, updateScore]);

  useEffect(() => {
    loadLocalStorage();
    checkScore();
    return () => cancelAnimationFrame(requestRef.current as number);
  }, [checkScore]);

  return (
    <div className="w-full flex flex-wrap justify-center">
      <p className="text-4xl font-semibold text-slate-300 p-2">Score</p>
      <div className="flex w-full justify-around mb-2">
        <div className="text-slate-200 text-center w-14">
          <p className="text-3xl font-semibold">AI</p>
          <p className="text-2xl font-normal">{aiScore}</p>
        </div>
        <div className="text-slate-200 text-center w-14">
          <p className="text-3xl font-semibold">You</p>
          <p className="text-2xl font-normal">{userScore}</p>
        </div>
      </div>
      {result !== "" ? (
        <div className="">
          <p className="text-5xl text-slate-200 text-center p-4 font-bold">
            {result}
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
