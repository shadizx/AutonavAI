import Game from "./Game";

interface PlayButtonProps {
  game: Game;
  setGame: Function;
}

export default function PlayButton({ game, setGame }: PlayButtonProps) {
  return (
    <button
      className="border rounded-3xl px-12 py-2 bg-green-500 hover:bg-green-600 my-4"
      onClick={() =>
        setGame(
          new Game(
            game.ai,
            game.user,
            game.setAIController,
            game.setUserController,
            true
          )
        )
      }
    >
      <p>Play</p>
    </button>
  );
}
