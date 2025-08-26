"use client";

import { useState } from "react";
import {
  MessageCircle,
  LogIn,
  LogOut,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "@/store/slices/AuthSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const { openLoginModal } = useAuth();

  const handleLoginClick = () => {
    openLoginModal();
    setOpen(false);
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    setOpen(false);
    router.push("/");
  };

  const handleProtectedNav = (path: string) => {
    if (isAuthenticated) {
      router.push(path);
      setOpen(false);
    } else {
      openLoginModal();
      setOpen(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="relative gap-1 border-1"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <User className="h-10 w-10 md:h-8 md:w-8 lg:h-10 lg:w-10 text-amber-500 cursor-pointer" />
          <span className="text-sm font-normal text-muted-foreground">
            {isAuthenticated
              ? user?.firstName + " " + user?.lastName || "Profile"
              : "Login"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 mt-[7px]"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {isAuthenticated && user && (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.firstName + " " + user.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.phone}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {isAuthenticated && user && (
          <DropdownMenuItem asChild className="cursor-pointer">
            {user.role === "Admin" ? (
              <Link href="/adminDashboard" className="flex items-center gap-3">
                <User className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-normal text-muted-foreground">
                  Admin Dashboard
                </span>
              </Link>
            ) : user.role === "Employee" ? (
              <Link
                href="/employeeDashboard"
                className="flex items-center gap-3"
              >
                <User className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-normal text-muted-foreground">
                  Employee Dashboard
                </span>
              </Link>
            ) : null}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-5"
          onClick={() => handleProtectedNav("/profile")}
        >
          <User className="h-10 w-10 md:h-8 md:w-8 lg:h-10 lg:w-10 text-amber-500 cursor-pointer" />
          <span className="text-sm font-normal text-muted-foreground">
            Your Profile
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-5"
          onClick={() => handleProtectedNav("/orders")}
        >
          <Package className="h-10 w-10 md:h-8 md:w-8 lg:h-10 lg:w-10 text-amber-500 cursor-pointer" />
          <span className="text-sm font-normal text-muted-foreground">
            Your Orders
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-5"
          onClick={() => handleProtectedNav("/manage-address")}
        >
          <MapPin className="h-10 w-10 md:h-8 md:w-8 lg:h-10 lg:w-10 text-amber-500 cursor-pointer" />
          <span className="text-sm font-normal text-muted-foreground">
            Manage Address
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer gap-5">
          <Link href="/contact-us" className="flex items-center">
            <MessageCircle className="h-10 w-10 md:h-8 md:w-8 lg:h-10 lg:w-10 text-amber-500 cursor-pointer" />
            <span className="text-sm font-normal text-muted-foreground">
              Contact Us
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        {isAuthenticated ? (
          <DropdownMenuItem
            onClick={handleLogoutClick}
            className="cursor-pointer gap-5 focus:bg-red-50 focus:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </DropdownMenuItem>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLoginClick}
          >
            <LogIn className="mr-2 h-5 w-5" />
            <span>Login</span>
          </Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
