import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export interface UpdatePrivacyInput {
    id: string;
    show_linked_github: boolean;
    show_linked_discord: boolean;
    show_linked_email: boolean;
    show_profile: boolean;
}

export const useUpdatePrivacy = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: UpdatePrivacyInput) => {
            const supabase = createClient();
            const { error } = await supabase
                .from("users")
                .update({
                    show_linked_github: input.show_linked_github,
                    show_linked_discord: input.show_linked_discord,
                    show_linked_email: input.show_linked_email,
                    show_profile: input.show_profile,
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