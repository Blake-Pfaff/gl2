// app/register/page.tsx
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FormInput } from "@/app/components/FormInput";

type SignUpForm = {
  email: string;
  password: string;
  name?: string;
  bio?: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    setServerError(null);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) {
      setServerError(body.error || "Registration failed");
    } else {
      // on success, send them to login
      router.push("/login");
    }
  };

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
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

        <FormInput label="Name" type="text" {...register("name")} />
        <FormInput label="Bio" type="text" {...register("bio")} />

        {serverError && <p className="text-red-500 mb-4">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {isSubmitting ? "Signing up…" : "Sign Up"}
        </button>
      </form>
    </main>
  );
}
