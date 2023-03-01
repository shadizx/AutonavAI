import Game from "./Game";
import PlayButton from "./PlayButton";

interface ControlPanelProps {
  game: Game;
  setGame: Function;
}

export default function ControlPanel({ game, setGame }: ControlPanelProps) {
  return (
    <div className="flex flex-wrap self-center justify-center w-64 bg-slate-700 rounded-2xl shadow-2xl mx-8">
      <PlayButton game={game} setGame={setGame} />
    </div>
  );
}
