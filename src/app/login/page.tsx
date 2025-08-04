// src/app/login/page.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { FormInput } from "../components/FormInput";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const { errors, isSubmitting } = formState;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // TODO: call your /api/auth endpoint
    console.log("login:", data);
  };

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Log In</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email"
          type="email"
          {...register("email", { required: "Required" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <FormInput
          label="Password"
          type="password"
          {...register("password", { required: "Required" })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
        >
          {isSubmitting ? "Logging in…" : "Log In"}
        </button>
      </form>
    </main>
  );
}
