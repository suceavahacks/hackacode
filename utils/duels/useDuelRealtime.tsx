import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

function useDuelRealtime(duelId: string | null, onUpdate: (payload: any) => void) {
  const supabase = createClient();
  
  useEffect(() => {
    if (!duelId) return;
    
    interface DuelUpdatePayload {
        new: any; 
        [key: string]: any;
    }

    const channel = supabase
        .channel(`duel-${duelId}`)
        .on(
            'postgres_changes',
            { 
                event: 'UPDATE', 
                schema: 'public', 
                table: 'duels', 
                filter: `id=eq.${duelId}` 
            },
            (payload: DuelUpdatePayload) => {
                onUpdate(payload.new);
            }
        )
        .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };

  }, [duelId, supabase]);
}

export default useDuelRealtime;