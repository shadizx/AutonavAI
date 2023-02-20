import AIContainer from "~/components/AIContainer/AIContainer";

export default function PlaygroundRoute() {
  return (
    <div
      id="background"
      className="m-0 h-screen bg-slate-800 flex items-center justify-center min-w-min"
    >
      <AIContainer />
    </div>
  );
}
