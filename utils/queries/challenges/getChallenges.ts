import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"

const getChallenges = async (): Promise<any> => {
    const supabase = createClient()
    const { data: challenge, error } = await supabase
        .from("problems")
        .select("*")
    
    if (error) {
        return null;
    }
    
    return challenge
}

export const useChallenges = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => getChallenges(),
    retry: false,
    refetchOnWindowFocus: false,
  })

  return {
    challenges: data,
    loading: isLoading,
    error: isError ? error : null,
  }
}