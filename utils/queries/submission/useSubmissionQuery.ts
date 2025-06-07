import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export type Submission = {
    id: string;
    challenge: string;
    timestamp: string;
    status: string;
    score: number;
};

export type UserSubmissions = {
    slug: string;
    submissions: Submission[];
};

const fetchUserSubmissions = async () => {
    const supabase = createClient();
    const { data } = await supabase
        .from("users")
        .select("slug, submissions");
    
    if (!data) return [];
    
    return data.map((u: any) => ({
        slug: u.slug,
        submissions: u.submissions || [],
    }));
};

export const useSubmissionsQuery = () => {
    return useQuery<UserSubmissions[]>({
        queryKey: ['userSubmissions'],
        queryFn: fetchUserSubmissions,
        initialData: []
    });
};