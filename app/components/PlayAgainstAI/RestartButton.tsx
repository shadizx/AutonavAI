import type Game from "./Game";

interface RestartButtonProps {
  game: Game;
}

export default function Restart({ game }: RestartButtonProps) {
  return (
    <button className="border rounded-3xl px-12 py-2 bg-green-500 hover:bg-green-600 my-4">
      <p>Restart</p>
    </button>
  );
}
