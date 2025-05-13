import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // https://hackacode.xyz/auth/handle-callback
    return NextResponse.redirect("https://hackacode.xyz/auth/handle-callback");
}
