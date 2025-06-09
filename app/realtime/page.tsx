"use client";

import Link from "next/link";
import { useState } from "react";
import useAllUserSubmissionsRealtime from "@/utils/mutations/challenges/realTimeSubmissions/useRealTimeSubmissions";
import { useUser } from "@/utils/queries/user/getUser";
import NotAuth from "@/components/NeedAuth";
import { useSubmissionsQuery, type Submission, type UserSubmissions } from "@/utils/queries/submission/useSubmissionQuery";
import { useQueryClient } from "@tanstack/react-query";
import { Zap, CheckCircle, XCircle, Clock, Activity, User, Filter } from "lucide-react";

export default function RealtimeSubmissionsPage() {
    const { data: allSubs = [] } = useSubmissionsQuery();
    const { user } = useUser();
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACCEPTED" | "FAILED">("ALL");

    const handleUpdate = (submissions: Submission[], slug: string) => {
        const queryClient = useQueryClient();
        queryClient.setQueryData(['userSubmissions'], (prev: UserSubmissions[] = []) => {
            const filtered = prev.filter((u) => u.slug !== slug);
            return [...filtered, { slug, submissions }];
        });
    };

    useAllUserSubmissionsRealtime(handleUpdate);

    const now = Date.now();

    const userMap = new Map();
    allSubs.forEach((u) => {
        userMap.set(u.slug, {
            slug: u.slug,
            profile_picture: u.profile_picture
        });
    });

    
    const allRecentSubs = allSubs
        .flatMap((u) =>
            (u.submissions || []).map((s) => ({
                ...s,
                slug: u.slug,
                profile_picture: u.profile_picture
            }))
        )
        .filter((s) => now - new Date(s.timestamp).getTime() <= 24 * 60 * 60 * 1000)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        

    const last24hSubs = statusFilter === "ALL" 
        ? allRecentSubs 
        : allRecentSubs.filter(sub => sub.status === statusFilter);

    if (!user) {
        return <NotAuth />;
    }

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case "ACCEPTED":
                return <span className="flex items-center gap-1 text-green-400"><CheckCircle size={14} /> Solved</span>;
            case "FAILED":
                return <span className="flex items-center gap-1 text-red-400"><XCircle size={14} /> Failed</span>;
            default:
                return <span className="flex items-center gap-1 text-yellow-400"><Clock size={14} /> Pending</span>;
        }
    };

    const formatTimeAgo = (timestamp: string) => {
        const seconds = Math.floor((now - new Date(timestamp).getTime()) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return `${interval}y ago`;
        
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `${interval}m ago`;
        
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `${interval}d ago`;
        
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `${interval}h ago`;
        
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return `${interval}min ago`;
        
        return `${Math.floor(seconds)}s ago`;
    };

    return (
        <div className="min-h-screen w-full bg-primary flex flex-col">
            <div className="flex-1 flex flex-col md:ml-[64px] px-4 md:px-6">
                <div className="max-w-3xl w-full mx-auto mt-6 md:mt-8">
                    <div className="flex items-center mb-6">
                        <Zap size={20} className="text-accent mr-2" />
                        <h1 className="text-2xl font-bold color">Live activity</h1>
                    </div>
                    
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-400">Filter:</span>
                            <div className="flex gap-1">
                                <button 
                                    onClick={() => setStatusFilter("ALL")}
                                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                        statusFilter === "ALL" 
                                        ? "bg-accent text-white" 
                                        : "bg-secondary text-gray-300 hover:bg-secondary/80"
                                    }`}
                                >
                                    All
                                </button>
                                <button 
                                    onClick={() => setStatusFilter("ACCEPTED")}
                                    className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${
                                        statusFilter === "ACCEPTED" 
                                        ? "bg-green-500 text-white" 
                                        : "bg-secondary text-gray-300 hover:bg-secondary/80"
                                    }`}
                                >
                                    <CheckCircle size={12} />
                                    Solved
                                </button>
                                <button 
                                    onClick={() => setStatusFilter("FAILED")}
                                    className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${
                                        statusFilter === "FAILED" 
                                        ? "bg-red-500 text-white" 
                                        : "bg-secondary text-gray-300 hover:bg-secondary/80"
                                    }`}
                                >
                                    <XCircle size={12} />
                                    Failed
                                </button>
                            </div>
                        </div>
                        <div className="text-sm text-gray-400">
                            {last24hSubs.length} {last24hSubs.length === 1 ? 'submission' : 'submissions'} in the last 24h
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        {last24hSubs.length === 0 ? (
                            <div className="bg-secondary/50 rounded-lg p-10 text-center border border-gray-800">
                                <div className="bg-primary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Activity className="text-accent" size={30} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No recent activity</h3>
                                <p className="text-gray-400 max-w-md mx-auto">There haven't been any submissions in the last 24 hours. Check back later or try solving some challenges yourself!</p>
                                <div className="mt-6">
                                    <Link href="/challenges" className="inline-flex items-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent px-6 py-3 rounded-lg transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                        Browse Challenges
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            last24hSubs.map((sub, index) => (
                                <div
                                    key={sub.id}
                                    className="bg-secondary/80 rounded-lg p-4 md:p-5 transition-all flex items-start gap-3 hover:bg-secondary/95 border border-gray-800 mb-4 shadow-sm group"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-primary/40 border-2 border-gray-800">
                                            {sub.profile_picture ? (
                                                <Link href={`/profile/${sub.slug}`}>
                                                    <img 
                                                        src={sub.profile_picture} 
                                                        alt={`${sub.slug}'s avatar`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </Link>
                                            ) : (
                                                <Link href={`/profile/${sub.slug}`} className="w-full h-full flex items-center justify-center">
                                                    <User size={18} className="text-accent" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap gap-x-2 items-center text-sm">
                                            <Link 
                                                href={`/profile/${sub.slug}`} 
                                                className="font-medium text-white hover:text-accent transition-colors group-hover:underline"
                                            >
                                                {sub.slug}
                                            </Link>
                                            {getStatusDisplay(sub.status)}
                                            <Link 
                                                href={`/challenges/${sub.challenge}`} 
                                                className="color hover:underline hover:decoration-wavy text-ellipsis overflow-hidden max-w-[200px] truncate"
                                            >
                                                {sub.challenge}
                                            </Link>
                                            <div className="ml-auto text-xs text-gray-400 font-mono">{formatTimeAgo(sub.timestamp)}</div>
                                        </div>
                                        
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="bg-secondary px-2 py-1 rounded text-gray-300 text-xs">
                                                Score: <span className="text-accent font-medium">{sub.score || 0}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}