import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const email = user.email || "no_email";
      const username =
        user.user_metadata?.user_name ||
        (email ? email.split("@")[0] : user.id);

      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        await supabase.from("users").insert({
          id: user.id,
          username,
          profile_picture: user.user_metadata?.avatar_url || null,
          bio: "hackacoder",
          email,
          slug: username.toLowerCase().replace(/\s+/g, "-") || "hackacoder" + user.id.slice(0, 6),
        });
      }

      const response = await fetch("https://judger.hackacode.xyz/get-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: existingUser?.api_key || user.id,
        }),
      });

      const tokenData = await response.json();

      await supabase
        .from("users")
        .update({
          jwt: tokenData.token,
        })
        .eq("id", user.id);
    }
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/app`);
}