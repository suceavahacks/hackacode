import { createClient } from "@/utils/supabase/client";
import { useMutation } from '@tanstack/react-query';

interface HandleSubmitProps {
    code: string;
    challenge: { slug: string; time_limit: number; memory_limit: number  };
    language: string;
    user: { id: string };
    setResults: (results: any) => void;
    setModalOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    duelId?: string;
    daily?: string
}

export const useSubmitChallenge = () => {
    return useMutation({
        mutationFn: async ({ code, challenge, language, user, setResults, setModalOpen, setLoading, duelId, daily }: HandleSubmitProps) => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession()
            const accessToken = data.session?.access_token
            setLoading(true)

            const response = await fetch("https://judger.hackacode.xyz/api/v1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    code: code,
                    slug: challenge.slug,
                    language: language,
                    challenge: challenge.slug,
                    time: challenge.time_limit,
                    memory: challenge.memory_limit,
                }),
            });

            if (!response.ok) {
                setLoading(false);
                return;
            }

            const result = await response.json();

            const { data: userData } = await supabase
                .from("users")
                .select("submissions, completed_dailies")
                .eq('id', user.id)
                .single();

            const submissions = userData?.submissions || [];

            submissions.push({
                challenge: challenge.slug,
                code: code,
                result: result,
                language: language,
                timestamp: new Date(),
                status: result.status,
                score: result.score,
                duelId: duelId || null,
            });

            await supabase
                .from("users")
                .update({
                    submissions: submissions
                })
                .eq('id', user.id);


            if (daily) {
                if(result.status === "ACCEPTED") {
                    const completedDailies = userData?.completed_dailies || [];
                    if(!completedDailies.includes(daily)) {
                        completedDailies.push(daily);
                        await supabase
                            .from("users")
                            .update({
                                completed_dailies: completedDailies
                            })
                            .eq('id', user.id);
                    }
                }
            }

            setResults(result);
            setModalOpen(true);
            setLoading(false);
            return result;
        }
    });
};