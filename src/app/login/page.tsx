"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormInput } from "../components/FormInput";

type FormValues = {
  email: string;
  password: string;
};

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

    // replaces console.log
    const res = await signIn("credentials", {
      redirect: false, // we’ll handle navigation manually
      email: data.email,
      password: data.password,
      callbackUrl: "/", // where to go on success
    });

    if (res?.error) {
      setAuthError("Invalid email or password");
    } else {
      router.push(res?.url || "/");
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
        {errors.email && (
          <p className="text-red-500 mb-2">{errors.email.message}</p>
        )}

        <FormInput
          label="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 mb-2">{errors.password.message}</p>
        )}

        {authError && <p className="text-red-500 mb-4">{authError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isSubmitting ? "Logging in…" : "Log In"}
        </button>
      </form>
    </main>
  );
}
