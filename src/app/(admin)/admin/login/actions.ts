"use server";

import { redirect } from "next/navigation";
import { verifyAdminCredentials, createSession } from "@/lib/auth";

export async function loginAction(_prevState: string | null, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const admin = await verifyAdminCredentials(email, password);
  if (!admin) {
    return "Incorrect email or password.";
  }

  await createSession(admin.id);
  redirect("/admin");
}
