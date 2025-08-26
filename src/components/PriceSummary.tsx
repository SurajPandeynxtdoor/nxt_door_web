"use client";

import LoginModal from "@/components/auth/LoginModal";

interface PriceSummaryProps {
  orderTotal: number;
  shipping: number;
  toPay: number;
  buttonText: string;
  onButtonClick: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
}

const PriceSummary = ({
  orderTotal,
  shipping,
  toPay,
  buttonText,
  onButtonClick,
  isLoginModalOpen,
  setIsLoginModalOpen,
}: PriceSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4 border-b pb-4">
        Price Summary
      </h2>
      <div className="space-y-3 text-gray-700">
        <div className="flex justify-between">
          <span>Order Total</span>
          <span>₹{orderTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          {shipping > 0 ? (
            <div className="flex items-center space-x-2">
              <span className="line-through text-gray-500">₹40.00</span>
              <span className="font-semibold">₹{shipping.toFixed(2)}</span>
            </div>
          ) : (
            <span className="text-green-600 font-semibold">Free</span>
          )}
        </div>
        <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg text-gray-900">
          <span>To Pay</span>
          <span>₹{toPay.toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={onButtonClick}
        className="w-full mt-6 bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
      >
        {buttonText}
      </button>

      <LoginModal
        isOpen={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
      />
    </div>
  );
};

export default PriceSummary;
