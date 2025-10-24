"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { login, signup, resetPassword, signOut } from "@/services/auth-service";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/feed";

  await login({
    email,
    password,
    next,
  });

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await signup({
    email,
    password,
  });

  revalidatePath("/", "layout");

  // Redirect to confirmation page if email needs to be confirmed
  if (result.requiresEmailConfirmation) {
    redirect(`/confirm-email?email=${encodeURIComponent(email)}`);
  } else {
    redirect("/feed");
  }
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  await resetPassword({
    email,
  });
}

export async function signOutAction() {
  await signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
