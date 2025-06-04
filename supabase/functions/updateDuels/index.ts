/// <reference lib="deno.ns" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.3";

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase
      .from("duels")
      .update({ status: "completed" })
      .lt("ended_at", new Date().toISOString());

    if (error) {
      console.error("Supabase error:", error.message);
      return new Response("Update failed", { status: 500 });
    }

    console.log("Update successful");
    return new Response("Success", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return new Response("Server error", { status: 500 });
  }
});