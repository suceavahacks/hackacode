import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"

const getDuel = async (id: string): Promise<any> => {
    const supabase = createClient()
    const { data: challenge, error } = await supabase
        .from("duels")
        .select("*")
        .eq("id", id)
        .single()

    if (error) {
        return null;
    }

    return challenge
}

export const useDuel = (id: string) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["duel", id],
        queryFn: () => getDuel(id),
        enabled: !!id,
        retry: false,
        refetchOnWindowFocus: false,
    })

    return {
        duel: data,
        loading: isLoading,
        error: isError ? error : null,
    }
}
