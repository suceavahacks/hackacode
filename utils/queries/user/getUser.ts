import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const fetchUser = async (): Promise<any> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  return res.json();
};

export const useUser = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: isMounted,
  });

  if (!isMounted) {
    return { user: null, loading: true, error: null };
  }

  return { user, loading: isLoading, error: isError ? error : null };
};