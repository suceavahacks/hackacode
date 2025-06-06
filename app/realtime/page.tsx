"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAllUserSubmissionsRealtime from "@/utils/realTimeSubmissions/useRealTimeSubmissions";
import { createClient } from "@/utils/supabase/client";

type Submission = {
  id: string;
  challenge: string;
  timestamp: string;
  status: string;
  score: number;
};

type UserSubmissions = {
  userId: string;
  submissions: Submission[];
};

export default function RealtimeSubmissionsPage() {
  const [allSubs, setAllSubs] = useState<UserSubmissions[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("users")
      .select("slug, submissions")
      .then(({ data }) => {
        if (data) {
          setAllSubs(
            data.map((u: any) => ({
              userId: u.slug,
              submissions: u.submissions || [],
            }))
          );
        }
      });
  }, []);

  const handleUpdate = (submissions: Submission[], userId: string) => {
    setAllSubs((prev) => {
      const filtered = prev.filter((u) => u.userId !== userId);
      return [...filtered, { userId, submissions }];
    });
  };

  useAllUserSubmissionsRealtime(handleUpdate);

  const now = Date.now();
  const last24hSubs = allSubs
    .flatMap((u) =>
      (u.submissions || []).map((s) => ({
        ...s,
        userId: u.userId,
      }))
    )
    .filter((s) => now - new Date(s.timestamp).getTime() <= 24 * 60 * 60 * 1000)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="min-h-screen w-full bg-primary flex flex-col">
      <div className="flex-1 flex flex-col ml-20 max-md:ml-2 mr-20 max-md:mr-2">
        <div className="max-w-4xl w-full mx-auto mt-10 p-6 bg-secondary rounded shadow">
          <h1 className="text-2xl font-bold mb-6 color">Live submissions (last 24h)</h1>
          <table className="w-full text-sm border mb-4">
            <thead>
              <tr className="bg-primary">
                <th className="border px-2 py-1">User</th>
                <th className="border px-2 py-1">Challenge</th>
                <th className="border px-2 py-1">Score</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">Time</th>
              </tr>
            </thead>
            <tbody>
              {last24hSubs.map((sub) => (
                <tr
                  key={sub.id}
                  className={
                    sub.status === "ACCEPTED"
                      ? "bg-green-500/20"
                      : "bg-red-500/20"
                  }
                >
                  <td className="border px-2 py-1 font-mono text-gray-300">{sub.userId}</td>
                  <td className="border px-2 py-1 color">
                    <Link
                      href={`/problems/${sub.challenge}`}
                      className="transition hover:underline hover:decoration-wavy"
                    >
                      {sub.challenge}
                    </Link>
                  </td>
                  <td className="border px-2 py-1 color">{sub.score}</td>
                  <td className="border px-2 py-1">
                    <b
                      className={
                        sub.status === "ACCEPTED"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {sub.status}
                    </b>
                  </td>
                  <td className="border px-2 py-1" title={new Date(sub.timestamp).toLocaleString()}>
                    {new Date(sub.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
              {last24hSubs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No submissions in the last 24 hours.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}