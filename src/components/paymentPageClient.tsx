/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useAppSelector";
import CheckoutStepper from "@/components/CheckoutStepper";
import CartItemCard from "@/components/CartItemCard";
import PriceSummary from "@/components/PriceSummary";
import { createOrder } from "@/lib/api/order";
import { createRazorpayOrder, verifyPayment } from "@/lib/api/payment";
import { getProfile } from "@/lib/api/user";
import type { Address, User } from "@/types/auth";

declare global {
  interface Window {
    Razorpay: new (options: any) => { open(): void };
  }
}

interface OrderItemInput {
  _product: string;
  quantity: number;
  price: number;
  caseSize: { size: number; price: number; offeredPrice: number };
  totalUnits: number;
}

interface OrderFormData {
  items: OrderItemInput[];
  totalAmount: number;
  totalUnits: number;
  totalCases: number;
  paymentMethod: "cod" | "onlineTransfer";
  shippingAddress: {
    addressId?: string;
    snapshot?: Omit<Address, "_id">;
  };
}

const PaymentPageClient = () => {
  const router = useRouter();
  const params = useSearchParams();
  const addressId = params.get("addressId") || undefined;

  const { items } = useAppSelector((s) => s.cart);
  const { user: authUser } = useAppSelector((s) => s.auth);

  const [selectedMethod, setSelectedMethod] = useState<"cod" | "online">("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    undefined
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile();
        if (res?.user) setProfile(res.user);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!profile) return;
    const addr =
      profile.address?.find((a) => a._id === addressId) ||
      profile.address?.find((a) => a.isDefault) ||
      profile.address?.[0];
    setSelectedAddress(addr);
  }, [profile, addressId]);

  const { orderTotal, shipping, toPay } = useMemo(() => {
    const orderTotal = items.reduce(
      (total, item) =>
        total + Number(item.caseSize.offeredPrice || 0) * item.quantity,
      0
    );
    const shipping = orderTotal > 500 ? 0 : 40;
    const toPay = orderTotal + shipping;
    return { orderTotal, shipping, toPay };
  }, [items]);

  const convertToOrderItems = (): OrderItemInput[] =>
    items.map((item) => ({
      _product: item.productId,
      quantity: item.quantity,
      price: Number(item.caseSize.offeredPrice || 0),
      caseSize: {
        size: item.caseSize.size,
        price: Number(item.caseSize.price || 0),
        offeredPrice: Number(item.caseSize.offeredPrice || 0),
      },
      totalUnits: item.quantity * item.caseSize.size,
    }));

  const createOrderData = (
    paymentMethod: "cod" | "onlineTransfer"
  ): OrderFormData => ({
    items: convertToOrderItems(),
    totalAmount: toPay,
    totalUnits: items.reduce((sum, i) => sum + i.quantity * i.caseSize.size, 0),
    totalCases: items.reduce((sum, i) => sum + i.quantity, 0),
    paymentMethod,
    shippingAddress: {
      addressId: selectedAddress?._id,
      snapshot: selectedAddress
        ? {
            fullName: selectedAddress.fullName,
            phone: selectedAddress.phone,
            addressType: selectedAddress.addressType,
            street: selectedAddress.street,
            city: selectedAddress.city,
            state: selectedAddress.state,
            country: selectedAddress.country,
            postalCode: selectedAddress.postalCode,
            isDefault: selectedAddress.isDefault || false,
          }
        : undefined,
    },
  });

  const handleCODOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const orderData = createOrderData("cod");
      const res = await createOrder(orderData);
      if (res?.error) throw new Error(res.message || "Failed to place order");
      router.push("/orders");
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const orderData = createOrderData("onlineTransfer");
      const orderRes = await createOrder(orderData);
      if (orderRes?.error)
        throw new Error(orderRes.message || "Failed to create order");

      const rzpRes = await createRazorpayOrder(orderRes.order._id);
      if (rzpRes?.error)
        throw new Error(rzpRes.message || "Failed to create Razorpay order");

      const razorpayOrderId = rzpRes?.data?.orderId;
      if (!razorpayOrderId)
        throw new Error("Razorpay order ID not received from server");

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "";
      const options = {
        key,
        amount: Math.round(toPay * 100),
        currency: "INR",
        name: "Nxt Door Retail",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            if (
              !response.razorpay_order_id ||
              !response.razorpay_payment_id ||
              !response.razorpay_signature
            ) {
              setError("Payment verification failed: Missing payment details");
              return;
            }
            const verifyRes = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            if (verifyRes?.error) {
              setError(verifyRes.message || "Payment verification failed");
              return;
            }
            router.push("/orders");
          } catch (e) {
            console.error(e);
            setError("Payment verification failed");
          }
        },
        prefill: {
          name: `${authUser?.firstName || ""} ${
            authUser?.lastName || ""
          }`.trim(),
          email: authUser?.email,
          contact: authUser?.phone,
        },
        theme: { color: "#0891b2" },
        modal: {
          ondismiss: () => setError("Payment was cancelled"),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedAddress?._id) {
      setError("Please select or provide a delivery address.");
      return;
    }
    if (selectedMethod === "cod") {
      await handleCODOrder();
    } else {
      await handleOnlinePayment();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutStepper currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <main className="lg:col-span-2">
            <div className="rounded-lg shadow-sm">
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
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V9.75a2.25 2.25 0 00-2.25-2.25h-15a2.25 2.25 0 00-2.25 2.25v6.75A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  <h2 className="text-lg font-medium text-foreground">
                    Choose payment method
                  </h2>
                </div>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handlePlaceOrder}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedMethod === "online"
                          ? "border-cyan-500 bg-cyan-50 text-cyan-700 shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedMethod("online")}
                      disabled={isLoading}
                    >
                      <span className="text-2xl">💳</span>
                      <div className="text-left">
                        <div className="font-semibold">Online Payment</div>
                        <div className="text-xs text-gray-500">
                          Credit/Debit Card, UPI, Net Banking
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedMethod === "cod"
                          ? "border-cyan-500 bg-cyan-50 text-cyan-700 shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedMethod("cod")}
                      disabled={isLoading}
                    >
                      <span className="text-2xl">💵</span>
                      <div className="text-left">
                        <div className="font-semibold">Cash on Delivery</div>
                        <div className="text-xs text-gray-500">
                          Pay when you receive
                        </div>
                      </div>
                    </button>
                  </div>

                  {selectedAddress && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Delivery Address
                      </h3>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">
                          {selectedAddress.fullName}
                        </div>
                        <div>
                          {selectedAddress.street}, {selectedAddress.city}
                        </div>
                        <div>
                          {selectedAddress.state}, {selectedAddress.country} -{" "}
                          {selectedAddress.postalCode}
                        </div>
                        <div className="mt-1">
                          Phone: {selectedAddress.phone}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-cyan-500 text-white py-4 rounded-lg font-semibold hover:bg-cyan-600 transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        {selectedMethod === "cod"
                          ? "Placing Order..."
                          : "Processing..."}
                      </div>
                    ) : selectedMethod === "cod" ? (
                      "Place Order (COD)"
                    ) : (
                      "Pay with Razorpay"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </main>

          <aside className="lg:col-span-1 space-y-6">
            <div className="rounded-lg shadow-sm">
              <h2 className="text-lg font-medium p-6 border-b text-foreground">
                Cart details
              </h2>
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
                  </div>
                )}
              </div>
            </div>

            <PriceSummary
              orderTotal={orderTotal}
              shipping={shipping}
              toPay={toPay}
              buttonText={
                isLoading
                  ? selectedMethod === "cod"
                    ? "Placing Order..."
                    : "Processing..."
                  : selectedMethod === "cod"
                  ? "Place Order (COD)"
                  : "Pay with Razorpay"
              }
              onButtonClick={() => handlePlaceOrder()}
              isLoginModalOpen={false}
              setIsLoginModalOpen={() => {}}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PaymentPageClient;
