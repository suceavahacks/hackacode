"use client"
import NotFound from "@/app/not-found";
import { Loading } from "@/components/Loading";
import { useDuel } from "@/utils/queries/duels/getDuel";
import { useUser } from "@/utils/queries/user/getUser";
import { Code2Icon, ArrowRightIcon, ZapIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Challenge = {
    id: string;
    title: string;
    description: string;
    slug: string;
    difficulty: string;
};

const Duel = () => {
    const params = useParams();
    const duelId = params.duelId;
    const { duel, loading } = useDuel(duelId?.toString() || "");
    const { user, loading: userLoading } = useUser();
    const supabase = createClient();
    const [usernames, setUsernames] = useState<{ user1Name: string; user2Name: string }>({ user1Name: "", user2Name: "" });
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [ended, setEnded] = useState<boolean>(false);
    const [timeRemaining, setTimeRemaining] = useState<number>(duel?.time_limit || 0);

    const getUsernames = async () => {
        if (!duel) return { user1Name: "", user2Name: "" };

        const { data: user1Data } = await supabase
            .from("users")
            .select("username")
            .eq("id", duel.user1_id)
            .single();

        const { data: user2Data } = await supabase
            .from("users")
            .select("username")
            .eq("id", duel.user2_id)
            .single();

        return {
            user1Name: user1Data?.username || "",
            user2Name: user2Data?.username || ""
        };
    };

    const getChallengeInfo = async () => {
        if (!duel || !duel.challenges_slug) return [];

        interface ChallengeData {
            id: string;
            title: string;
            description: string;
            slug: string;
            difficulty: string;
        }

        const slugs = duel.challenges_slug

        const challengePromises: Promise<ChallengeData | null>[] = slugs.map(async (slug: { slug: string }): Promise<ChallengeData | null> => {
            if (!slug) return null;

            const { data, error } = await supabase
                .from("problems")
                .select("id, title, description, slug, difficulty")
                .eq("slug", slug.slug)
                .single();

            if (error || !data) return null;
            return data as ChallengeData;
        });

        const results = await Promise.all(challengePromises);
        return results.filter(Boolean) as Challenge[];
    };

    useEffect(() => {
        const fetchData = async () => {
            if (duel) {
                const names = await getUsernames();
                setUsernames(names);

                const challengeData = await getChallengeInfo();
                setChallenges(challengeData);
            }
        };

        fetchData();
    }, [duel]);

    useEffect(() => {
        if (duel && duel.started_at) {
            const updateTimer = () => {
                const startTime = new Date(duel.started_at).getTime();
                const currentTime = Date.now();
                const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
                const remaining = Math.max(0, duel.time_limit - elapsedSeconds);

                setTimeRemaining(remaining);
                setEnded(remaining <= 0);

                if (remaining > 0) {
                    setTimeout(updateTimer, 1000);
                }
            };

            updateTimer();
        }
    }, [duel]);

    useEffect(() => {
        if (duel && duel.status !== "completed" && ended) {
            const updateDuelStatus = async () => {
                try {
                    await supabase
                        .from("duels")
                        .update({ status: "completed" })
                        .eq("id", duelId);
                } catch (error) {
                    console.error("aw", error);
                }
            };

            updateDuelStatus();
        }
    }, [ended, duel, duelId, supabase]);

    if (loading || userLoading) {
        return <Loading />;
    }

    if (!user) {
        return <NotFound />;
    }

    if (!duel) {
        return <NotFound />;
    }

    return (
        <div className="w-screen mx-auto relative bg-secondary border-b border-gray-800 h-[calc(100vh-64px)]">
            <div className="bg-primary py-16">
                <div className="flex items-center justify-center gap-4 mb-6 text-center">
                    <div className="relative">
                        <Code2Icon className="h-12 w-12 color relative z-10" />
                    </div>
                    <h1 className="text-5xl font-bold color">
                        Duel
                    </h1>
                </div>
                <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed text-center">
                    Welcome to the duel between <span className="text-accent">{usernames.user1Name || "Player 1"}</span> and <span className="text-accent">{usernames.user2Name || "Player 2"}</span>!
                    May the best coder win!
                </p>
                <div className="flex items-center justify-center gap-16 mt-12">
                    <div className="text-center p-4 bg-secondary rounded-xl border border-gray-800 shadow-lg min-w-[150px]">
                        <div className="text-2xl font-bold text-accent mb-1">{usernames.user1Name || "Player 1"}</div>
                        <div className="text-sm text-gray-400">Creator</div>
                    </div>

                    <div className="text-center bg-primary p-3 px-5 rounded-full shadow-inner border border-gray-800">
                        <div className="text-xl font-bold text-accent">VS</div>
                    </div>

                    <div className="text-center p-4 bg-secondary rounded-xl border border-gray-800 shadow-lg min-w-[150px]">
                        <div className="text-2xl font-bold text-accent mb-1">{usernames.user2Name || "Player 2"}</div>
                        <div className="text-sm text-gray-400">Challenger</div>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto p-6 mt-12">
                <div className="mt-8 flex flex-col items-center justify-center gap-2">
                    {ended ? (
                        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 max-w-md w-full text-center">
                            <h3 className="text-xl font-bold text-red-400 mb-2">Duel ended</h3>
                            <p className="text-gray-300">
                                Time's up! This duel has been completed.
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 bg-secondary/60 px-4 py-2 rounded-lg border border-accent/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="font-mono text-lg">
                                Time remaining: <span className="text-accent font-bold">
                                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {challenges && challenges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                        {challenges.map((challenge: Challenge) => (
                            ended ? (
                                <div key={challenge.id} className="h-full relative rounded-2xl p-6 border border-gray-700 bg-gray-800/50 flex flex-col opacity-50 cursor-not-allowed">
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <h2 className="text-xl font-bold text-gray-400 leading-tight">
                                                {challenge.title}
                                            </h2>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${getDifficultyColor(challenge.difficulty)}`}>
                                                {challenge.difficulty || 'Unknown'}
                                            </span>
                                        </div>

                                        <div className="mb-6">
                                            {challenge.description ? (
                                                <div
                                                    className="text-gray-500 text-sm leading-relaxed line-clamp-2 prose prose-sm prose-invert max-w-none"
                                                    dangerouslySetInnerHTML={{
                                                        __html: challenge.description.length > 250
                                                            ? challenge.description.substring(0, 250) + '...'
                                                            : challenge.description
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-gray-500 italic text-sm">No description available</p>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center mt-auto">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                                <ZapIcon className="h-4 w-4" />
                                                <span>Duel ended</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link href={`/duels/${duelId}/challenges/${challenge.slug}`} key={challenge.id}>
                                    <div className="group h-full relative rounded-2xl p-6 border border-gray-700 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-primary flex flex-col">
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <h2 className="text-xl font-bold text-white group-hover:transition-colors group-hover:duration-300 leading-tight">
                                                    {challenge.title}
                                                </h2>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${getDifficultyColor(challenge.difficulty)}`}>
                                                    {challenge.difficulty || 'Unknown'}
                                                </span>
                                            </div>

                                            <div className="mb-6">
                                                {challenge.description ? (
                                                    <div
                                                        className="text-gray-400 text-sm leading-relaxed line-clamp-2 prose prose-sm prose-invert max-w-none"
                                                        dangerouslySetInnerHTML={{
                                                            __html: challenge.description.length > 250
                                                                ? challenge.description.substring(0, 250) + '...'
                                                                : challenge.description
                                                        }}
                                                    />
                                                ) : (
                                                    <p className="text-gray-500 italic text-sm">No description available</p>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center mt-auto">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <ZapIcon className="h-4 w-4" />
                                                    <span>Start challenge</span>
                                                </div>
                                                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-12">
                        <p className="text-gray-400">No challenges available for this duel.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function getDifficultyColor(difficulty: string | null): string {
    switch (difficulty?.toLowerCase()) {
        case 'easy':
            return 'bg-green-500 text-white';
        case 'medium':
            return 'bg-yellow-500 text-white';
        case 'hard':
            return 'bg-red-500 text-white';
        default:
            return 'bg-blue-500 text-white';
    }
}

export default Duel;