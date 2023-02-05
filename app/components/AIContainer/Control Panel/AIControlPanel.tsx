import AICarController from "../AICarController";
import Counter from "./Counter";

interface AIControlPanelProps {
  carController: AICarController;
}

export default function AIControlPanel({ carController }: AIControlPanelProps) {
  const handleInput = (e: any) => {
    console.log(e.target.value);
    const speed = e.target.value;
    carController.updateCarSpeed(speed);
  };

  return (
    <div className="flex flex-wrap self-center justify-center w-64 bg-slate-700 rounded-2xl shadow-2xl">
      <div className="w-full">
        <Counter carController={carController} />
      </div>
      <div className="flex items-center justify-center mx-2 mb-2 p-1 w-full">
        <p className="text-slate-50">Speed:</p>
        <input
          type="number"
          name=""
          max="10"
          min="1"
          defaultValue={carController.carSpeed}
          className="w-11 m-2"
          onInput={handleInput}
        />
      </div>
    </div>
  );
}
