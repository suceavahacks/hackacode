"use client";
import { useParams } from 'next/navigation';
import { useProfile } from '@/utils/queries/profile/getProfile';
import { Loading } from '@/components/Loading';
import NotFound from '@/app/not-found';

interface Submission {
    id: string;
    title?: string;
    problem_title?: string;
    timestamp: string;
    status: 'ACCEPTED' | 'FAILED';
}

export const Profile = () => {
    const params = useParams();
    const username = params.username as string;
    const { data: profile, isLoading, error } = useProfile(username);

    if (isLoading) return <Loading />;
    if (error || !profile) return <NotFound />;

    return (
        <div className="min-h-screen w-full p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center md:items-start md:w-1/3">
                        <div className="relative mb-6 group">
                            <img
                                src={profile.profile_picture || '/default-avatar.png'}
                                alt={`${profile.username}'s avatar`}
                                className="h-40 w-40 rounded-full border-4 border-[#3fcf8f] object-cover shadow-xl transition-all duration-200 group-hover:scale-105"
                            />
                            <span className="absolute bottom-2 right-2 bg-[#3fcf8f] rounded-full w-6 h-6 border-2 border-[#161617] shadow"></span>
                        </div>
                        <h2 className="text-4xl font-extrabold mb-2 text-[#3fcf8f] drop-shadow text-center md:text-left">{profile.full_name || profile.username}</h2>
                        <div className="text-[#3fcf8f] text-lg mb-3 font-mono">@{profile.username}</div>
                        <div className="text-white text-center md:text-left mb-6 italic max-w-sm">{profile.bio || "No bio yet."}</div>
                        
                        <div className="w-full flex flex-col gap-4 text-base bg-[#1e1e1f] rounded-xl p-5 shadow-md">
                            {profile.show_linked_email && (
                                <div className="flex justify-between">
                                    <span className="text-white opacity-60">Email:</span>
                                    <span className="text-white font-medium">{profile.email}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-white opacity-60">Role:</span>
                                <span className="text-white font-medium capitalize">{profile.role || "user"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white opacity-60">Slug:</span>
                                <span className="text-white font-medium">{profile.slug}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white opacity-60">Languages:</span>
                                <span className="text-white font-medium">{profile.prg_languages?.length ? profile.prg_languages.join(", ") : "—"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-2/3 mt-6 md:mt-0">
                        <h3 className="text-2xl font-bold text-[#3fcf8f] mb-5 border-b border-[#3fcf8f] pb-2">Submissions</h3>
                        
                        {profile.submissions && profile.submissions.length > 0 ? (
                            <ul className="divide-y divide-[#161617] bg-[#1e1e1f] rounded-xl shadow-lg overflow-hidden">
                                {profile.submissions.slice(0, 5).map((submission: Submission, index: number) => (
                                    <li key={index} className="p-5 hover:bg-[#161617] transition-colors">
                                        <span className="font-semibold text-white block mb-2">{submission.title || submission.problem_title}</span>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-white opacity-60">{new Date(submission.timestamp).toLocaleString()}</span>
                                            <span className={`text-sm px-4 py-1 rounded-full font-medium ${
                                                submission.status === "ACCEPTED" ? "bg-[#3fcf8f] text-black" : 
                                                submission.status === "FAILED" ? "bg-red-500 text-white" : 
                                                "bg-yellow-500 text-black"
                                            }`}>
                                                {submission.status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center text-white bg-[#1e1e1f] p-10 rounded-xl">
                                No submissions found.
                            </div>
                        )}

                        {profile.submissions && profile.submissions.length > 5 && (
                            <div className="mt-6 flex justify-center">
                                <button className="bg-[#1e1e1f] hover:bg-[#161617] text-white py-2 px-6 rounded-md border border-[#3fcf8f]">
                                    View all submissions
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;