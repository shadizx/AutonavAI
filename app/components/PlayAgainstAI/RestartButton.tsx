import Game from "./Game";

export default function Restart({ setGame }: any) {
  return (
    <button
      className="border rounded-3xl px-12 py-2 bg-green-500 hover:bg-green-600 my-4"
      onClick={() => setGame(new Game(true))}
    >
      <p>Restart</p>
    </button>
  );
}
