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
import { LogOut, User as UserIcon, Menu, X, Building2, LayoutDashboard, BedDouble, Users, CalendarCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Cookies from "js-cookie";
import authService from "@/services/auth.service";
import apiClient from "@/services/api-client";
import { User } from "@/types/auth";

const navItems = [
  { href: "/dashboards/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboards/rooms", label: "Rooms", icon: BedDouble },
  { href: "/dashboards/guests", label: "Guests", icon: Users },
  { href: "/dashboards/bookings", label: "Bookings", icon: CalendarCheck },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    <nav className="w-full px-4 lg:px-8 py-4 bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-40">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6 text-[var(--text-primary)]" />
          </button>
          <h1 className="font-bold text-lg lg:text-2xl tracking-tight text-[var(--text-primary)] truncate max-w-[150px] lg:max-w-none">
            {getTitle()}
          </h1>
        </div>

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

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="fixed inset-y-0 left-0 w-[280px] bg-[var(--sidebar-bg)] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800/50">
              <div className="flex items-center gap-2 text-white text-xl font-bold">
                <Building2 size={24} className="text-[var(--brand)]" />
                <span>HotelAdmin</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboards/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive ? "bg-[var(--sidebar-active-bg)] text-[var(--brand)] font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <item.icon size={20} className={isActive ? "text-[var(--brand)]" : ""} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="px-6 py-6 border-t border-slate-800/50">
              <p className="text-slate-500 text-xs font-medium">© 2026 Hotel Management</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
