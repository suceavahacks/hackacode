"use client";

import { useParams } from 'next/navigation';
import { useProfile } from '@/utils/queries/profile/getProfile';
import { Loading } from '@/components/Loading';
import NotFound from '@/app/not-found';
import { useState, useMemo, useCallback } from 'react';
import { Github } from "lucide-react";
import Link from 'next/link';

interface ActivityData {
    date: string;
    count: number;
}

interface Submission {
    id: string;
    title?: string;
    challenge?: string;
    timestamp?: string;
    created_at: string;
    status: 'ACCEPTED' | 'FAILED';
    score: number;
}

const Profile = () => {
    const params = useParams();
    const username = params.username as string;
    const { data: profile, isLoading, error } = useProfile(username);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const submissionsPerPage: number = 5;

    const generateActivityData = useCallback((): ActivityData[] => {
        if (!profile?.submissions?.length) return [];
        
        const activityMap = new Map<string, number>();
        
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 364);
        
        const dateArray: string[] = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            activityMap.set(dateKey, 0);
            dateArray.push(dateKey);
        }
        
        const validDates = new Set(dateArray);
        
        profile.submissions.forEach((submission: Submission) => {
            const dateKey = new Date(submission.timestamp || submission.created_at)
                .toISOString().split('T')[0];
            
            if (validDates.has(dateKey)) {
                activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1);
            }
        });
        
        return Array.from(activityMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [profile?.submissions]);
    
    const activityData = useMemo(() => generateActivityData(), [generateActivityData]);
    
    const { currentSubmissions, totalPages } = useMemo(() => {
        if (!profile?.submissions) return { currentSubmissions: [], totalPages: 0 };
        
        const indexOfLast = currentPage * submissionsPerPage;
        const indexOfFirst = indexOfLast - submissionsPerPage;
        const current = profile.submissions.slice(indexOfFirst, indexOfLast);
        const total = Math.ceil(profile.submissions.length / submissionsPerPage);
        
        return { currentSubmissions: current, totalPages: total };
    }, [currentPage, profile?.submissions, submissionsPerPage]);
    
    const getCellColor = useCallback((count: number): string => {
        if (count === 0) return 'bg-[#161617]';
        if (count === 1) return 'bg-[#3fcf8f]/30';
        if (count <= 3) return 'bg-[#3fcf8f]/60';
        return 'bg-[#3fcf8f]';
    }, []);
    
    const getMonthName = useCallback((date: Date): string => {
        return date.toLocaleString('default', { month: 'short' });
    }, []);
    
    const monthLabels = useMemo(() => {
        if (!activityData?.length) return [];
        
        const startDate = new Date(activityData[0].date);
        const endDate = new Date(activityData[activityData.length - 1].date);
        
        const months = [];
        const currentDate = new Date(startDate);
        currentDate.setDate(1);
        
        while (currentDate <= endDate) {
            months.push(getMonthName(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        return months;
    }, [activityData, getMonthName]);
    
    const contributionGrid = useMemo(() => {
        return Array.from({ length: Math.ceil(activityData.length / 7) }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex;
                    const data = activityData[dataIndex];
                    
                    return data ? (
                        <div 
                            key={dayIndex}
                            className={`w-3 h-3 rounded-sm ${getCellColor(data.count)} cursor-pointer transition-all hover:transform hover:scale-150`}
                            title={`${data.date}: ${data.count} submission${data.count !== 1 ? 's' : ''}`}
                        ></div>
                    ) : (
                        <div key={dayIndex} className="w-3 h-3 rounded-sm bg-[#161617]"></div>
                    );
                })}
            </div>
        ));
    }, [activityData, getCellColor]);
    
    const goToPage = useCallback((pageNumber: number): void => {
        setCurrentPage(pageNumber);
    }, []);
    
    const goToPrevPage = useCallback((): void => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    }, [currentPage]);
    
    const goToNextPage = useCallback((): void => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }, [currentPage, totalPages]);

    if (isLoading) return <Loading />;
    if (error || !profile) return <NotFound />;

    return (
        <div className="min-h-screen w-full p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-[#1e1e1f] p-6 rounded-xl shadow-lg mb-8">
                    <div className="relative group">
                        <img
                            src={profile.profile_picture || '/default-avatar.png'}
                            alt={`${profile.username}'s avatar`}
                            className="h-32 w-32 rounded-full border-4 border-[#3fcf8f] object-cover shadow-xl transition-all duration-200 group-hover:scale-105"
                        />
                        <span className="absolute bottom-2 right-2 bg-[#3fcf8f] rounded-full w-5 h-5 border-2 border-[#161617] shadow"></span>
                    </div>
                    
                    <div className="flex-grow text-center md:text-left">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="text-3xl font-extrabold text-[#3fcf8f] drop-shadow">{profile.full_name || profile.username}</h2>
                            {profile.role && (
                                <span className="text-xs bg-[#161617] text-[#3fcf8f] px-2 py-0.5 rounded-full border border-[#3fcf8f]/30 uppercase">
                                    {profile.role === 'admin' ? 'Admin' : 'User'}
                                </span>
                            )}
                        </div>
                        <div className="text-[#3fcf8f] text-base mb-2 font-mono">@{profile.username}</div>
                        <div className="text-white opacity-80 mb-3 italic max-w-sm">{profile.bio || "No bio yet."}</div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                            {profile.prg_languages?.map((lang: string, idx: number) => (
                                <span key={idx} className="text-sm bg-[#161617] text-[#3fcf8f] px-3 py-1 rounded-full">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="md:text-right space-y-1">
                        {profile.email && (
                            <div className="text-sm text-white opacity-70">{profile.email}</div>
                        )}
                        
                        {profile.githubAccount && (
                            <div className="text-sm text-white opacity-70 flex items-center justify-end gap-1.5">
                                <Github size={16} />
                                <a 
                                    href={`https://github.com/${profile.githubAccount}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-[#3fcf8f] transition-colors"
                                >
                                    {profile.githubAccount}
                                </a>
                            </div>
                        )}
                        
                        {profile.discordAccount && (
                            <div className="text-sm text-white opacity-70 flex items-center justify-end gap-1.5">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 127.14 96.36" 
                                    fill="#3fcf8f" 
                                >
                                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                                </svg>
                                <span className="hover:text-[#3fcf8f] transition-colors">
                                    {profile.discordAccount}
                                </span>
                            </div>
                        )}
                        
                        {profile.submissions && profile.submissions.length > 0 && (
                            <div className="text-sm bg-[#161617] text-white inline-block px-3 py-1 rounded-md mt-1">
                                Total submissions: {profile.submissions.length}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="w-[100%] bg-[#1e1e1f] rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-2xl font-bold text-[#3fcf8f] mb-5 border-b border-[#3fcf8f] pb-2">
                        Coding activity
                    </h3>
                    
                    <div className="overflow-x-auto w-[880px]">
                        <div className="mb-4 relative min-w-max">
                            <div className="flex justify-between text-xs text-white opacity-60 mb-1 pl-8 pr-2">
                                {monthLabels.map((month, index) => (
                                    <div key={index}>{month}</div>
                                ))}
                            </div>
                            
                            <div className="flex">
                                <div className="flex flex-col justify-between h-[104px] mr-2 text-xs text-white opacity-60">
                                    <span>Sun</span>
                                    <span>Tue</span>
                                    <span>Thu</span>
                                    <span>Sat</span>
                                </div>
                                
                                <div className="grid grid-flow-col gap-1">
                                    {contributionGrid}
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end mt-2 text-xs text-white opacity-60">
                                <span className="mr-2">Less</span>
                                <div className="w-3 h-3 rounded-sm bg-[#161617] mr-1"></div>
                                <div className="w-3 h-3 rounded-sm bg-[#3fcf8f]/30 mr-1"></div>
                                <div className="w-3 h-3 rounded-sm bg-[#3fcf8f]/60 mr-1"></div>
                                <div className="w-3 h-3 rounded-sm bg-[#3fcf8f] mr-2"></div>
                                <span>More</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-full bg-[#1e1e1f] rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-2xl font-bold text-[#3fcf8f] mb-5 border-b border-[#3fcf8f] pb-2">
                        Recent submissions
                    </h3>
                    
                    {profile.submissions && profile.submissions.length > 0 ? (
                        <>
                            <div className="overflow-x-auto rounded-lg border border-gray-700">
                                <table className="w-full text-sm">
                                    <thead className="bg-secondary/80 text-gray-300 border-b border-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Challenge</th>
                                            <th className="px-4 py-3 text-left font-medium">Date</th>
                                            <th className="px-4 py-3 text-center font-medium">Score</th>
                                            <th className="px-4 py-3 text-right font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {currentSubmissions.map((submission: Submission, index: number) => (
                                            <tr key={`${submission.id || index}`} className="hover:bg-[#161617] transition-colors">
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center">
                                                        <div className={`w-2 h-2 rounded-full ml-2 ${
                                                            submission.status === "ACCEPTED" ? "bg-[#3fcf8f]" : 
                                                            submission.status === "FAILED" ? "bg-red-500" : 
                                                            "bg-yellow-500"
                                                        }`}></div>
                                                        <Link href={`/challenges/${submission.challenge}`} className='font-medium text-white hover:text-[#3fcf8f] ml-2'>
                                                            {submission.challenge}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="py-3 pr-4 text-sm text-white opacity-60">
                                                    {new Date(submission.timestamp || submission.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 pr-4 text-center">
                                                    <span className="font-mono text-[#3fcf8f] font-medium">
                                                        {submission.score}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span className={`text-xs inline-block px-2 py-1 rounded-full font-medium ${
                                                        submission.status === "ACCEPTED" ? "bg-[#3fcf8f]/20 text-[#3fcf8f]" :
                                                        submission.status === "FAILED" ? "bg-red-500/20 text-red-400" :
                                                        "bg-yellow-500/20 text-yellow-400"
                                                    }`}>
                                                        {submission.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 mt-6">
                                    <button 
                                        onClick={goToPrevPage} 
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-md flex items-center border ${currentPage === 1 
                                            ? 'border-gray-700 bg-secondary/40 text-gray-500 cursor-not-allowed' 
                                            : 'border-gray-700 bg-secondary hover:border-accent transition-colors text-white'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                            <path d="m15 18-6-6 6-6"/>
                                        </svg>
                                        Prev
                                    </button>
                                    
                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }).map((_, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => goToPage(index + 1)}
                                                className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
                                                    currentPage === index + 1
                                                        ? 'bg-accent text-white font-medium shadow-md'
                                                        : 'bg-secondary border border-gray-700 text-white hover:border-accent'
                                                }`}
                                                aria-label={`Go to page ${index + 1}`}
                                                aria-current={currentPage === index + 1 ? 'page' : undefined}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        onClick={goToNextPage} 
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-md flex items-center border ${currentPage === totalPages 
                                            ? 'border-gray-700 bg-secondary/40 text-gray-500 cursor-not-allowed' 
                                            : 'border-gray-700 bg-secondary hover:border-accent transition-colors text-white'}`}
                                    >
                                        Next
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                                            <path d="m9 18 6-6-6-6"/>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-secondary/20 rounded-lg p-8 text-center border border-gray-700">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/50 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium mb-1">No submissions yet</h3>
                            <p className="text-white/60">Complete challenges to see your submissions history here.</p>
                        </div>  
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;