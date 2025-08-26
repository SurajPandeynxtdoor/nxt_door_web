"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import CheckoutStepper from "@/components/CheckoutStepper";
import CartItemCard from "@/components/CartItemCard";
import PriceSummary from "@/components/PriceSummary";
import AddAddressModal from "@/components/AddAddressModal";
import type { Address, User } from "@/types/auth";
import {
  getProfile,
  setDefaultAddress,
  deleteAddress as deleteAddressApi,
} from "@/lib/api/user";
import { useRouter } from "next/navigation";

const SelectAddressClient = () => {
  const router = useRouter();
  const { items } = useAppSelector((s) => s.cart);
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<
    string | undefined
  >(undefined);

  const fetchUser = async () => {
    try {
      const res = await getProfile();
      if (res?.user) setUser(res.user);
      // preselect default/first address
      const def =
        res?.user?.address?.find((a: Address) => a.isDefault)?._id ||
        res?.user?.address?.[0]?._id;
      setSelectedAddressId(def);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const filteredAddresses: Address[] = useMemo(() => {
    const list = user?.address || [];
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (addr) =>
        (addr.fullName || "").toLowerCase().includes(q) ||
        (addr.street || "").toLowerCase().includes(q) ||
        (addr.city || "").toLowerCase().includes(q) ||
        (addr.state || "").toLowerCase().includes(q) ||
        (addr.addressType || "").toLowerCase().includes(q) ||
        (addr.postalCode || "").toLowerCase().includes(q) ||
        (addr.phone || "").toLowerCase().includes(q)
    );
  }, [user?.address, searchQuery]);

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

  const handleProceedToPay = () => {
    if (!selectedAddressId) {
      alert("Please select an address");
      return;
    }
    router.push(`/payment?addressId=${encodeURIComponent(selectedAddressId)}`);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsAddAddressModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddAddressModalOpen(true);
  };

  const handleAddressAdded = () => {
    fetchUser();
    setEditingAddress(null);
  };

  const onSetDefault = async (addressId: string) => {
    await setDefaultAddress(addressId);
    fetchUser();
  };

  const onDeleteAddress = async (addressId: string) => {
    if (!user?.address) return;
    await deleteAddressApi(addressId, user.address);
    fetchUser();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutStepper currentStep={1} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <main className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold">
                Select a delivery address
              </h2>
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search addresses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {filteredAddresses.length > 0 ? (
                filteredAddresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`flex items-start justify-between border rounded-lg p-4 ${
                      selectedAddressId === addr._id
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="mt-1 accent-cyan-500"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {addr.fullName}
                          </span>
                          {addr.isDefault && (
                            <span className="text-xs text-cyan-600 font-semibold">
                              (Default)
                            </span>
                          )}
                          <span className="text-xs text-gray-600 font-semibold">
                            |{" "}
                            {addr.addressType?.charAt(0).toUpperCase() +
                              addr.addressType?.slice(1)}
                          </span>
                        </div>
                        <div className="text-gray-700 text-sm">
                          {addr.street}, {addr.city}, {addr.state},{" "}
                          {addr.country} - {addr.postalCode}
                        </div>
                        <div className="text-gray-600 text-xs mt-1">
                          Mob: {addr.phone}
                        </div>

                        <div className="flex gap-3 mt-2">
                          {!addr.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSetDefault(addr._id!)}
                              className="h-8"
                            >
                              Set default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAddress(addr)}
                            className="text-cyan-600 hover:bg-cyan-50 h-8"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteAddress(addr._id!)}
                            className="text-red-600 hover:bg-red-50 h-8"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  {searchQuery ? (
                    <div>
                      <p className="text-gray-500 mb-2">
                        No addresses found for &quot;{searchQuery}&quot;
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="text-cyan-600"
                      >
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500">No addresses found</p>
                  )}
                </div>
              )}

              <Button
                variant="outline"
                className="self-end mt-2"
                onClick={handleAddNewAddress}
              >
                + Add new address
              </Button>
            </div>
          </main>

          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
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
              buttonText="Proceed to pay"
              onButtonClick={handleProceedToPay}
              isLoginModalOpen={false}
              setIsLoginModalOpen={() => {}}
            />
          </aside>
        </div>
      </div>

      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onOpenChange={setIsAddAddressModalOpen}
        onAddressAdded={handleAddressAdded}
        editAddress={editingAddress}
      />
    </div>
  );
};

export default SelectAddressClient;
