import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export interface UpdateAccountInput {
    id: string;
    githubAccount?: string;
    discordAccount?: string;
    oldPassword?: string;
    newPassword?: string;
}

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: UpdateAccountInput) => {
            const supabase = createClient();
            if (input.oldPassword && input.newPassword) {
                const { error } = await supabase.auth.updateUser({
                    password: input.newPassword,
                });
                if (error) throw new Error(error.message);
            }
            const { error } = await supabase
                .from("users")
                .update({
                    githubAccount: input.githubAccount,
                    discordAccount: input.discordAccount,
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