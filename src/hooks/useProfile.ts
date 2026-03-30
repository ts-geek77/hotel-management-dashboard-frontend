import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import apiClient from "@/services/api-client";
import { User as UserType } from "@/types/auth";
import { INITIAL_PASSWORD_FORM } from "@/constants/profile";

export const useProfile = () => {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await authService.getProfile();
      setProfile(data);
      if (data.profileImage) {
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || "http://localhost:5000";
        setPreviewUrl(`${baseUrl}${data.profileImage}`);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile information");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: { name: string; phone: string }) => {
    if (!data.name.trim()) {
      toast.error("Name cannot be empty");
      return false;
    }
    setIsUpdating(true);
    try {
      await authService.updateProfile(data);
      toast.success("Profile updated successfully");
      await fetchProfile();
      return true;
    } catch (error) {
      toast.error("Failed to update profile");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);
    try {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      await authService.uploadImage(formData);
      toast.success("Image uploaded successfully");
      await fetchProfile();
      return true;
    } catch (error) {
      toast.error("Failed to upload image");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const changePassword = async (form: typeof INITIAL_PASSWORD_FORM) => {
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }
    setIsChangingPassword(true);
    try {
      await authService.changePassword(form);
      toast.success("Password changed successfully");
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to change password";
      toast.error(message);
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  return {
    profile,
    isLoading,
    isUpdating,
    isUploading,
    isChangingPassword,
    previewUrl,
    updateProfile,
    uploadImage,
    changePassword,
    refreshProfile: fetchProfile,
  };
};
