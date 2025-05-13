import { createClient } from "@/utils/supabase/server";

const slackAuth = async () => {
    const requst = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/slack`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    const response = await requst.json();
    if (!requst.ok) {
        throw new Error(response.message || "Something went wrong");
    }
   
    const { url } = response;
    window.location.href = url;

};

export default slackAuth;