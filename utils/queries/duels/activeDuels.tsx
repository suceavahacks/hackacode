import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface Duel {
  id: string;
  user1_id: string;
  user2_id: string;
  status: string;
  started_at: string;
  challenges_slug?: string[];
}

export const useActiveDuels = (userId: string) => {
  return useQuery<Duel[]>({
    queryKey: ['activeDuels', userId],
    queryFn: async () => {
      const supabase = createClient();
      const { data: duels1, error: error1 } = await supabase
        .from("duels")
        .select("*")
        .eq("status", "active")
        .eq("user1_id", userId);

      const { data: duels2, error: error2 } = await supabase
        .from("duels")
        .select("*")
        .eq("status", "active")
        .eq("user2_id", userId);

      if (error1 && error2) throw new Error(error1.message || error2.message);

      return [...(duels1 || []), ...(duels2 || [])];
    },
    enabled: !!userId,
  });
};