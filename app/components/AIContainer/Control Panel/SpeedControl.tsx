import AICarController from "../AICarController";

interface SpeedControlProps {
  carController: AICarController;
}

export default function SpeedControl({ carController }: SpeedControlProps) {
  const handleInput = (e: any) => {
    const speed = e.target.value;
    carController.updateCarSpeed(speed);
  };

  return (
    <div className="flex justify-between align-center my-4 mx-6 border">
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
