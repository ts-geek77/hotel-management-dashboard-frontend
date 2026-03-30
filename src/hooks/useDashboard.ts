import { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "@/services/dashboard.service";
import { DashboardData } from "@/types";

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDashboardData();
      setData(result);
    } catch (err) {
      console.error("Dashboard data fetch failed:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    stats: data?.stats ?? null,
    revenueTrends: data?.revenueTrends ?? [],
    recentBookings: data?.recentBookings ?? [],
    roomStatus: data?.roomStatus ?? [],
    loading,
    error,
    refresh: fetchAll,
  };
};
