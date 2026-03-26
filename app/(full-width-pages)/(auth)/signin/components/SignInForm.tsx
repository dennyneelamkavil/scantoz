"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

import { EyeCloseIcon, EyeIcon } from "@/icons";

import Button from "@/components/ui/button/Button";
import { FormField, Input, Checkbox } from "@/components/form";

import { useFieldErrors, useScrollToTop } from "@/hooks";

type Fields = "username" | "password";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();
  useScrollToTop(error || fieldErrors);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    clearAllFieldErrors();

    let hasError = false;

    if (!formData.username) {
      setFieldError("username", "Username is required");
      hasError = true;
    }
    if (!formData.password) {
      setFieldError("password", "Password is required");
      hasError = true;
    }
    if (hasError) {
      setLoading(false);
      return;
    }

    const toastId = toast.loading("Signing in...");
    try {
      const res = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (!res || !res.ok) {
        throw new Error(res?.error || "Invalid username or password");
      }

      toast.update(toastId, {
        render: "Signed in successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      window.location.href = "/";
    } catch (err: any) {
      toast.update(toastId, {
        render: err.message || "Sign in failed",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const hasErrors = Object.values(fieldErrors).some(Boolean) || !!error;

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-title-sm sm:text-title-md">
            Sign In | Welcome Back!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your username and password to sign in!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 px-4 py-2 my-2 text-sm text-red-600 dark:bg-red-500/10">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <FormField label="Username" required htmlFor="username">
              <Input
                id="username"
                placeholder="yourusername"
                value={formData.username}
                onChange={(e) => {
                  clearFieldError("username");
                  setError(null);
                  const value = e.target.value
                    .toLowerCase() // force lowercase
                    .replace(/\s+/g, "") // remove spaces
                    .replace(/[^a-z0-9_]/g, ""); // allow only a-z, 0-9 and _
                  setFormData((prev) => ({
                    ...prev,
                    username: value,
                  }));
                }}
                error={!!fieldErrors.username}
                hint={fieldErrors.username}
                autoFocus
              />
            </FormField>

            <FormField label="Password" required htmlFor="password">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    clearFieldError("password");
                    setError(null);
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                  }}
                  error={!!fieldErrors.password}
                  hint={fieldErrors.password}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </FormField>

            {/* Remember me */}
            {/* <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                Keep me logged in
              </span>
            </div> */}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={loading || hasErrors}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
