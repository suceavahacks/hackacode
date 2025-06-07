import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export type VoteType = "upvote" | "downvote";

interface VoteParams {
    challengeSlug: string;
    userId: string;
    voteType: VoteType;
}

export const useVoteChallenge = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ challengeSlug, userId, voteType }: VoteParams) => {
            const supabase = createClient();

            const { data: challenge, error: fetchError } = await supabase
                .from("problems")
                .select("upvotes, downvotes")
                .eq("slug", challengeSlug)
                .single();

            if (fetchError) {
                throw new Error(`Failed to fetch challenge: ${fetchError.message}`);
            }

            const upvotes = challenge?.upvotes || [];
            const downvotes = challenge?.downvotes || [];

            let updatedUpvotes = [...upvotes];
            let updatedDownvotes = [...downvotes];

            if (voteType === "upvote") {
                if (updatedUpvotes.includes(userId)) {
                    updatedUpvotes = updatedUpvotes.filter(id => id !== userId);
                } else {
                    updatedUpvotes.push(userId);
                    updatedDownvotes = updatedDownvotes.filter(id => id !== userId)
                }
            } else {
                if (updatedDownvotes.includes(userId)) {
                    updatedDownvotes = updatedDownvotes.filter(id => id !== userId);
                } else {
                    updatedDownvotes.push(userId);
                    updatedUpvotes = updatedUpvotes.filter(id => id !== userId)
                }
            }

            const { error: updateError } = await supabase
                .from("problems")
                .update({
                    upvotes: updatedUpvotes,
                    downvotes: updatedDownvotes,
                })
                .eq("slug", challengeSlug);

            if (updateError) {
                throw new Error(`Failed to update votes: ${updateError.message}`);
            }

            return {
                upvotesCount: updatedUpvotes.length,
                downvotesCount: updatedDownvotes.length,
                userUpvoted: updatedUpvotes.includes(userId),
                userDownvoted: updatedDownvotes.includes(userId),
            };
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["challenge", variables.challengeSlug] });
        },
    });
};
