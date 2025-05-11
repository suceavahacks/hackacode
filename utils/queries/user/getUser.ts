import { useQuery } from "@tanstack/react-query";

const fetchUser = async (): Promise<any> => {
  if (typeof window === "undefined") {
    throw new Error("localStorage is not available on the server");
  }

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
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { user, loading: isLoading, error: isError ? error : null };
};