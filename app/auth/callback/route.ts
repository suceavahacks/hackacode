import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");
    const expires_at = searchParams.get("expires_at");

    localStorage.setItem("access_token", access_token || "");
    localStorage.setItem("refresh_token", refresh_token || "");
    localStorage.setItem("expires_at", expires_at || "");

}
