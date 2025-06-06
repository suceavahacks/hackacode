import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const fetchUser = async (): Promise<any> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if(!user || !user?.id) {
    return null;
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();

  const combinedUser = { ...user, ...userData };
  if(Object.keys(combinedUser).length === 0){
    return null;
  }
  
  return combinedUser;
};

export const useUser = () => {

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { user, loading: isLoading, error: isError ? error : null };
};