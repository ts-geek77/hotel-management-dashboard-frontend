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
    <nav className="w-full px-8 py-4 bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-bold text-2xl tracking-tight text-[var(--text-primary)]">{getTitle()}</h1>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 rounded-full px-1 py-1 pr-4 hover:bg-[var(--surface-muted)] transition-all duration-200 outline-none cursor-pointer">
              <Avatar className="h-9 w-9 border-2 border-[var(--border-subtle)]">
                {avatarUrl && <AvatarImage src={avatarUrl} className="object-cover" />}
                <AvatarFallback className="bg-[var(--brand-light)] text-[var(--brand)] text-xs font-bold">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-[var(--text-secondary)] leading-none mb-1">
                  {profile?.name || "Admin User"}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] font-medium leading-none">
                  {profile?.email || "loading..."}
                </span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 mt-2 p-1 border-[var(--border)] shadow-lg z-50 bg-white dark:bg-zinc-900">
              <div className="px-3 py-2 border-b border-[var(--border-subtle)] mb-1">
                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">My Account</p>
              </div>
              <DropdownMenuItem 
                className="gap-2 py-2.5 px-3 cursor-pointer rounded-md focus:bg-[var(--brand-light)] focus:text-[var(--brand)]"
                onClick={() => router.push("/dashboards/profile")}
              >
                <UserIcon className="h-4 w-4" />
                <span className="font-medium">View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[var(--border-subtle)]" />
              <DropdownMenuItem
                onClick={handleLogOut}
                className="gap-2 py-2.5 px-3 text-[var(--destructive)] focus:text-[var(--destructive-hover)] focus:bg-red-50 cursor-pointer rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
