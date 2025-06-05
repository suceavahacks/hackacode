import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const fetchSearchResults = async (value: string) => {
    if (!value.trim()) return [];
    const [{ data: problems }, { data: users }] = await Promise.all([
        supabase
            .from("problems")
            .select("id, slug")
            .ilike("title", `%${value}%`),
        supabase
            .from("users")
            .select("id, username, slug")
            .or(`username.ilike.%${value}%,slug.ilike.%${value}%`),
    ]);
    const formattedProblems = (problems || []).map((item: any) => ({
        id: item.id,
        label: item.slug,
        type: "Challenge",
    }));
    const formattedUsers = (users || []).map((item: any) => ({
        id: item.id,
        label: item.slug,
        type: "User",
    }));
    return [...formattedUsers, ...formattedProblems];
};

export const useSearchQuery = (value: string, enabled = true) =>
    useQuery({
        queryKey: ["search", value],
        queryFn: () => fetchSearchResults(value),
        enabled: enabled && !!value.trim(),
    });