import { createClient } from "@/utils/supabase/client";

const githubAuth = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github"
    });

    return data;
}

export default githubAuth;
