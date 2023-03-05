import type AICarController from "../../AICarController";

interface MutationControlProps {
  carController: AICarController;
}

export default function MutationControl({
  carController,
}: MutationControlProps) {
  const handleInput = (e: any) => {
    let percent: number = parseFloat(e.target.value) / 100;
    if (percent > 100 || percent < 0 || Number.isNaN(percent)) return;
    carController.updateMutationPercent(percent);
    localStorage.setItem("mutationPercent", String(percent));
  };

  return (
    <div className="flex justify-between align-center mt-4 mx-6">
      <p className="text-slate-50 self-center">Mutation Percent:</p>
      <input
        type="number"
        inputMode="numeric"
        name=""
        max="100"
        min="0"
        step="1"
        defaultValue={carController.mutationPercent * 100}
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
