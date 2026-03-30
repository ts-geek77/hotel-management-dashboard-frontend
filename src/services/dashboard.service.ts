import api from "./api-client";
import { DashboardData } from "@/types";

export const getDashboardData = async (): Promise<DashboardData> => {
  const res = await api.get("/dashboard");
  return res.data;
};
