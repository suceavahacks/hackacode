export const onSubmit = async (
  data: {
    email: string;
    password: string;
  },
  setLoading: (value: boolean) => void,
  setError: (value: string | null) => void
) => {
  setLoading(true);
  setError(null);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    localStorage.setItem("access_token", result.session.access_token);
    localStorage.setItem("refresh_token", result.session.refresh_token);
    localStorage.setItem("expires_at", result.session.expires_at);
  } catch (error) {
    setError(error instanceof Error ? error.message : "Something went wrong");
    setTimeout(() => {
      setError(null);
    }, 3000);
  } finally {
    setLoading(false);
  }
};