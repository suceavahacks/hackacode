import { createClient } from "@/utils/supabase/client";

export const onSubmit = async (
    data: { email: string; password: string },
    setLoading: (value: boolean) => void,
    setError: (value: string | null) => void,
    setSuccess: (value: boolean) => void
) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/app`,
        },
    });

    if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
    }

    const { data: existingUser, error: existingUserError } = await supabase
        .from("users")
        .select("*")
        .eq("email", data.email)
        .single();

    if (existingUserError && existingUserError.code !== "PGRST116") {
        setError(existingUserError.message);
        setLoading(false);
        return;
    }

    if (existingUser) {
        setError("User already exists. Please sign in.");
        setLoading(false);
        return;
    }


    const { error: insertError } = await supabase
        .from("users")
        .insert({
            id: signUpData.user?.id,
            username: data.email.split("@")[0],
            profile_picture: null,
            bio: "hackacoder",
            email: data.email,
        });

    if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
    }


    const { data: getUser, error: getUserError } = await supabase
        .from("users")
        .select("*")
        .eq("id", signUpData.user?.id)
        .single();

    if (getUserError) {
        setError(getUserError.message);
        setLoading(false);
        return;
    }

    const response = await fetch("https://judger.hackacode.xyz/get-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            api_key: getUser?.api_key,
        }),
    });

    if (!response.ok) {
        setError("Failed to fetch token from external API.");
        setLoading(false);
        return;
    }

    const tokenData = await response.json();

    const { error: updateError } = await supabase
        .from("users")
        .update({
            jwt: tokenData.token,
        })
        .eq("id", signUpData.user?.id);

    if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
    }

    if (signUpData.user) {
        if (!signUpData.user.user_metadata?.email_verified) {
            setError(
                `An email has been sent to ${data.email} for verification. Please check your inbox and verify your email address.`
            );
            setLoading(false);
            return;
        }
    }


    setSuccess(true);
    setLoading(false);
    return signUpData;
};