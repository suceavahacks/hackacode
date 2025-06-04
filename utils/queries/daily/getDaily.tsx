import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"

const getDaily = async (): Promise<any> => {
    const supabase = createClient()
    const { data: challenge, error } = await supabase
        .from("daily")
        .select("*")
    
    if (error) {
        return null;
    }
    
    return challenge
}

export const useDaily = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["daily"],
    queryFn: () => getDaily(),
    retry: false,
    refetchOnWindowFocus: false,
  })

  return {
    daily: data,
    loading: isLoading,
    error: isError ? error : null,
  }
}