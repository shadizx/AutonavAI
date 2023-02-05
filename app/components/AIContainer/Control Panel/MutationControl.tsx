import AICarController from "../AICarController";

interface MutationControlProps {
  carController: AICarController;
}

export default function SpeedControl({ carController }: MutationControlProps) {
  const handleInput = (e: any) => {
    const percent = e.target.value;
    carController.updateMutationPercent(percent / 100);
  };

  return (
    <div className="flex justify-between align-center mt-4 mx-6">
      <p className="text-slate-50 self-center">Mutation Percent:</p>
      <input
        type="number"
        name=""
        max="100"
        min="0"
        step="1"
        defaultValue={carController.mutationPercent * 100}
        className="w-11 m-2"
        onInput={handleInput}
      />
    </div>
  );
}
