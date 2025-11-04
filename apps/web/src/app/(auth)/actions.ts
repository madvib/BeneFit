"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginAction as loginController, signupAction as signupController, resetPasswordAction as resetPasswordController, signOutAction as signOutController } from '@/controllers/auth';

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/feed";

  const result = await loginController({
    email,
    password,
    next,
  });

  if (!result.success) {
    throw new Error(result.error || 'Login failed');
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await signupController({
    email,
    password,
  });

  if (!result.success) {
    throw new Error(result.error || 'Signup failed');
  }

  revalidatePath("/", "layout");

  // Redirect to feed after successful signup
  redirect("/feed");
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  const result = await resetPasswordController({
    email,
  });

  if (!result.success) {
    throw new Error(result.error || 'Password reset failed');
  }
}

export async function signOutAction() {
  const result = await signOutController();

  if (!result.success) {
    throw new Error(result.error || 'Sign out failed');
  }

  revalidatePath("/", "layout");
  redirect("/");
}
