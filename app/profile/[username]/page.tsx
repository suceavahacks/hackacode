"use client";
import { useParams } from 'next/navigation';
import { useProfile } from '@/utils/queries/profile/getProfile';
import { Loading } from '@/components/Loading';
import NotFound from '@/app/not-found';
import { useState } from 'react';
import Link from 'next/link';

interface Submission {
    id: string;
    title?: string;
    challenge?: string;
    problem_title?: string;
    timestamp: string;
    created_at: string;
    status: 'ACCEPTED' | 'FAILED';
    score: number;
}

interface ProfileUser {
    username: string;
    full_name?: string;
    email?: string;
    bio?: string;
    profile_picture?: string;
    role?: string;
    slug: string;
    show_linked_email?: boolean;
    prg_languages?: string[];
    submissions?: Submission[];
}

export const Profile = () => {
    const params = useParams();
    const username = params.username as string;
    const { data: profile, isLoading, error } = useProfile(username);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const submissionsPerPage: number = 5;

    if (isLoading) return <Loading />;
    if (error || !profile) return <NotFound />;

    const indexOfLastSubmission: number = currentPage * submissionsPerPage;
    const indexOfFirstSubmission: number = indexOfLastSubmission - submissionsPerPage;
    const currentSubmissions: Submission[] = profile.submissions?.slice(indexOfFirstSubmission, indexOfLastSubmission) || [];
    const totalPages: number = profile.submissions ? Math.ceil(profile.submissions.length / submissionsPerPage) : 0;

    const goToPage = (pageNumber: number): void => {
        setCurrentPage(pageNumber);
    };

    const goToPrevPage = (): void => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = (): void => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

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
                        <h2 className="text-3xl font-extrabold mb-1 text-[#3fcf8f] drop-shadow">{profile.full_name || profile.username}</h2>
                        <div className="text-[#3fcf8f] text-base mb-2 font-mono">@{profile.username}</div>
                        <div className="text-white opacity-80 mb-3 italic max-w-sm">{profile.bio || "No bio yet."}</div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                            {profile.role && (
                                <span className="text-sm bg-[#161617] text-white px-3 py-1 rounded-full">
                                    {profile.role}
                                </span>
                            )}
                            {profile.prg_languages?.map((lang: string, idx: number) => (
                                <span key={idx} className="text-sm bg-[#161617] text-[#3fcf8f] px-3 py-1 rounded-full">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="md:text-right space-y-1">
                        {profile.show_linked_email && profile.email && (
                            <div className="text-sm text-white opacity-70">{profile.email}</div>
                        )}
                        <div className="text-sm text-white opacity-70">Slug: {profile.slug}</div>
                        {profile.submissions && profile.submissions.length > 0 && (
                            <div className="text-sm bg-[#161617] text-white inline-block px-3 py-1 rounded-md mt-1">
                                Total submissions: {profile.submissions.length}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="w-full bg-[#1e1e1f] rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-2xl font-bold text-[#3fcf8f] mb-5 border-b border-[#3fcf8f] pb-2">
                        Recent Submissions
                    </h3>
                    
                    {profile.submissions && profile.submissions.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-[#161617]">
                                            <th className="pb-2 text-white opacity-80 font-medium">Challenge</th>
                                            <th className="pb-2 text-white opacity-80 font-medium">Date</th>
                                            <th className="pb-2 text-white opacity-80 font-medium text-center">Score</th>
                                            <th className="pb-2 text-white opacity-80 font-medium text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentSubmissions.map((submission: Submission, index: number) => (
                                            <tr key={`${submission.id || index}`} className="hover:bg-[#161617] transition-colors">
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center">
                                                        <div className={`w-2 h-2 rounded-full mr-2 ${
                                                            submission.status === "ACCEPTED" ? "bg-[#3fcf8f]" : 
                                                            submission.status === "FAILED" ? "bg-red-500" : 
                                                            "bg-yellow-500"
                                                        }`}></div>
                                                        <Link href={`/challenges/${submission.challenge}`} className='font-medium text-white hover:text-[#3fcf8f]'>
                                                            {submission.challenge || submission.title || submission.problem_title}
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
                                <div className="flex justify-center items-center gap-2 mt-6">
                                    <button 
                                        onClick={goToPrevPage} 
                                        disabled={currentPage === 1}
                                        className={`px-3 py-2 rounded-md ${currentPage === 1 
                                            ? 'bg-[#161617] text-gray-500 cursor-not-allowed' 
                                            : 'bg-[#161617] hover:bg-[#0f0f0f] text-white'}`}
                                    >
                                        ← Prev
                                    </button>
                                    
                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }).map((_, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => goToPage(index + 1)}
                                                className={`w-10 h-10 rounded-md ${
                                                    currentPage === index + 1
                                                        ? 'bg-[#3fcf8f] text-black font-bold'
                                                        : 'bg-[#161617] text-white hover:bg-[#0f0f0f]'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        onClick={goToNextPage} 
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-2 rounded-md ${currentPage === totalPages 
                                            ? 'bg-[#161617] text-gray-500 cursor-not-allowed' 
                                            : 'bg-[#161617] hover:bg-[#0f0f0f] text-white'}`}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-white p-8">
                            No submissions found.
                        </div>  
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;