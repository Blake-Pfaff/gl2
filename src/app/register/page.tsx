"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useApiMutation } from "@/hooks/useApi";
import { FormField } from "../components/FormField";
import { GenderSelection } from "../components/GenderSelection";
import { MobileHeader } from "../components/MobileHeader";
import { UserIcon, LockIcon, EmailIcon } from "../components/Icons";

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
      onSuccess: (data) => {
        if (data?.preview) setPreviewUrl(data.preview);
        setTimeout(() => router.push("/login"), 1000);
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
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="Sign Up" backUrl="/login" />

      {/* Form Container */}
      <div className="px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{serverError}</p>
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
                value: 6,
                message: "Password must be at least 6 characters",
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
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting || signup.isPending ? "Creating account…" : "Next"}
            </button>
          </div>
        </form>

        {previewUrl && (
          <div className="mt-6 p-4 bg-white border border-pink-200 rounded-2xl">
            <p className="font-medium mb-2 text-gray-700">
              Preview your welcome email:
            </p>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 underline"
            >
              {previewUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
