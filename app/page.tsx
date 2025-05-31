"use client";

import { useUser } from "@/utils/queries/user/getUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const { user, loading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/app");
    }
  }, [user, router]);
}
