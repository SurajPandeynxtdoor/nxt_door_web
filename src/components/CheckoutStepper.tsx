// src/components/CheckoutStepper.tsx
"use client";

const steps = ["Cart", "Address", "Payment"];

const CheckoutStepper = ({ currentStep }: { currentStep: number }) => (
  <div className="flex justify-center items-center gap-4 mb-8">
    {steps.map((step, idx) => (
      <div key={step} className="flex items-center">
        <span
          className={`text-base font-semibold px-3 py-1 rounded ${
            idx === currentStep
              ? "bg-cyan-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {step}
        </span>
        {idx < steps.length - 1 && (
          <span className="mx-2 text-gray-400" aria-hidden>
            ━━━
          </span>
        )}
      </div>
    ))}
  </div>
);

export default CheckoutStepper;
