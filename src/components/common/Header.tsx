import CartButton from "@/components/common/CartButton";
import SearchBar from "@/components/common/SearchBar";
import UserProfile from "@/components/common/UserProfile";
import Image from "next/image";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Link from "next/link";

const Header = () => {
  return (
    <div className="w-full border-b bg-background bg-gradient-to-b from-emerald-50 via-cyan-50 to-amber-50  sticky top-0 z-50">
      <AnnouncementBar />
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <div className="relative flex items-center">
            <Link href="/" aria-label="Go to Home">
            <Image
              src="/images/NXTDoor.jpeg"
              alt="Nxt door Retail"
              className="h-8 md:h-10 object-contain"
              width={150}
              height={150}
            />
            </Link>
          </div>
          <div className="flex-1 hidden md:block max-w-xl">
            <SearchBar />
          </div>
          <div className="flex items-center gap-4">
            <CartButton />
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
