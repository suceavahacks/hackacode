import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"

const getChallenge = async (slug: string): Promise<any> => {
    const supabase = createClient()
    const { data: challenge, error } = await supabase
        .from("problems")
        .select("*")
        .eq("slug", slug)
        .single()
    
    if (error) {
        return null;
    }
    
    return challenge
}

export const useChallenge = (slug: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["challenge", slug],
    queryFn: () => getChallenge(slug),
    enabled: !!slug,
    retry: false,
    refetchOnWindowFocus: false,
  })

  return {
    challenge: data,
    loading: isLoading,
    error: isError ? error : null,
  }
}