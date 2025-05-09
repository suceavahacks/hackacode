"use client"

import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useState } from "react";


const SignIn = () => {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState<string>("");

    const schema = z.object({
        email: z.string().email(),
        password: z.string().nonempty("Password is required")
            .min(8, "Password must be at least 8 characters long")
    });

    type FormData = z.infer<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch("https://api-dev.hackacode.xyz/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                credentials: "include"
            });

            const result = await res.json();
            if(!res.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            localStorage.setItem("access_token", result.session.access_token);
            localStorage.setItem("refresh_token", result.session.refresh_token);
            localStorage.setItem("expires_at", result.session.expires_at);

            if (!res.ok) {
                throw new Error(result.message || "Something went wrong");
            }

        } catch (error) {
            setError(error instanceof Error ? error.message : "Something went wrong");
            setTimeout(() => {
                setError(null);
            }, 3000);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-screen flex flex-col items-center justify-center gap-10 h-screen p-5">
            <div className="flex flex-col">
                <h1 className="text-7xl font-extrabold text-center">Welcome to <span style={{
                    color: '#FF865B',
                    textDecoration: 'underline',
                    textDecorationColor: '#FF865B',
                    textDecorationThickness: '2px',
                    textUnderlineOffset: '4px',
                    textDecorationStyle: 'wavy'
                }}>Hackacode</span>!</h1>
                <p className="text-2xl opacity-60 text-center">The best place to learn and practice coding with your friends.</p>
            </div>
            <div className="flex gap-10 max-md:flex-col items-center justify-center mb-20">
                <form>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-xl">What is your email?</legend>
                        <input
                            type="email"
                            placeholder="email@hackclub.app"
                            className="input input-lg w-[400px]"
                            {...register("email")}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </fieldset>
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-xl">What is your password?</legend>
                        <input
                            type="password"
                            placeholder="mySuperSecretPassword"
                            className="input input-lg w-[400px]"
                            {...register("password")}
                        />
                    </fieldset>

                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    <button
                        type="submit"
                        className="bg-[#FF865B] text-white w-full rounded-lg p-2 mt-5 hover:opacity-75 transition-all duration-200 ease-in-out"
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Sign Up"}
                    </button>
                    {error && <div className="toast">
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    </div>}
                </form>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-waypoints my-auto"><circle cx="12" cy="4.5" r="2.5"></circle><path d="m10.2 6.3-3.9 3.9"></path><circle cx="4.5" cy="12" r="2.5"></circle><path d="M7 12h10"></path><circle cx="19.5" cy="12" r="2.5"></circle><path d="m13.8 17.7 3.9-3.9"></path><circle cx="12" cy="19.5" r="2.5"></circle></svg>

                <div className="flex flex-col gap-4 justify-center mt-10 max-md:mt-0">
                    <button className="btn btn-lg bg-white text-black border-[#e5e5e5] w-[400px]">
                        <svg aria-label="Google logo" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Login with Google
                    </button>
                    <button className="btn btn-lg bg-[#622069] text-white border-[#591660]">
                        <svg aria-label="Slack logo" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g strokeLinecap="round" strokeWidth="78"><path stroke="#36c5f0" d="m110 207h97m0-97h.1v-.1"></path><path stroke="#2eb67d" d="m305 110v97m97 0v.1h.1"></path><path stroke="#ecb22e" d="m402 305h-97m0 97h-.1v.1"></path><path stroke="#e01e5a" d="M110 305h.1v.1m97 0v97"></path></g></svg>
                        Login with Slack
                    </button>
                    <button className="btn btn-lg bg-black text-white border-black">
                        <svg aria-label="GitHub logo" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"></path></svg>
                        Login with GitHub
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignIn;