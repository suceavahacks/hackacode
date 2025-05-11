export const onSubmit = async (data: {
    email: string;
    password: string;
}, setLoading: (value: boolean) => void, setError: (value: string | null) => void, setSuccess: (value: boolean) => void) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });

        const result = await res.json();
        console.log(result);

        if (!result.user.user_metadata.email_verified) {
            setError("Please verify your email before signing in. We do not want to have any bots in our system.");
            setTimeout(() => {
                setError(null);
            }, 3000);
            return;
        } else {
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        }

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
}