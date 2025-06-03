import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const fetchProfile = async (username: string): Promise<any> => {
  const supabase = createClient();

  const { data: profileData, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!profileData) {
    return null;
  }

  return { ...profileData };
}

export const useProfile = (username: string) => {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => fetchProfile(username),
    enabled: !!username,
    retry: false,
    refetchOnWindowFocus: false,
  });
};