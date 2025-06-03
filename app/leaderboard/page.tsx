"use client"
import { Loading } from "@/components/Loading";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface User {
  username: string;
  submissions: any[];
}

interface LeaderboardUser {
  username: string;
  solvedProblems: number;
  totalSubmissions: number;
  acceptanceRate: number;
  score: number;
}

const LeaderboardPage = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("solvedProblems");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const supabase = createClient();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("username, submissions");

      if (error) {
        setLoading(false);
        return;
      }

      const leaderboardData = data.map((user: User) => {
        const submissions = user.submissions || [];
        const uniqueAcceptedChallenges = new Map();
        
        submissions.forEach(sub => {
          const isAccepted = sub.status === "ACCEPTED" || sub.result?.status === "ACCEPTED";
          const challenge = sub.challenge;
          const score = sub.score || sub.result?.score || 0;
          
          if (isAccepted && challenge) {
            if (!uniqueAcceptedChallenges.has(challenge) || score > uniqueAcceptedChallenges.get(challenge)) {
              uniqueAcceptedChallenges.set(challenge, score);
            }
          }
        });
        
        let totalScore = 0;
        uniqueAcceptedChallenges.forEach((score) => {
          totalScore += score;
        });
        
        const acceptanceRate = submissions.length > 0
          ? Math.round((uniqueAcceptedChallenges.size / submissions.length) * 100)
          : 0;

        return {
          username: user.username,
          solvedProblems: uniqueAcceptedChallenges.size,
          totalSubmissions: submissions.length,
          acceptanceRate,
          score: totalScore
        };
      });

      leaderboardData.sort((a, b) => {
        if (sortOrder === "desc") {
          return Number(b[sortBy as keyof LeaderboardUser]) - Number(a[sortBy as keyof LeaderboardUser]);
        } else {
          return Number(a[sortBy as keyof LeaderboardUser]) - Number(b[sortBy as keyof LeaderboardUser]);
        }
      });

      setUsers(leaderboardData);
      setLoading(false);
    };

    fetchUsers();
  }, [sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Leaderboard</h1>
      
      {loading ? (
        <div className="flex justify-center mt-16">
          <Loading />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-secondary rounded-lg overflow-hidden">
            <thead className="bg-primary/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("solvedProblems")}
                >
                  Solved Problems {sortBy === "solvedProblems" && (sortOrder === "desc" ? "▼" : "▲")}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("score")}
                >
                  Score {sortBy === "score" && (sortOrder === "desc" ? "▼" : "▲")}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("acceptanceRate")}
                >
                  Acceptance Rate {sortBy === "acceptanceRate" && (sortOrder === "desc" ? "▼" : "▲")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-primary/20">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-white">
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{user.solvedProblems}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-accent font-bold">{user.score}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{user.acceptanceRate}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;