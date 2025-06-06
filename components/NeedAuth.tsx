"use client"
import { useRouter } from "next/navigation"

export default function NotFound() {

    const router = useRouter()

    return (
        <div className="inset-0 fixed w-screen h-screen flex flex-col justify-center items-center relative z-10">
            <p className="text-3xl text-center mt-20">
                Hi there, cowboy!
                <br />
                It seems like you need to be authenticated to access this page.
            </p>
                <span
                    className="text-3xl text-center mt-10 cursor-pointer bg-white btn px-5 py-2 rounded-lg hover:text-white transition-colors duration-300"
                    onClick={() => router.push("/signin")}
                >
                    Log in to continue
                </span>
        </div>
    )
}