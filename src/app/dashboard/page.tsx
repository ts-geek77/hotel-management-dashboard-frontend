"use client"

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold">Welcome to the Hotel Management Dashboard!</h1>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
