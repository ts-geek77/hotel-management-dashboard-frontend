"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "@/hooks";
import { Building2, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Yup from "yup";
import authService from "@/services/auth.service";
import Link from "next/link";
import { FORGOT_PASSWORD_SCHEMA, INITIAL_FORGOT_PASSWORD_VALUES } from "@/constants/auth";

type ForgotPasswordInput = Yup.InferType<typeof FORGOT_PASSWORD_SCHEMA>;

const ForgotPasswordPage = () => {
  const router = useRouter();

  const {
    values,
    errors,
    touched,
    formError,
    formSuccess,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormSuccess,
  } = useForm<ForgotPasswordInput>({
    initialValues: INITIAL_FORGOT_PASSWORD_VALUES,
    schema: FORGOT_PASSWORD_SCHEMA,
    onSubmit: async (data) => {
      try {
        const res = await authService.forgotPassword(data);
        setFormSuccess(res.message || "Password has been reset successfully.");
        toast.success("Password reset successfully!");
        setTimeout(() => router.push("/auth/login"), 2000);
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err.message || "Failed to reset password";
        throw new Error(message);
      }
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: "var(--surface-muted)" }}>
      <div className="w-full max-w-sm">
        <Link 
          href="/auth/login"
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform hover:scale-105"
          style={{ backgroundColor: "var(--brand)" }}
        >
          <Building2 size={32} color="white" />
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Forgot Password?
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
            Enter your details below to reset your password
          </p>
        </div>

        <Card className="shadow-sm" style={{ borderColor: "var(--border)" }}>
          <CardContent className="p-8">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              autoComplete="off"
            >
              {formError && (
                <div className="rounded-md px-4 py-3 text-sm" style={{ backgroundColor: "var(--error-bg)", border: "1px solid var(--error-border)", color: "var(--error)" }}>
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="rounded-md px-4 py-3 text-sm" style={{ backgroundColor: "var(--success-bg)", border: "1px solid var(--success-border)", color: "var(--success)" }}>
                  {formSuccess}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@hotel.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                  className={
                    touched.email && errors.email
                      ? "border-red-400 focus-visible:ring-red-300"
                      : ""
                  }
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="••••••••"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  className={
                    touched.newPassword && errors.newPassword
                      ? "border-red-400 focus-visible:ring-red-300"
                      : ""
                  }
                />
                {touched.newPassword && errors.newPassword && (
                  <p className="text-xs text-red-500">{errors.newPassword}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  className={
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-red-400 focus-visible:ring-red-300"
                      : ""
                  }
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full text-white cursor-pointer"
                style={{ backgroundColor: "var(--brand)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--brand-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--brand)")}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password…
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:scale-105"
                  style={{ color: "var(--text-label)" }}
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
