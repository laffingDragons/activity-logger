import { useState } from "react";
import { motion } from "framer-motion";

function OnboardingTour({ onComplete }) {
  const steps = [
    { target: ".log-form", text: "Use this form to log your activities." },
    { target: ".chart-selector", text: "View your progress with animated charts." },
    { target: ".log-table", text: "Edit or delete logs here." },
    { target: "header button", text: "Customize themes in settings." },
  ];

  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 frosted-glass flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-4 rounded-lg max-w-sm">
        <p className="mb-4">{steps[step].text}</p>
        <div className="flex gap-2">
          <motion.button
            onClick={onComplete}
            className="neumorphic p-2 bg-gray-500 text-white"
            whileTap={{ scale: 0.9 }}
          >
            Skip
          </motion.button>
          <motion.button
            onClick={handleNext}
            className="neumorphic p-2 bg-[var(--accent)] text-white"
            whileTap={{ scale: 0.9 }}
          >
            {step === steps.length - 1 ? "Finish" : "Next"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default OnboardingTour;