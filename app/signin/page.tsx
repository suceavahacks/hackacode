"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useUser } from "@/utils/queries/user/getUser.ts";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";
import { onSubmit } from "@/utils/mutations/user/signin";
import { motion } from "framer-motion";
import googleAuth from "@/utils/mutations/user/googleAuth"; 

const SignIn = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user, loading: userLoading, error: userError } = useUser();
    const router = useRouter();

    const schema = z.object({
        email: z.string().email(),
        password: z
            .string()
            .nonempty("Password is required")
    });

    type SignInFormData = z.infer<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (user) {
            router.push("/app");
        }
    }, [user, router]);

    if (userLoading) {
        return <Loading />;
    }

    return !user && (
        <div className="w-screen flex flex-col items-center justify-center gap-10 min-h-screen max-md:mt-40">
            <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-7xl font-extrabold text-center max-md:text-5xl">Welcome to <span className="color" style={{
                    textDecoration: 'underline',
                    textDecorationThickness: '2px',
                    textUnderlineOffset: '4px',
                    textDecorationStyle: 'wavy'
                }}>Hackacode</span>!</h1>
                <p className="text-2xl opacity-60 text-center">The best place to learn and practice coding with your friends.</p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-10 max-md:flex-col items-center justify-center mb-20"
            >
                <form className="max-md:mx-auto flex flex-col justify-center items-center">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-xl">What is your email?</legend>
                        <input
                            type="email"
                            placeholder="email@hackclub.app"
                            className="input input-lg w-[400px] max-md:w-[300px]"
                            {...register("email")}
                        />
                    </fieldset>
                    {errors.email && <p className="text-red-500 text-left mr-auto">{errors.email.message}</p>}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-xl">What is your password?</legend>
                        <input
                            type="password"
                            placeholder="mySuperSecretPassword"
                            className="input input-lg w-[400px] max-md:w-[300px]"
                            {...register("password")}
                        />
                    </fieldset>

                    {errors.password && <p className="text-red-500 text-left mr-auto">{errors.password.message}</p>}
                    <button
                        type="submit"
                        className="btn text-white w-full rounded-lg p-2 mt-5"
                        onClick={handleSubmit((data) => onSubmit(data, setLoading, setError))}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Sign In"}
                    </button>
                    <p className="text-lg text-center mt-5">
                        Don't have an account?{" "}
                        <a href="/signup" className="color font-bold underline decoration-2 underline-offset-4 decoration-wavy">
                            Sign Up
                        </a>
                    </p>
                    {error && <div className="toast">
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    </div>}
                </form>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-waypoints my-auto"><circle cx="12" cy="4.5" r="2.5"></circle><path d="m10.2 6.3-3.9 3.9"></path><circle cx="4.5" cy="12" r="2.5"></circle><path d="M7 12h10"></path><circle cx="19.5" cy="12" r="2.5"></circle><path d="m13.8 17.7 3.9-3.9"></path><circle cx="12" cy="19.5" r="2.5"></circle></svg>

                <div className="flex flex-col gap-4 justify-center mt-10 max-md:mt-0 p-5">
                    <button 
                        className="btn btn-lg text-black w-[400px] max-md:w-[300px]"
                        onClick={async () => {
                            setLoading(true);
                            await googleAuth();
                            setLoading(false);
                        }}
                        disabled={loading}
                    >
                        <svg aria-label="Google logo" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="transparent"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Continue with Google
                    </button>
                    <button className="btn btn-lg bg-[#622069] text-white border-[#591660] w-[400px] max-md:w-[300px]">
                        <svg aria-label="Slack logo" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g strokeLinecap="round" strokeWidth="78"><path stroke="#36c5f0" d="m110 207h97m0-97h.1v-.1"></path><path stroke="#2eb67d" d="m305 110v97m97 0v.1h.1"></path><path stroke="#ecb22e" d="m402 305h-97m0 97h-.1v.1"></path><path stroke="#e01e5a" d="M110 305h.1v.1m97 0v97"></path></g></svg>
                        Continue with Slack
                    </button>
                    <button className="btn btn-lg bg-black text-white border-black  w-[400px] max-md:w-[300px]">
                        <svg aria-label="GitHub logo" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"></path></svg>
                        Continue with GitHub
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;