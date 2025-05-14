import { createClient } from "@/utils/supabase/client";

const slackAuth = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "slack_oidc",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    return data;
};

export default slackAuth;