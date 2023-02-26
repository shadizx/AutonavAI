import PlayButton from "./PlayButton";

interface ControlPanelProps {
  startGame: any;
}

export default function ControlPanel({ startGame }: ControlPanelProps) {
  return (
    <div className="flex flex-wrap self-center justify-center w-64 bg-slate-700 rounded-2xl shadow-2xl mx-8">
      <PlayButton startGame={startGame} />
    </div>
  );
}
