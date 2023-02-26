interface PlayButtonProps {
  startGame: any;
}

export default function PlayButton({ startGame }: PlayButtonProps) {
  return (
    <button
      className="border rounded-3xl px-12 py-2 bg-green-500 hover:bg-green-600 my-4"
      onClick={() => startGame(true)}
    >
      <p>Play</p>
    </button>
  );
}
