// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormInput } from "../components/FormInput";

type FormValues = { email: string; password: string };

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

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Log In</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email"
          type="email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <FormInput
          label="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        {authError && (
          <p data-cy="auth-error" className="text-red-500 mb-4">
            {authError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isSubmitting ? "Logging in…" : "Log In"}
        </button>
        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 underline">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}
