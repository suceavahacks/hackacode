import { createClient } from "@/utils/supabase/client";

const slackAuth = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "slack_oidc"
    });

    return data;
};

export default slackAuth;
