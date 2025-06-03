"use client"
import { Loading } from "@/components/Loading";
import { useUser } from "@/utils/queries/user/getUser";
import { useActiveDuels } from "@/utils/queries/duels/activeDuels";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, Code2Icon, Zap, CheckCheckIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Submission {
    id?: string;
    challenge: string;
    code: string;
    result?: {
        status: string;
        results?: any[];
    };
    language: string;
    timestamp: string | number | Date;
    status: string;
}

interface UserWithSubmissions {
    id: string;
    username: string;
    profile_picture: string | null;
    bio: string;
    email: string;
    submissions?: Submission[];
}

export default function App() {
    const { user, loading } = useUser();
    const { data: activeDuels = [], isLoading: duelsLoading } = useActiveDuels(user?.id);
    const router = useRouter();

    if (loading || duelsLoading) return <Loading />;

    if (!user) {
        router.push("/");
        return null;
    }

    const typedUser = user as UserWithSubmissions;

    const solvedChallenges = typedUser.submissions?.filter(
        (sub) => sub.result?.status === "ACCEPTED" && (sub.result?.results?.length ?? 0) > 0
    ) || [];

    const uniqueSolvedChallenges = Array.from(
        new Set(solvedChallenges.map(sub => sub.challenge))
    ).map(challenge =>
        solvedChallenges.find(sub => sub.challenge === challenge)
    );

    const recentSubmissions = typedUser.submissions?.slice(0, 3) || [];

    const submissionCount = typedUser.submissions?.length || 0;
    const acceptanceRate = submissionCount > 0
        ? Math.round((uniqueSolvedChallenges.length / submissionCount) * 100)
        : 0;

    return (
        <div className="ml-[64px] max-md:ml-0 min-h-screen bg-primary text-white">
            <div className="max-w-7xl mx-auto p-6">
                <div className="border-b border-gray-700 pb-6 mb-8">
                    <h1 className="text-4xl font-bold">
                        Welcome, <span className="text-accent">{typedUser.username}</span>!
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Here's a quick overview of your coding journey so far.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-secondary rounded-lg p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-gray-400 text-sm">Solved challenges</div>
                                <div className="text-3xl font-bold">{uniqueSolvedChallenges.length}</div>
                            </div>
                            <div className="bg-accent/20 p-3 rounded-lg text-accent">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                        <div className="text-gray-400 text-sm mt-auto">
                            {uniqueSolvedChallenges.length > 0
                                ? "Great job! Keep it up!"
                                : "Start solving your first challenge!"}
                        </div>
                    </div>

                    <div className="bg-secondary rounded-lg p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-gray-400 text-sm">Total submissions</div>
                                <div className="text-3xl font-bold">{submissionCount}</div>
                            </div>
                            <div className="bg-accent/20 p-3 rounded-lg text-accent">
                                <Code2Icon size={24} />
                            </div>
                        </div>
                        <div className="text-gray-400 text-sm mt-auto">
                            {submissionCount > 10
                                ? "You're getting experienced!"
                                : "Keep submitting solutions"}
                        </div>
                    </div>

                    <div className="bg-secondary rounded-lg p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-gray-400 text-sm">Acceptance rate</div>
                                <div className="text-3xl font-bold">{acceptanceRate}%</div>
                            </div>
                            <div className="bg-accent/20 p-3 rounded-lg text-accent">
                                <CheckCheckIcon size={24} />
                            </div>
                        </div>
                        <div className="text-gray-400 text-sm mt-auto">
                            {acceptanceRate > 70
                                ? "Impressive accuracy!"
                                : "Aiming for higher accuracy"}
                        </div>
                    </div>
                </div>

                <div className="bg-secondary rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Recent submissions</h2>
                        <Link href="/challenges" className="text-accent hover:underline hover:decoration-wavy text-sm flex items-center">
                            View all challenges <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {recentSubmissions.length > 0 ? (
                        <div className="space-y-4 grid">
                            {recentSubmissions.map((sub, idx) => (
                                <Link href={`/challenges/${sub.challenge}`} key={idx}>
                                    <div className="border border-gray-700 rounded-lg p-4 hover:bg-primary/40 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium">{sub.challenge}</h3>
                                            <span className={`px-2 py-1 rounded text-xs ${sub.result?.status === "ACCEPTED" ? "bg-green-900 text-green-300" :
                                                    "bg-red-900 text-red-300"
                                                }`}>
                                                {sub.result?.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-400 mt-2">
                                            <span>{sub.language}</span>
                                            <span className="mx-2">•</span>
                                            <span>{new Date(sub.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <p>No submissions yet</p>
                            <Link href="/challenges" className="text-accent hover:underline hover:decoration-wavy mt-2 block">
                                Try a challenge
                            </Link>
                        </div>
                    )}
                </div>

                <div className="bg-secondary rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Active duels</h2>
                        <Link href="/duels" className="text-accent hover:underline hover:decoration-wavy text-sm flex items-center">
                            View all duels <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {activeDuels.length > 0 ? (
                        <div className="space-y-4 grid">
                            {activeDuels.map((duel, idx) => (
                                <Link href={`/duels/${duel.id}`} key={idx}>
                                    <div className="border border-gray-700 rounded-lg p-4 hover:bg-primary/40 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium">
                                                Duel #{duel.id}
                                            </h3>
                                            <span className="px-2 py-1 rounded text-xs bg-blue-900 text-blue-300">
                                                ACTIVE
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-400 mt-2">
                                            <span>Started: {new Date(duel.started_at).toLocaleString()}</span>
                                            <span className="mx-2">•</span>
                                            <span>{duel.challenges_slug?.length || 0} challenges</span>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                                            <div className="text-sm">
                                                <span className="text-gray-400">Opponent: </span>
                                                <span className="text-accent">{duel.user1_id === typedUser.id ? "Player 2" : "Player 1"}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-accent">
                                                <Zap size={14} />
                                                <span className="text-sm">Continue duel</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <p>No active duels</p>
                            <Link href="/duels/" className="text-accent hover:underline hover:decoration-wavy mt-2 block">
                                Create a duel
                            </Link>
                        </div>
                    )}
                </div>

                <Link href="/challenges">
                    <div className="bg-accent/20 border border-accent rounded-lg p-6 text-center hover:bg-accent/30 transition-colors">
                        <h2 className="text-xl font-bold mb-2">Ready for a new challenge?</h2>
                        <p className="mb-4">
                            We know you love coding, so why not take on a new challenge?
                        </p>
                        <button className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors flex items-center gap-2 mx-auto">
                            <Zap size={16} />
                            Browse challenges
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </Link>
            </div>
        </div>
    );
}