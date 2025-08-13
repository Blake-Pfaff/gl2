"use client";

import { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useApi";
import { FormField } from "../components/FormField";
import { GenderSelection } from "../components/GenderSelection";
import { MobileHeader } from "../components/MobileHeader";
import { UserIcon, LockIcon, EmailIcon } from "../components/Icons";
import PageTransition from "../components/PageTransition";
import { MIN_PASSWORD_LENGTH } from "@/lib/constants";

type SignUpForm = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
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
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const signup = useApiMutation<
    SignUpResponse,
    SignUpForm & { name: string; username: string }
  >("/api/auth/signup", "POST", {
    onSuccess: async (data, variables) => {
      // Show success toast with preview URL if available
      if (data?.preview) {
        const toastId = toast.success(
          <div className="flex items-start justify-between gap-3 w-full">
            <div className="flex flex-col gap-2 flex-1">
              <span className="font-medium">
                Account created successfully! 🎉
              </span>
              <a
                href={data.preview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline opacity-80 hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                Preview your welcome email
              </a>
            </div>
            <button
              onClick={() => toast.dismiss(toastId)}
              className="text-green-700 hover:text-green-800 p-1 rounded hover:bg-green-200/50 transition-colors"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>,
          {
            duration: 10000, // 10 seconds
            style: {
              background: "#dcfce7", // green-100
              border: "1px solid #16a34a", // green-600
              color: "#15803d", // green-700
            },
            onDismiss: () => handleNavigation(variables),
            onAutoClose: () => handleNavigation(variables),
          }
        );
      } else {
        // No preview URL, just show success and navigate
        toast.success("Account created successfully! 🎉", {
          style: {
            background: "#dcfce7",
            border: "1px solid #16a34a",
            color: "#15803d",
          },
        });
        await handleNavigation(variables);
      }
    },
    onError: (e: any) => setServerError(e?.message ?? "Registration failed"),
  });

  const handleNavigation = async (
    variables: SignUpForm & { name: string; username: string }
  ) => {
    if (isNavigating) return; // Prevent multiple navigation attempts
    setIsNavigating(true);

    // Auto-login the user after successful registration
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: variables.email,
        password: variables.password,
      });

      if (result?.error) {
        console.error("Auto-login failed:", result.error);
        router.push("/login");
      } else {
        router.push("/my-number");
      }
    } catch (error) {
      console.error("Auto-login error:", error);
      router.push("/login");
    }
  };

  const password = watch("password");

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    setServerError(null);
    setIsNavigating(false);

    // Use username as the display name
    const signupData = {
      ...data,
      name: data.username, // Use username as display name
    };

    await signup.mutateAsync(signupData);
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

            <FormField
              label="Username"
              type="text"
              icon={<UserIcon />}
              error={errors.username?.message}
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "Username can only contain letters, numbers, and underscores",
                },
              })}
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

            <GenderSelection register={register} error={errors.gender} />

            {/* Next Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting || signup.isPending || isNavigating}
                className="w-full bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-semibold py-component px-6 rounded-button transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isNavigating
                  ? "Redirecting..."
                  : isSubmitting || signup.isPending
                  ? "Creating account…"
                  : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
