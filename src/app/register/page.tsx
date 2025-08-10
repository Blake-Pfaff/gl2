"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useApiMutation } from "@/hooks/useApi";
import { FormField } from "../components/FormField";
import { GenderSelection } from "../components/GenderSelection";
import { MobileHeader } from "../components/MobileHeader";
import { UserIcon, LockIcon, EmailIcon } from "../components/Icons";
import PageTransition from "../components/PageTransition";
import { MIN_PASSWORD_LENGTH } from "@/lib/constants";

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  gender: "male" | "female" | "none";
};

type SignUpResponse = { preview?: string };

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>();

  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const signup = useApiMutation<SignUpResponse, SignUpForm>(
    "/api/auth/signup",
    "POST",
    {
      onSuccess: async (data, variables) => {
        if (data?.preview) setPreviewUrl(data.preview);
        
        // Auto-login the user after successful registration
        try {
          const result = await signIn("credentials", {
            redirect: false,
            email: variables.email,
            password: variables.password,
          });
          
          if (result?.error) {
            console.error("Auto-login failed:", result.error);
            // If auto-login fails, still redirect but they'll need to login manually
            setTimeout(() => router.push("/login"), 1000);
          } else {
            // Success! Proceed to my-number page
            setTimeout(() => router.push("/my-number"), 1000);
          }
        } catch (error) {
          console.error("Auto-login error:", error);
          // Fallback to login page if something goes wrong
          setTimeout(() => router.push("/login"), 1000);
        }
      },
      onError: (e: any) => setServerError(e?.message ?? "Registration failed"),
    }
  );

  const password = watch("password");

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    setServerError(null);
    setPreviewUrl(null);
    await signup.mutateAsync(data);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <MobileHeader title="Sign Up" backUrl="/login" />

        {/* Form Container */}
        <div className="px-page-x py-page-y">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-section">
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-small p-compact">
                <p className="text-error text-body">{serverError}</p>
              </div>
            )}

            <FormField
              label="Username"
              type="text"
              icon={<UserIcon />}
              error={errors.username?.message}
              {...register("username", { required: "Username is required" })}
            />

            <FormField
              label="Password"
              type="password"
              icon={<LockIcon />}
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: MIN_PASSWORD_LENGTH,
                  message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
                },
              })}
            />

            <FormField
              label="Confirm"
              type="password"
              icon={<LockIcon />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />

            <FormField
              label="E-mail"
              type="email"
              icon={<EmailIcon />}
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            <GenderSelection register={register} error={errors.gender} />

            {/* Next Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting || signup.isPending}
                className="w-full bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-semibold py-component px-6 rounded-button transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting || signup.isPending
                  ? "Creating account…"
                  : "Next"}
              </button>
            </div>
          </form>

          {previewUrl && (
            <div className="mt-6 p-component bg-white border border-primary-200 rounded-card">
              <p className="font-medium mb-2 text-secondary">
                Preview your welcome email:
              </p>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link underline"
              >
                {previewUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
