import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export interface UpdateProfileInput {
    id: string;
    username: string;
    full_name: string;
    bio: string;
    profile_picture: string;
    slug: string;
    prg_languages: string[];
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: UpdateProfileInput) => {
            const supabase = createClient();
            const { error } = await supabase
                .from("users")
                .update({
                    username: input.username,
                    full_name: input.full_name,
                    bio: input.bio,
                    profile_picture: input.profile_picture,
                    slug: input.slug,
                    prg_languages: input.prg_languages,
                })
                .eq("id", input.id);
            if (error) throw new Error(error.message);
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};