"use client";
import { Loading } from "@/components/Loading";
import { useChallenges } from "@/utils/queries/challenges/getChallenges";
import { FlagIcon, ClockIcon, MemoryStickIcon, TrophyIcon, ZapIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

type Challenge = {
    id: number;
    title: string;
    slug: string;
    difficulty: string | null;
    time_limit: number;
    memory_limit: number;
    description?: string;
};

export default function Challenges() {
    const { challenges, loading, error } = useChallenges();

    return (
        <div className="relative z-50 min-h-screen">
            <div className="bg-secondary border-b border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full blur-2xl"></div>
                </div>

                <div className="max-w-6xl mx-auto py-16 px-6 relative">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="relative">
                                <FlagIcon className="h-12 w-12 color relative z-10" />
                            </div>
                            <h1 className="text-5xl font-bold color">
                                Challenges
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                            Mhm. Coding challenges?! Yep, we have them! Solve these challenges to improve your coding skills, learn new algorithms, and compete with others.
                        </p>

                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold btn">{challenges?.length || 0}</div>
                                <div className="text-sm text-gray-400">Total Challenges</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {challenges && challenges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                        {challenges.map((challenge: Challenge) => (
                            <Link href={`/challenges/${challenge.slug}`} key={challenge.id}>
                                <div className="group relative rounded-2xl p-6 border border-gray-700 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-primary">
                                    <div className="relative z-10">
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
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <ZapIcon className="h-4 w-4" />
                                                <span>Start challenge</span>
                                            </div>
                                            <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Loading />
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