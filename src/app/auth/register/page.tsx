"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import useForm from "@/hooks/useForm";
import { Building2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Yup from "yup";
import authService from "@/services/auth.service";
import Link from "next/link";

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name is too short")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

type RegisterInput = Yup.InferType<typeof registerSchema>;

const RegisterPage = () => {
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
  } = useForm<RegisterInput>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    schema: registerSchema,
    onSubmit: async (data) => {
      try {
        await authService.register(data);
        toast.success("Account created successfully. Please login.");
        router.push("/login");
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err.message || "Registration failed";
        throw new Error(message);
      }
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <Link 
          href="/auth/login"
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-600 transition-transform hover:scale-105"
        >
          <Building2 size={32} color="white" />
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Create an Account
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Join Hotel Admin to start managing your operations
          </p>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-8">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              autoComplete="off"
            >
              {formError && (
                <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    touched.name && errors.name
                      ? "border-red-400 focus-visible:ring-red-300"
                      : ""
                  }
                />
                {touched.name && errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
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

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="1234567890"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    touched.phone && errors.phone
                      ? "border-red-400 focus-visible:ring-red-300"
                      : ""
                  }
                />
                {touched.phone && errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
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

              {/* Confirm Password */}
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
                className="mt-1 w-full bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Register"
                )}
              </Button>

              <div className="text-center text-sm text-zinc-500">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default RegisterPage;
