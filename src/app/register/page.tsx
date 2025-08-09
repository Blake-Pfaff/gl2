"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FormInput } from "../components/FormInput";
import { useApiMutation } from "@/hooks/useApi";

type SignUpForm = {
  email: string;
  password: string;
  name?: string;
  bio?: string;
};

type SignUpResponse = { preview?: string };

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
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

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    setServerError(null);
    setPreviewUrl(null);
    await signup.mutateAsync(data);
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
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <FormInput
          label="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <FormInput label="Name" type="text" {...register("name")} />
        <FormInput label="Bio" type="text" {...register("bio")} />

        {serverError && <p className="text-red-500 mb-4">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting || signup.isPending}
          className="mt-4 w-full py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {isSubmitting || signup.isPending ? "Signing up…" : "Sign Up"}
        </button>
      </form>

      {previewUrl && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="font-medium mb-2">Preview your welcome email:</p>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {previewUrl}
          </a>
        </div>
      )}
    </main>
  );
}
