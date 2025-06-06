"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/utils/queries/user/getUser";
import { Loading } from "@/components/Loading";
import NotFound from "@/app/not-found";
import { useEffect, useState } from "react";

const Submission = () => {
    const { id } = useParams();
    const { user, loading } = useUser();
    const [submission, setSubmission] = useState<any>(null);

    useEffect(() => {
        if (!user) return;
        const submissions = user.submissions || [];
        const found = submissions.find((sub: any) => sub.id === id);
        setSubmission(found || null);
    }, [user, id]);

    if (loading) return <Loading />;
    if (!user || !submission) return <NotFound />;

    const { code, language, challenge, timestamp, status, score, result } = submission;

    return (
        <div className="min-h-screen w-full bg-primary flex flex-col">
            <div className="flex-1 flex flex-col ml-20 max-md:ml-2 mr-20 max-md:mr-2">
                <div className="max-w-4xl w-full mx-auto mt-10 p-6 bg-secondary rounded shadow">
                    <h1 className="text-2xl font-bold mb-2">
                        Submission for <span className="color">{challenge}</span>
                    </h1>
                    <div className="mb-4 text-gray-300 text-sm">
                        <span className="mr-4">
                            Language: <b className="color">{language}</b>
                        </span>
                        <span className="mr-4">
                            Status:{" "}
                            <b className={status === "ACCEPTED" ? "text-green-400" : "text-red-400"}>
                                {status}
                            </b>
                        </span>
                        <span className="mr-4">
                            Score: <b className="color">{score}</b>
                        </span>
                        <span>
                            Submitted at: <b>{new Date(timestamp).toLocaleString()}</b>
                        </span>
                    </div>
                    {status === "comp-failed" && result?.message && (
                        <pre className="mb-4 p-3 rounded bg-red-900/60 text-red-200 font-mono overflow-x-auto">
                            {result.message}
                        </pre>
                    )}
                    <div className="mb-6">
                        <h2 className="font-semibold mb-1 text-gray-200">Code:</h2>
                        <pre
                            className="bg-primary rounded p-3 overflow-x-auto text-sm text-gray-100"
                        >
                            {code}
                        </pre>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-2 text-gray-200">Test case results:</h2>
                        <table className="w-full text-sm border">
                            <thead>
                                <tr className="bg-primary">
                                    <th className="border px-2 py-1">#</th>
                                    <th className="border px-2 py-1">Time</th>
                                    <th className="border px-2 py-1">Memory</th>
                                    <th className="border px-2 py-1">Stdin</th>
                                    <th className="border px-2 py-1">Stdout</th>
                                    <th className="border px-2 py-1">Stderr</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result?.results?.map((res: any, idx: number) => (
                                    <tr key={idx} className={res.Passed ? "bg-green-500/20" : "bg-red-500/20"}>
                                        <td className="border px-2 py-1">{idx + 1}</td>
                                        <td className="border px-2 py-1">{res.Time}s</td>
                                        <td className="border px-2 py-1">{res.Memory} KB</td>
                                        <td className="border px-2 py-1 whitespace-pre">{res.Stdin ?? ""}</td>
                                        <td className="border px-2 py-1 whitespace-pre">{res.Stdout}</td>
                                        <td className="border px-2 py-1 whitespace-pre text-red-600">{res.Stderr}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Submission;