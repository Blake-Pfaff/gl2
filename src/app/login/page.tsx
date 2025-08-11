// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedButton from "../components/AnimatedButton";
import PageTransition from "../components/PageTransition";
import { animations } from "@/lib/animations";
import { APP_NAME } from "@/lib/constants";

type FormValues = { email: string; password: string; rememberMe: boolean };

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setAuthError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      });

      if (res?.error) {
        setAuthError("Invalid email or password");
        return;
      }

      router.push(res?.url || "/");
    } catch (e) {
      setAuthError("Invalid email or password");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Header section with gradient background */}
        <div className="bg-gradient-to-b from-primary-800 via-primary-600 to-primary-300 pb-20">
          {/* Status bar mockup */}
          <div className="flex justify-between items-center px-page-x pt-4 pb-2 text-white text-body">
            <span>1:30 P.M AM</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-white rounded-full"></div>
                <div className="w-1 h-3 bg-white rounded-full"></div>
                <div className="w-1 h-3 bg-white rounded-full"></div>
                <div className="w-1 h-3 bg-white/50 rounded-full"></div>
              </div>
              <svg className="w-5 h-5 ml-2" fill="white" viewBox="0 0 24 24">
                <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48c.3.52.91.83 1.56.83H18c.65 0 1.26-.31 1.56-.83L20.41 11 19.56 9.52c-.3-.52-.91-.83-1.56-.83H6c-.65 0-1.26.31-1.56.83z" />
              </svg>
              <div className="w-6 h-3 border border-white rounded-sm ml-1">
                <div className="w-4 h-2 bg-white rounded-sm m-0.5"></div>
              </div>
            </div>
          </div>

          {/* App Logo */}
          <motion.div
            className="flex justify-center pt-page-y pb-component"
            {...animations.variants.login.heartContainer}
          >
            <motion.div
              className="relative"
              whileHover={animations.variants.login.heartHover}
            >
              <Image
                src="/glLogo.png"
                alt={APP_NAME}
                width={200}
                height={200}
                priority
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* White form section */}
        <div className="bg-white relative">
          {/* Main form container */}
          <motion.div
            className="px-page-x pt-8 pb-8"
            {...animations.variants.login.form}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-section">
              {authError && (
                <div
                  data-cy="auth-error"
                  className="bg-red-50 border border-red-200 rounded-small p-compact"
                >
                  <p className="text-error text-body">{authError}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-body font-medium text-muted mb-3 pl-1"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-muted"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full pl-12 pr-5 py-4 bg-white border-2 border-primary-300/50 rounded-button focus:border-primary-400 focus:outline-none focus:ring-0 transition-all duration-200 placeholder-gray-400 text-secondary shadow-sm"
                    placeholder=""
                  />
                </div>
                {errors.email && (
                  <p className="text-error text-body mt-2 pl-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-body font-medium text-muted mb-3 pl-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-muted"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full pl-12 pr-5 py-4 bg-white border-2 border-primary-300/50 rounded-button focus:border-primary-400 focus:outline-none focus:ring-0 transition-all duration-200 placeholder-gray-400 text-secondary shadow-sm"
                    placeholder=""
                  />
                </div>
                {errors.password && (
                  <p className="text-error text-body mt-2 pl-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center pt-2">
                <div className="relative">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register("rememberMe")}
                    className="h-4 w-4 text-primary-400 bg-primary-50 border-2 border-primary-300 rounded focus:ring-primary-400 focus:ring-2"
                  />
                </div>
                <label
                  htmlFor="rememberMe"
                  className="ml-3 text-body text-muted font-medium"
                >
                  Remember me ?
                </label>
              </div>

              {/* Login Button */}
              <AnimatedButton
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                className="w-full disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging in…" : "Login"}
              </AnimatedButton>

              {/* Google Sign In Button */}
              <AnimatedButton
                type="button"
                onClick={handleGoogleSignIn}
                variant="secondary"
                className="w-full"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34a853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fbbc05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Try Google
              </AnimatedButton>

              {/* Sign Up Link */}
              <Link href="/register" className="block w-full">
                <AnimatedButton variant="outline" className="w-full">
                  Sign Up
                </AnimatedButton>
              </Link>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
