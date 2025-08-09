// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-b from-pink-400 via-pink-300 to-pink-200">
      {/* Status bar mockup */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2 text-white text-sm">
        <span>4:20 AM</span>
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

      {/* Heart Logo */}
      <div className="flex justify-center pt-12 pb-6">
        <div className="relative">
          <svg
            className="w-16 h-16 text-pink-800"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-400 opacity-30 rounded-full blur-sm"></div>
        </div>
      </div>

      {/* Login Title */}
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-12">
        Login
      </h1>

      {/* Gradient transition area */}
      <div className="relative">
        {/* Additional gradient overlay for smoother transition */}
        <div className="h-16 bg-gradient-to-b from-transparent via-pink-100/30 to-white/80"></div>

        {/* Enhanced curved top border with multiple layers */}
        <svg
          className="w-full h-20 text-white -mt-16"
          preserveAspectRatio="none"
          viewBox="0 0 1440 80"
          fill="currentColor"
        >
          <path d="M0,32 C240,72 480,8 720,32 C960,56 1200,8 1440,32 L1440,80 L0,80 Z" />
        </svg>

        {/* Main form container */}
        <div className="bg-white px-6 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {authError && (
              <div
                data-cy="auth-error"
                className="bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <p className="text-red-600 text-sm">{authError}</p>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-3 pl-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full pl-12 pr-5 py-4 bg-white border-2 border-pink-300/50 rounded-full focus:border-pink-400 focus:outline-none focus:ring-0 transition-all duration-200 placeholder-gray-400 text-gray-700 shadow-sm"
                  placeholder=""
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 pl-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-3 pl-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-500"
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
                  className="w-full pl-12 pr-5 py-4 bg-white border-2 border-pink-300/50 rounded-full focus:border-pink-400 focus:outline-none focus:ring-0 transition-all duration-200 placeholder-gray-400 text-gray-700 shadow-sm"
                  placeholder=""
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 pl-1">
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
                  className="h-4 w-4 text-pink-400 bg-pink-50 border-2 border-pink-300 rounded focus:ring-pink-400 focus:ring-2"
                />
              </div>
              <label
                htmlFor="rememberMe"
                className="ml-3 text-sm text-gray-600 font-medium"
              >
                Remember me ?
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? "Logging in…" : "Login"}
            </button>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
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
            </button>

            {/* Sign Up Link */}
            <Link
              href="/register"
              className="w-full border-2 border-pink-400 text-pink-400 hover:bg-pink-50 font-semibold py-4 px-6 rounded-full transition-all duration-200 text-center block"
            >
              Sign Up
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
