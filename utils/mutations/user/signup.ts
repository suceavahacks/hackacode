import { createClient } from "@/utils/supabase/client";

export const onSubmit = async (data: {
    email: string;
    password: string;
}, setLoading: (value: boolean) => void, setError: (value: string | null) => void, setSuccess: (value: boolean) => void) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/app`,
        }
    });

    const { error: insertError } = await supabase
        .from("users")
        .insert({
            id: signUpData.user?.id,
            username: data.email.split("@")[0],
            profile_picture: 'null',
            bio: 'hackacoder'
        })
        .select("*")
        .single();

    console.log("Insert Error: ", insertError);
    
    if (error) {
        setError(error.message);
        setLoading(false);
        return ;
    }

    if(signUpData.user) {
        if(Object.keys(signUpData.user.user_metadata).length == 0) {
            setError("You already have an account. Please sign in.");
            setLoading(false);
            return ;
        }else {
            if(!signUpData.user?.user_metadata?.email_verified) {
                setError(`An email has been sent to ${data.email} for verification. Please check your inbox and verify your email address.`);
                setLoading(false);
                return ;
            }
        }
    }    

    setLoading(false);
    return signUpData;
}