"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, Loader2, Camera, Phone, Lock, Eye, EyeOff } from "lucide-react";
import authService from "@/services/auth.service";
import { toast } from "sonner";
import apiClient from "@/services/api-client";
import { User as UserType } from "@/types/auth";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Tab states
  const [activeTab, setActiveTab] = useState<"general" | "security">("general");

  // Form states - General
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form states - Password
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await authService.getProfile();
      setProfile(data);
      setName(data.name);
      setPhone(data.phone || "");
      if (data.profileImage) {
        // Construct full URL if profileImage is a relative path
        const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || "http://localhost:5000";
        setPreviewUrl(`${baseUrl}${data.profileImage}`);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsUpdating(true);
    try {
      await authService.updateProfile({ name, phone });
      toast.success("Profile updated successfully");
      fetchProfile(); // Refresh data
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      handleUploadImage(file);
    }
  };

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      await authService.uploadImage(formData);
      toast.success("Image uploaded successfully");
      fetchProfile(); // Refresh data to get new image URL
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword(passwordForm);
      toast.success("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to change password";
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 py-4 px-4 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Account Management</h1>
        <p className="text-zinc-500 text-sm">Update your information and manage account security.</p>
      </div>

      <div className="flex items-center gap-4 border-b border-zinc-200">
        <button 
          onClick={() => setActiveTab("general")}
          className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "general" 
              ? "border-teal-600 text-teal-600" 
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          General Information
        </button>
        <button 
          onClick={() => setActiveTab("security")}
          className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "security" 
              ? "border-teal-600 text-teal-600" 
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          Security & Password
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="space-y-6">
          <Card className="border-zinc-200 shadow-sm overflow-hidden bg-white">
            <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-white shadow-xl ring-1 ring-zinc-100">
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="bg-teal-50 text-teal-600 text-3xl font-bold">
                    {profile?.name?.charAt(0) || <User size={48} />}
                  </AvatarFallback>
                </Avatar>
                
                <Label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-2 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-all cursor-pointer hover:scale-110 active:scale-95"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading}
                  />
                </Label>
              </div>
              
              <h3 className="mt-4 font-semibold text-lg text-zinc-900">{profile?.name}</h3>
              <p className="text-sm text-zinc-500 font-medium px-3 py-1 bg-zinc-100 rounded-full mt-1">
                {profile?.role || "ADMIN"}
              </p>
              
              <div className="mt-6 w-full pt-4 border-t border-zinc-50 space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Mail size={12} />
                  <span className="truncate">{profile?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Phone size={12} />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Card */}
        <div className="md:col-span-2">
          {activeTab === "general" ? (
            <Card className="border-zinc-200 shadow-sm bg-white">
              <CardHeader className="border-b border-zinc-50 pb-4">
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>
                  Update your name and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-zinc-700 font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                      <Input 
                        id="name" 
                        placeholder="Enter your name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 focus-visible:ring-teal-500 border-zinc-200" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-zinc-700 font-medium">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                      <Input 
                        id="phone" 
                        placeholder="Enter phone number"
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9 focus-visible:ring-teal-500 border-zinc-200" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-zinc-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input 
                      id="email" 
                      value={profile?.email || ""} 
                      className="pl-9 bg-zinc-50 text-zinc-500 cursor-not-allowed border-zinc-200" 
                      disabled 
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 italic mt-1">Email address cannot be changed from the profile dashboard.</p>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setName(profile?.name || "");
                      setPhone(profile?.phone || "");
                    }}
                    className="border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  >
                    Reset
                  </Button>
                  <Button 
                    disabled={isUpdating}
                    onClick={handleUpdateProfile}
                    className="bg-teal-600 hover:bg-teal-700 text-white min-w-[120px] shadow-sm"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-zinc-200 shadow-sm bg-white">
              <CardHeader className="border-b border-zinc-50 pb-4">
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Keep your account secure by using a strong password.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                      <Input 
                        id="oldPassword"
                        type={showPasswords.old ? "text" : "password"}
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                        className="pl-9 pr-10 border-zinc-200"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})}
                        className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
                      >
                        {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                        <Input 
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="pl-9 pr-10 border-zinc-200"
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                          className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
                        >
                          {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                        <Input 
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="pl-9 pr-10 border-zinc-200"
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                          className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
                        >
                          {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="submit"
                      disabled={isChangingPassword}
                      className="bg-teal-600 hover:bg-teal-700 text-white min-w-[150px]"
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
