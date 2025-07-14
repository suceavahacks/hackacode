import { createClient } from "@/utils/supabase/client";

const googleAuth = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google"
    });

    return data;
};

export default googleAuth;
