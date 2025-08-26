"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, User, Phone, Home, Building, Navigation } from "lucide-react";
import type { Address } from "@/types/auth";
import { addAddress, updateAddress } from "@/lib/api/user";

interface AddressFormData {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  addressType: "home" | "work" | "other" | "billing" | "shipping";
  isDefault: boolean;
}

interface AddAddressModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddressAdded?: () => void;
  editAddress?: Address | null;
}

const AddAddressModal = ({
  isOpen,
  onOpenChange,
  onAddressAdded,
  editAddress,
}: AddAddressModalProps) => {
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    addressType: "home",
    isDefault: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editAddress) {
      setFormData({
        fullName: editAddress.fullName || "",
        phone: editAddress.phone || "",
        street: editAddress.street || "",
        city: editAddress.city || "",
        state: editAddress.state || "",
        country: editAddress.country || "India",
        postalCode: editAddress.postalCode || "",
        addressType: editAddress.addressType || "home",
        isDefault: editAddress.isDefault || false,
      });
    } else {
      setFormData({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",
        addressType: "home",
        isDefault: false,
      });
    }
  }, [editAddress]);

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleClose = () => {
    setFormData({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      addressType: "home",
      isDefault: false,
    });
    setError(null);
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
        addressType: formData.addressType,
        isDefault: formData.isDefault,
      };

      if (editAddress?._id) {
        await updateAddress(editAddress._id, payload as Address);
      } else {
        await addAddress(payload as Omit<Address, "_id">);
      }

      handleClose();
      onAddressAdded?.();
    } catch (err) {
      console.error("Error saving address:", err);
      setError("Failed to save address. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <MapPin className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold text-gray-800">
                  {editAddress ? "Edit Address" : "Add New Address"}
                </SheetTitle>
              </SheetHeader>
              <p className="text-sm text-gray-600">
                {editAddress
                  ? "Update your delivery details"
                  : "Enter your delivery details"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          >
            ✕
          </Button>
        </div>

        <div className="h-full overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4 text-gray-500" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Phone className="h-4 w-4 text-gray-500" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                pattern="[0-9]{10}"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="street"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Navigation className="h-4 w-4 text-gray-500" />
                Street Address *
              </Label>
              <Input
                id="street"
                type="text"
                placeholder="Enter street address"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City *
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">
                  State *
                </Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  Country *
                </Label>
                <Select
                  value={formData.country}
                  onValueChange={(v) => handleInputChange("country", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">
                      United Kingdom
                    </SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-sm font-medium">
                  Postal Code *
                </Label>
                <Input
                  id="postalCode"
                  type="text"
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="addressType"
                className="text-sm font-medium flex items-center gap-2"
              >
                {formData.addressType === "home" ? (
                  <Home className="h-4 w-4 text-gray-500" />
                ) : formData.addressType === "work" ? (
                  <Building className="h-4 w-4 text-gray-500" />
                ) : (
                  <MapPin className="h-4 w-4 text-gray-500" />
                )}
                Address Type *
              </Label>
              <Select
                value={formData.addressType}
                onValueChange={(v) =>
                  handleInputChange(
                    "addressType",
                    v as AddressFormData["addressType"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="billing">💳 Billing</SelectItem>
                  <SelectItem value="shipping">📦 Shipping</SelectItem>
                  <SelectItem value="other">📍 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) =>
                  handleInputChange("isDefault", Boolean(checked))
                }
              />
              <Label htmlFor="isDefault" className="text-sm font-medium">
                Set as default address
              </Label>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <Button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? editAddress
                    ? "Updating..."
                    : "Adding Address..."
                  : editAddress
                  ? "Update Address"
                  : "Add Address"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddAddressModal;
