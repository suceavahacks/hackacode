import { createClient } from "@/utils/supabase/client";
import { useMutation } from '@tanstack/react-query';

interface HandleSubmitProps { 
    username: string;
    message: string;
    timestamp: string;
    slug: string;
}

export const useSubmitDiscussion = () => {
    return useMutation({
        mutationFn: async ({ username, message, timestamp, slug }: HandleSubmitProps) => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from("problems")
                .select("discussion")
                .eq("slug", slug)
                .single();

            if (error || !data) throw new Error("Problem not found");

            const discussion = data.discussion || [];
            const newMsg = {
                username,
                message,
                timestamp,
            };

            const { error: updateError } = await supabase
                .from("problems")
                .update({ discussion: [...discussion, newMsg] })
                .eq("slug", slug);

            if (updateError) throw new Error("Failed to update discussion");

            return newMsg;
        },
    });
};