import AICarController from "../AICarController";

interface SpeedControlProps {
  carController: AICarController;
}

export default function SpeedControl({ carController }: SpeedControlProps) {
  const handleInput = (e: any) => {
    const speed: string = e.target.value;
    carController.updateCarSpeed(parseFloat(speed));
    localStorage.setItem("carSpeed", speed);
  };

  return (
    <div className="flex justify-between align-center mt-4 mx-6">
      <p className="text-slate-50 self-center">Speed:</p>
      <input
        type="number"
        name=""
        max="5"
        min="3"
        defaultValue={carController.carSpeed}
        className="w-11 m-2"
        onInput={handleInput}
      />
    </div>
  );
}
