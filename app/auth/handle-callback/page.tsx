"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/components/Loading";

export default function HandleCallback() {
  const router = useRouter();

  useEffect(() => {
    if (!window.location.hash) {
      router.push("/signin");
      return;
    }

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");
    const expires_at = hashParams.get("expires_at");
    
    if (!access_token) {
      router.push("/signin");
      return;
    }
    
    localStorage.setItem("access_token", access_token);
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
    if (expires_at) localStorage.setItem("expires_at", expires_at);

    router.push("/app");

  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <Loading />
    </div>
  );
}