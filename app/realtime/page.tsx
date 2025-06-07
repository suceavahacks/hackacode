"use client";

import Link from "next/link";
import useAllUserSubmissionsRealtime from "@/utils/mutations/challenges/realTimeSubmissions/useRealTimeSubmissions";
import { useUser } from "@/utils/queries/user/getUser";
import NotAuth from "@/components/NeedAuth";
import { useSubmissionsQuery, type Submission, type UserSubmissions } from "@/utils/queries/submission/useSubmissionQuery";
import { useQueryClient } from "@tanstack/react-query";

const getMessage = (slug: string, submission: Submission) => {
    const challengeLink = (
        <Link
            href={`/challenges/${submission.challenge}`}
            className="color hover:underline hover:decoration-wavy"
        >
            {submission.challenge}
        </Link>
    );
    switch (submission.status) {
        case "ACCEPTED":
            return (
                <>
                    solved {challengeLink} with a score of {submission.score}
                </>
            );
        case "FAILED":
            return (
                <>
                    failed {challengeLink} with a score of {submission.score}
                </>
            );
        default:
            return (
                <>
                    submitted {challengeLink} with a score of {submission.score || 0}. Status: {submission.status}.
                </>
            );
    }
};

export default function RealtimeSubmissionsPage() {
    const { data: allSubs = [] } = useSubmissionsQuery();
    const { user } = useUser();

    const handleUpdate = (submissions: Submission[], slug: string) => {
        const queryClient = useQueryClient();
        queryClient.setQueryData(['userSubmissions'], (prev: UserSubmissions[] = []) => {
            const filtered = prev.filter((u) => u.slug !== slug);
            return [...filtered, { slug, submissions }];
        });
    };

    useAllUserSubmissionsRealtime(handleUpdate);

    const now = Date.now();
    const last24hSubs = allSubs
        .flatMap((u) =>
            (u.submissions || []).map((s) => ({
                ...s,
                slug: u.slug,
            }))
        )
        .filter((s) => now - new Date(s.timestamp).getTime() <= 24 * 60 * 60 * 1000)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (!user) {
        return <NotAuth />;
    }

    return (
        <div className="min-h-screen w-full bg-primary flex flex-col">
            <div className="flex-1 flex flex-col ml-20 max-md:ml-2 mr-20 max-md:mr-2">
                <div className="max-w-4xl w-full mx-auto mt-10 p-6 bg-secondary rounded shadow">
                    <h1 className="text-2xl font-bold mb-6 color">Live submissions (last 24h)</h1>
                    {last24hSubs.map((sub) => (
                        <div
                            key={sub.id}
                            className="mb-4 p-4 bg-secondary rounded shadow transition-colors flex items-center gap-2"
                        >
                            <li></li>
                            {new Date(sub.timestamp).toLocaleString()}
                            <Link
                                href={`/profile/${sub.slug}`}
                                className="color hover:underline hover:decoration-wavy"
                            >
                                {sub.slug}
                            </Link>
                            {getMessage(sub.slug, sub)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}