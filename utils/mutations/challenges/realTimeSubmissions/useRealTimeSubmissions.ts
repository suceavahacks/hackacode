import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

function useAllUserSubmissionsRealtime(onUpdate: (payload: any, userId: string) => void) {
  const supabase = createClient();

  useEffect(() => {
    interface UserUpdatePayload {
      new: any;
      [key: string]: any;
    }

    const channel = supabase
      .channel("all-user-submissions")
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
        },
        (payload: UserUpdatePayload) => {
          onUpdate(payload.new?.submissions, payload.new?.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
}

export default useAllUserSubmissionsRealtime;