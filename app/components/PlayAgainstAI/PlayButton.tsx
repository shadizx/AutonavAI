export default function PlayButton({ setGameActive }: any) {
  return (
    <button
      className="border rounded-3xl px-12 py-2 bg-green-500 hover:bg-green-600 my-4"
      onClick={() => setGameActive(true)}
    >
      <p>Play</p>
    </button>
  );
}
