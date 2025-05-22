import { createClient } from "@/utils/supabase/client";

export const onSubmit = async (
  data: {
    email: string;
    password: string;
  },
  setLoading: (value: boolean) => void,
  setError: (value: string | null) => void
) => {
  setLoading(true);
  setError(null);

  const supabase = await createClient();
  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  });

  if (error) {
    setError(error.message);
    return ;
  }

  if(signInData.session) {
    await supabase.auth.setSession({
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    });
      setLoading(false);
    window.location.href = "/app";
    return;
  }
};