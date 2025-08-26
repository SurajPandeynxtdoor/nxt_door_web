// src/components/ManageAddressClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import AddAddressModal from "@/components/AddAddressModal";
import type { User, Address } from "@/types/auth";
import { getProfile, deleteAddress as deleteAddressApi } from "@/lib/api/user";
import { useAppSelector } from "@/hooks/useAppSelector";

const ManageAddressClient = () => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getProfile();
      setUser(res?.user || null);
    } catch {
      setError("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUser();
    else setIsLoading(false);
  }, [isAuthenticated]);

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsAddAddressModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddAddressModalOpen(true);
  };

  const handleRemoveAddress = async (addressId: string) => {
    if (!user?.address?.length) return;
    if (!confirm("Are you sure you want to remove this address?")) return;
    try {
      await deleteAddressApi(addressId, user.address);
      await fetchUser();
      alert("Address removed successfully!");
    } catch {
      alert("Failed to remove address. Please try again.");
    }
  };

  const handleAddressAdded = () => {
    fetchUser();
    setEditingAddress(null);
  };

  const filteredAddresses = useMemo(() => {
    const list = user?.address || [];
    const q = searchQuery.toLowerCase();
    if (!q) return list;
    return list.filter((addr) => {
      return (
        (addr.fullName || "").toLowerCase().includes(q) ||
        (addr.street || "").toLowerCase().includes(q) ||
        (addr.city || "").toLowerCase().includes(q) ||
        (addr.state || "").toLowerCase().includes(q) ||
        (addr.country || "").toLowerCase().includes(q) ||
        (addr.addressType || "").toLowerCase().includes(q) ||
        (addr.postalCode || "").toLowerCase().includes(q) ||
        (addr.phone || "").toLowerCase().includes(q)
      );
    });
  }, [user?.address, searchQuery]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-8 max-w-2xl mx-auto">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-8 max-w-2xl mx-auto text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold">Manage Addresses</h2>
          <Button variant="outline" onClick={handleAddNewAddress}>
            + Add new address
          </Button>
        </div>

        <div className="relative max-w-sm w-full mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-600"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {filteredAddresses.length > 0 ? (
            filteredAddresses.map((addr) => (
              <div
                key={addr._id}
                className="flex items-start justify-between border rounded-lg p-4 bg-white"
              >
                <div className="flex items-start gap-3">
                  <div>
                    <div className="flex items-center gap-2">
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
                      {addr.street}, {addr.city}, {addr.state}, {addr.country} -{" "}
                      {addr.postalCode}
                    </div>
                    <div className="text-gray-600 text-xs mt-1">
                      Mob: {addr.phone}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-cyan-600 border-cyan-500 hover:bg-cyan-50"
                    onClick={() => handleEditAddress(addr)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAddress(addr._id || "")}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? (
                <div>
                  <p className="mb-2">
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
                <p>No addresses found.</p>
              )}
            </div>
          )}
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

export default ManageAddressClient;
