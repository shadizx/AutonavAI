import type AICarController from "../../AICarController";

interface SpeedControlProps {
  carController: AICarController;
}

export default function SpeedControl({ carController }: SpeedControlProps) {
  const handleInput = (e: any) => {
    const speed: number = parseInt(e.target.value);
    if (speed > 5 || speed < 3 || Number.isNaN(speed)) return;
    carController.updateCarSpeed(speed);
    localStorage.setItem("carSpeed", String(speed));
  };

  return (
    <div className="flex justify-between align-center mt-4 mx-6">
      <p className="text-slate-50 self-center">Speed:</p>
      <input
        type="number"
        inputMode="numeric"
        name=""
        max="5"
        min="3"
        defaultValue={carController.carSpeed}
        className="w-14 m-2 bg-slate-700 px-2 py-1
        text-base
        font-normal
        text-slate-50
        bg-clip-padding
        border border-solid border-slate-500
        rounded
        transition
        ease-in-out
        focus:text-slate-50 focus:bg-gray-700 focus:border-blue-600 focus:outline-none"
        onInput={handleInput}
      />
    </div>
  );
}
