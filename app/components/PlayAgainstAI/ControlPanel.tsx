import PlayButton from "./PlayButton";

export default function ControlPanel({ setGameActive }: any) {
  return (
    <div className="flex flex-wrap self-center justify-center w-64 bg-slate-700 rounded-2xl shadow-2xl mx-8">
      <PlayButton setGameActive={setGameActive} />
    </div>
  );
}
