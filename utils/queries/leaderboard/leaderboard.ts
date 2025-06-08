import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface LeaderboardUser {
  username: string;
  avatar_url?: string;
  solvedProblems: number;
  totalSubmissions: number;
  acceptanceRate: number;
  score: number;
}

export const useLeaderboard = (sortBy: keyof LeaderboardUser = "score", sortOrder: "asc" | "desc" = "desc") => {
  return useQuery<LeaderboardUser[]>({
    queryKey: ['leaderboard', sortBy, sortOrder],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("username, profile_picture, submissions");

      if (error) throw new Error(error.message);

      const leaderboardData: LeaderboardUser[] = (data || []).map((user: any) => {
        const submissions = user.submissions || [];
        const uniqueAcceptedChallenges = new Map();

        submissions.forEach((sub: any) => {
          const isAccepted = sub.status === "ACCEPTED";
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
          avatar_url: user.profile_picture,
          solvedProblems: uniqueAcceptedChallenges.size,
          totalSubmissions: submissions.length,
          acceptanceRate,
          score: totalScore,
        };
      });

      leaderboardData.sort((a, b) => {
        if (sortOrder === "desc") {
          return Number(b[sortBy]) - Number(a[sortBy]);
        } else {
          return Number(a[sortBy]) - Number(b[sortBy]);
        }
      });

      return leaderboardData;
    }
  });
};