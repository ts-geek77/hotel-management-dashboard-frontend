"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormFieldLabel } from "@/components/ui/form-field";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "@/hooks";
import { Building2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Yup from "yup";
import authService from "@/services/auth.service";
import Cookies from "js-cookie";
import Link from "next/link";
import { LOGIN_SCHEMA, INITIAL_LOGIN_VALUES } from "@/constants/auth";

type LoginInput = Yup.InferType<typeof LOGIN_SCHEMA>;

const LoginPage = () => {
  const router = useRouter();

  const {
    values,
    errors,
    touched,
    formError,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<LoginInput>({
    initialValues: INITIAL_LOGIN_VALUES,
    schema: LOGIN_SCHEMA,
    onSubmit: async (data) => {
      try {
        const res = await authService.login(data);
        Cookies.set("token", res.token, { expires: 1 });
        toast.success("Logged in successfully");
        router.push("/dashboards/dashboard");
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err.message || "Login failed";
        throw new Error(message);
      }
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: "var(--surface-muted)" }}>
      <div className="w-full max-w-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--brand)" }}>
          <Building2 size={32} color="white" />
        </div>
 
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Hotel Admin
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
            Login to manage your hotel operations
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
                <div className="rounded-md px-4 py-3 text-sm" style={{ backgroundColor: "var(--error-bg)", borderColor: "var(--error-border)", border: "1px solid", color: "var(--error)" }}>
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <FormFieldLabel htmlFor="email">Email</FormFieldLabel>
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
                <div className="flex items-center justify-between">
                  <FormFieldLabel htmlFor="password">Password</FormFieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs hover:underline transition-colors"
                    style={{ color: "var(--brand)" }}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  className={
                    touched.password && errors.password
                      ? "border-red-400 focus-visible:ring-red-300"
                      : ""
                  }
                />
                {touched.password && errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
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
                    Logging in…
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-center text-sm" style={{ color: "var(--text-label)" }}>
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium hover:underline"
                  style={{ color: "var(--brand)" }}
                >
                  Register
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default LoginPage;
