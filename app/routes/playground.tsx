import AIContainer from "~/components/AIContainer/AIContainer";
import Navbar from "~/components/Navbar";

export default function PlaygroundRoute() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex justify-center items-center">
        <AIContainer />
      </div>
    </div>
  );
}
