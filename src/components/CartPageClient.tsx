"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useAppSelector";
import CartItemCard from "@/components/CartItemCard";
import CheckoutStepper from "@/components/CheckoutStepper";
import PriceSummary from "@/components/PriceSummary";

const CartPageClient = () => {
  const router = useRouter();
  const { items } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { totalItems, orderTotal, shipping, toPay } = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const orderTotal = items.reduce(
      (total, item) =>
        total + Number(item.caseSize.offeredPrice || 0) * item.quantity,
      0
    );
    const shipping = orderTotal > 500 ? 0 : 40;
    const toPay = orderTotal + shipping;
    return { totalItems, orderTotal, shipping, toPay };
  }, [items]);

  const handleOnClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    // If authenticated, proceed to address selection (page can handle add/select)
    router.push("/select-address");
  };

  const buttonText = !isAuthenticated
    ? "Login to Continue"
    : Array.isArray(user?.address) && user!.address!.length > 0
    ? "Select Address"
    : "Add/Select Address";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutStepper currentStep={0} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <main className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center p-6 border-b">
                <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.836A1.125 1.125 0 0018.02 6H5.23a1.125 1.125 0 00-1.087.835L3.32 10.5M16.5 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8.25 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                    />
                  </svg>
                  <h2 className="text-lg font-medium text-foreground">
                    Cart details
                  </h2>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  <span>
                    Total items:{" "}
                    <span className="font-bold text-gray-800">
                      {totalItems}
                    </span>
                  </span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span>
                    To pay:{" "}
                    <span className="font-bold text-gray-800">
                      ₹{toPay.toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>
              <div className="divide-y">
                {items.length > 0 ? (
                  items.map((item) => (
                    <CartItemCard
                      key={`${item.productId}-${item.caseSize.size}`}
                      item={item}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <p className="text-xl mb-2 font-semibold">
                      Your cart is empty!
                    </p>
                    <p>
                      Looks like you haven&apos;t added anything to your cart
                      yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
          <aside className="lg:col-span-1">
            {items.length > 0 && (
              <PriceSummary
                orderTotal={orderTotal}
                shipping={shipping}
                toPay={toPay}
                buttonText={buttonText}
                onButtonClick={handleOnClick}
                isLoginModalOpen={isLoginModalOpen}
                setIsLoginModalOpen={setIsLoginModalOpen}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPageClient;
