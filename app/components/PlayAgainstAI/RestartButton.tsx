import Game from "./Game";

export default function RestartButton({ setGame }: any) {
  return (
    <button
      className="border rounded-3xl px-12 py-2 bg-green-500 hover:bg-green-600 my-4 text-slate-700 font-medium text-2xl"
      onClick={() => setGame(new Game(true))}
    >
      <p>Restart</p>
    </button>
  );
}
