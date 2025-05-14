import { createClient } from "@/utils/supabase/client";

const githubAuth = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    return data;
}

export default githubAuth;