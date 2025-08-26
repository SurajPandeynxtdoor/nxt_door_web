// src/components/ProfileClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Wallet,
  Gift,
  Users,
  CreditCard,
  Package,
  ClipboardList,
  MessageCircle,
} from "lucide-react";
import type { User } from "@/types/auth";
import { getProfile } from "@/lib/api/user";
import Image from "next/image";

const ProfileClient = () => {
  const router = useRouter();
  // state
  const { user: reduxUser } = useAppSelector((s) => s.auth);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (reduxUser) {
      setUser(reduxUser);
      setLoading(false);
      return;
    }
    setLoading(true);
    getProfile()
      .then((res) => setUser(res?.user || null))
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [mounted, reduxUser]);

  const initials = useMemo(() => {
    const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  }, [user]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "User not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center text-2xl font-bold text-cyan-700 shadow">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Welcome, {user.firstName} {user.lastName}!
              </h2>
              <div className="flex flex-wrap gap-2 text-gray-600 text-sm">
                {user.email && <span>Email: {user.email}</span>}
                <span>Phone: {user.phone}</span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-cyan-600 ml-2"
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-cyan-600 text-sm">
            <Button variant="link" className="p-0 h-auto">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with us
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <ProfileCard
            icon={<ClipboardList className="w-6 h-6" />}
            title="Track Order"
            desc="Track your order"
            onClick={() => router.push("/orders")}
          />
          <ProfileCard
            icon={<Package className="w-6 h-6" />}
            title="Your Orders"
            desc="Track, return, or buy things again"
            onClick={() => router.push("/orders")}
          />
          <ProfileCard
            icon={<MapPin className="w-6 h-6" />}
            title="Addresses"
            desc="Edit addresses for orders and gifts"
            onClick={() => router.push("/manage-address")}
          />
          <ProfileCard
            icon={<Wallet className="w-6 h-6" />}
            title="Wallet"
            desc="Use Money from Wallet"
            tag="Coming Soon"
          />
          <ProfileCard
            icon={<Users className="w-6 h-6" />}
            title="Referrals"
            desc="Refer and Earn Money"
            tag="Coming Soon"
          />
          <ProfileCard
            icon={<CreditCard className="w-6 h-6" />}
            title="Payment Modes"
            desc="Your saved UPIs, Cards & more"
            tag="Coming Soon"
          />
          <ProfileCard
            icon={<Gift className="w-6 h-6" />}
            title="Rewards"
            desc="Your rewards and offers"
            tag="Coming Soon"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-600 text-sm">
                Download the APP to track your orders and get notifications on
                offers and delivery.
              </span>
              <div className="flex gap-2 mt-2">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/QR_code_for_mobile_English_Wikipedia.svg"
                  alt="QR Code"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
                <div className="flex flex-col gap-1">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    width={150}
                    height={32}
                    className="h-8 w-auto"
                  />
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg"
                    alt="App Store"
                    width={150}
                    height={32}
                    className="h-8 w-auto"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-4 text-xs text-gray-600">
                <div className="flex flex-col items-center">
                  <span>Get Exciting Offers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span>Easy To Track Your Orders</span>
                </div>
                <div className="flex flex-col items-center">
                  <span>Stay Notified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ProfileCard({
  icon,
  title,
  desc,
  tag,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="bg-white rounded-xl shadow p-5 flex flex-col items-center gap-2 hover:shadow-lg transition cursor-pointer min-h-[120px] relative"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
    >
      <div className="text-cyan-600 mb-1">{icon}</div>
      <div className="font-semibold text-gray-900 text-base flex items-center gap-2">
        {title}
        {tag && (
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
            {tag}
          </span>
        )}
      </div>
      <div className="text-xs text-gray-600 text-center">{desc}</div>
    </div>
  );
}

export default ProfileClient;
