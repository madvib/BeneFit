import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
// For now, using a mock implementation

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/feed";

  console.log(
    "Callback route hit with token_hash:",
    token_hash,
    "and type:",
    type
  );

  // In a real implementation, we would verify the token against the auth system
  // For now, redirect appropriately based on type
  if (type === "recovery") {
    redirect("/update-password");
  } else if (type === "signup") {
    redirect("/email-confirmed");
  } else {
    redirect(next);
  }
}
