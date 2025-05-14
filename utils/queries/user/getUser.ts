import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const fetchUser = async (): Promise<any> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return user;
};

export const useUser = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: isMounted,
  });

  if (!isMounted) {
    return { user: null, loading: true, error: null };
  }

  return { user, loading: isLoading, error: isError ? error : null };
};