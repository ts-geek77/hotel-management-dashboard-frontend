"use client";

import { useState } from "react";
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
import { User, Mail, Loader2, Camera, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useProfile } from "@/hooks";
import {
  PROFILE_TABS,
  ProfileTab,
  INITIAL_PASSWORD_FORM,
  INITIAL_SHOW_PASSWORDS,
} from "@/constants";

export default function ProfilePage() {
  const {
    profile,
    isLoading,
    isUpdating,
    isUploading,
    isChangingPassword,
    previewUrl,
    updateProfile,
    uploadImage,
    changePassword,
  } = useProfile();
  
  const [activeTab, setActiveTab] = useState<ProfileTab>(PROFILE_TABS.GENERAL);

  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");

  const [passwordForm, setPasswordForm] = useState(INITIAL_PASSWORD_FORM);
  const [showPasswords, setShowPasswords] = useState(INITIAL_SHOW_PASSWORDS);

  // Sync state when profile is loaded
  useState(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone || "");
    }
  });

  const handleUpdateProfile = async () => {
    await updateProfile({ name, phone });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await changePassword(passwordForm);
    if (success) {
      setPasswordForm(INITIAL_PASSWORD_FORM);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--brand)" }} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 py-4 px-4 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Account Management</h1>
        <p className="text-sm" style={{ color: "var(--text-label)" }}>Update your information and manage account security.</p>
      </div>

      <div className="flex items-center gap-4 border-b" style={{ borderColor: "var(--border)" }}>
        <button 
          onClick={() => setActiveTab(PROFILE_TABS.GENERAL)}
          className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === PROFILE_TABS.GENERAL 
              ? "border-[var(--brand)] text-[var(--brand)]" 
              : "border-transparent hover:text-[var(--text-primary)]"
          }`}
          style={activeTab !== PROFILE_TABS.GENERAL ? { color: "var(--text-label)" } : {}}
        >
          General Information
        </button>
        <button 
          onClick={() => setActiveTab(PROFILE_TABS.SECURITY)}
          className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === PROFILE_TABS.SECURITY 
              ? "border-[var(--brand)] text-[var(--brand)]" 
              : "border-transparent hover:text-[var(--text-primary)]"
          }`}
          style={activeTab !== PROFILE_TABS.SECURITY ? { color: "var(--text-label)" } : {}}
        >
          Security &amp; Password
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="shadow-sm overflow-hidden" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 shadow-xl" style={{ borderColor: "var(--surface)", boxShadow: "0 0 0 1px var(--border)" }}>
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="text-3xl font-bold" style={{ backgroundColor: "var(--brand-light)", color: "var(--brand)" }}>
                    {profile?.name?.charAt(0) || <User size={48} />}
                  </AvatarFallback>
                </Avatar>
                
                <Label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-2 text-white rounded-full shadow-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
                  style={{ backgroundColor: "var(--brand)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--brand-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--brand)")}
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
              
              <h3 className="mt-4 font-semibold text-lg" style={{ color: "var(--text-primary)" }}>{profile?.name}</h3>
              <p className="text-sm font-medium px-3 py-1 rounded-full mt-1" style={{ color: "var(--text-label)", backgroundColor: "var(--surface-muted)" }}>
                {profile?.role || "ADMIN"}
              </p>
              
              <div className="mt-6 w-full pt-4 border-t space-y-2 text-left" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-label)" }}>
                  <Mail size={12} />
                  <span className="truncate">{profile?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-label)" }}>
                    <Phone size={12} />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {activeTab === PROFILE_TABS.GENERAL ? (
            <Card className="shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
              <CardHeader className="border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>Update your name and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="font-medium" style={{ color: "var(--text-secondary)" }}>Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--text-muted)" }} />
                      <Input 
                        id="name" 
                        placeholder="Enter your name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 focus-visible:ring-[var(--brand)]"
                        style={{ borderColor: "var(--border)" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="font-medium" style={{ color: "var(--text-secondary)" }}>Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--text-muted)" }} />
                      <Input 
                        id="phone" 
                        placeholder="Enter phone number"
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9 focus-visible:ring-[var(--brand)]"
                        style={{ borderColor: "var(--border)" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-medium" style={{ color: "var(--text-secondary)" }}>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--text-muted)" }} />
                    <Input 
                      id="email" 
                      value={profile?.email || ""} 
                      className="pl-9 cursor-not-allowed"
                      style={{ backgroundColor: "var(--surface-muted)", color: "var(--text-label)", borderColor: "var(--border)" }}
                      disabled 
                    />
                  </div>
                  <p className="text-[10px] italic mt-1" style={{ color: "var(--text-muted)" }}>Email address cannot be changed from the profile dashboard.</p>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setName(profile?.name || "");
                      setPhone(profile?.phone || "");
                    }}
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  >
                    Reset
                  </Button>
                  <Button 
                    disabled={isUpdating}
                    onClick={handleUpdateProfile}
                    className="text-white min-w-[120px] shadow-sm"
                    style={{ backgroundColor: "var(--brand)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--brand-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--brand)")}
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
            <Card className="shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
              <CardHeader className="border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Keep your account secure by using a strong password.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--text-muted)" }} />
                      <Input 
                        id="oldPassword"
                        type={showPasswords.old ? "text" : "password"}
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                        className="pl-9 pr-10"
                        style={{ borderColor: "var(--border)" }}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})}
                        className="absolute right-3 top-2.5 hover:text-[var(--text-secondary)]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--text-muted)" }} />
                        <Input 
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="pl-9 pr-10"
                          style={{ borderColor: "var(--border)" }}
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                          className="absolute right-3 top-2.5 hover:text-[var(--text-secondary)]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--text-muted)" }} />
                        <Input 
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="pl-9 pr-10"
                          style={{ borderColor: "var(--border)" }}
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                          className="absolute right-3 top-2.5 hover:text-[var(--text-secondary)]"
                          style={{ color: "var(--text-muted)" }}
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
                      className="text-white min-w-[150px]"
                      style={{ backgroundColor: "var(--brand)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--brand-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--brand)")}
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
