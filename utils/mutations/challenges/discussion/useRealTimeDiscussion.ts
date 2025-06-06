import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function useRealTimeDiscussion(slug: string, onNewDiscussion: (discussion: any[]) => void) {
  useEffect(() => {
    if (!slug) return;
    const supabase = createClient();

    const channel = supabase
      .channel(`discussion-${slug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "problems",
          filter: `slug=eq.${slug}`,
        },
        (payload) => {
          const newDiscussion = (payload.new as { discussion?: any })?.discussion;
          if (newDiscussion) {
            onNewDiscussion(newDiscussion);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug, onNewDiscussion]);
}