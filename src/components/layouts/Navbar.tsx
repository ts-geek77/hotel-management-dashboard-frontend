"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import authService from "@/services/auth.service";
import apiClient from "@/services/api-client";
import { User } from "@/types/auth";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      setProfile(data);
      if (data.profileImage) {
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || "http://localhost:5000";
        setAvatarUrl(`${baseUrl}${data.profileImage}`);
      }
    } catch (error) {
      console.error("Navbar: Failed to fetch profile:", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      Cookies.remove("token");
      toast.success("Logout successfully.");
      router.push("/auth/login");
    } catch {
      toast.error("Failed to Logout");
    }
  };

  const getTitle = () => {
    if (pathname.includes("rooms")) return "Room Management";
    if (pathname.includes("bookings")) return "Booking Management";
    if (pathname.includes("guests")) return "Guest Management";
    if (pathname.includes("profile")) return "Profile";
    return "Dashboard";
  };

  return (
    <nav className="w-full border-b border-gray-200 px-6 py-3 bg-white">
      <div className="flex justify-between items-center w-full">
        <p className="font-semibold text-xl text-zinc-900">{getTitle()}</p>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors outline-none cursor-pointer">
            <Avatar className="h-8 w-8">
              {avatarUrl && <AvatarImage src={avatarUrl} className="object-cover" />}
              <AvatarFallback className="bg-emerald-100 text-[#2ec27e] text-xs font-semibold">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-zinc-700">{profile?.email || "loading..."}</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem 
              className="gap-2 cursor-pointer"
              onClick={() => router.push("/dashboards/profile")}
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogOut}
              className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
