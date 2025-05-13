"use client";
import { Loading } from "@/components/Loading";
import { useUser } from "@/utils/queries/user/getUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const { user, loading, error } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (user && mounted) {
      router.push("/app");
    }
  }, [user, router, mounted]);

  if (!mounted || loading) {
    return <Loading />;
  }

  return null;
}
