"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useUser } from "@/utils/queries/user/getUser.ts";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";
import { onSubmit } from "@/utils/mutations/user/signin";

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
            .min(8, "Password must be at least 8 characters long"),
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

    if (userLoading || user) {
        return <Loading />;
    }

    return !user && (
        <div className="w-screen flex flex-col items-center justify-center gap-10 h-screen">
            <div className="flex flex-col">
                <h1 className="text-7xl font-extrabold text-center">
                    Welcome to{" "}
                    <span
                        style={{
                            color: "#FF865B",
                            textDecoration: "underline",
                            textDecorationColor: "#FF865B",
                            textDecorationThickness: "2px",
                            textUnderlineOffset: "4px",
                            textDecorationStyle: "wavy",
                        }}
                    >
                        Hackacode
                    </span>
                    !
                </h1>
                <p className="text-2xl opacity-60 text-center">
                    The best place to learn and practice coding with your friends.
                </p>
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
                        onClick={handleSubmit((data) => onSubmit(data, setLoading, setError))}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Sign In"}
                    </button>
                    {error && (
                        <div className="toast">
                            <div className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SignIn;