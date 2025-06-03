"use client";
import { Loading } from "@/components/Loading";
import { Trophy, Medal, User as UserIcon } from "lucide-react";
import { useLeaderboard, LeaderboardUser } from "@/utils/queries/leaderboard/leaderboard";
import { useState } from "react";

const LeaderboardPage = () => {
  const [sortBy, setSortBy] = useState<keyof LeaderboardUser>("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { data: users = [], isLoading } = useLeaderboard(sortBy, sortOrder);

  const handleSort = (column: keyof LeaderboardUser) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const topThreeUsers = users.slice(0, 3);
  const remainingUsers = users.slice(3);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">Leaderboard</h1>

      {isLoading ? (
        <div className="flex justify-center mt-16">
          <Loading />
        </div>
      ) : (
        <>
          {topThreeUsers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {topThreeUsers.map((user, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-6 border ${getPositionColor(index)} shadow-lg transform hover:scale-105 transition-all duration-300`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      {getTrophyIcon(index)}
                    </div>
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-primary mb-4 flex items-center justify-center">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
                      ) : (
                        <UserIcon size={40} className="text-gray-400" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{user.username}</h3>
                    <div className="text-4xl font-bold text-accent mb-2">
                      {user.score}
                      <span className="text-sm text-gray-400 ml-1">pts</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm">
                      <div>
                        <div className="text-gray-400">Solved</div>
                        <div className="font-medium">{user.solvedProblems}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Accuracy</div>
                        <div className="font-medium">{user.acceptanceRate}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
                    Solved problems {sortBy === "solvedProblems" && (sortOrder === "desc" ? "▼" : "▲")}
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
                    Acceptance rate {sortBy === "acceptanceRate" && (sortOrder === "desc" ? "▼" : "▲")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {remainingUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-primary/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-white">
                          {index + 4}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-primary flex-shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <UserIcon size={14} className="text-gray-400" />
                            </div>
                          )}
                        </div>
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
        </>
      )}
    </div>
  );
};

const getTrophyIcon = (position: number) => {
  switch (position) {
    case 0:
      return <Trophy size={36} className="text-yellow-500" />;
    case 1:
      return <Medal size={32} className="text-gray-300" />;
    case 2:
      return <Medal size={28} className="text-amber-600" />;
    default:
      return null;
  }
};

const getPositionColor = (position: number) => {
  switch (position) {
    case 0:
      return "bg-gradient-to-br from-yellow-500/30 to-amber-600/30 border-yellow-500";
    case 1:
      return "bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-gray-400";
    case 2:
      return "bg-gradient-to-br from-amber-600/20 to-amber-700/20 border-amber-600";
    default:
      return "bg-secondary";
  }
};

export default LeaderboardPage;