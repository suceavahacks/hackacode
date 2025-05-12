"use client"
import { useRouter } from "next/navigation"

export default function NotFound() {

    const router = useRouter()

    return (
        <div className="inset-0 fixed w-screen h-screen bg-black flex flex-col justify-center items-center">
            <p className="text-3xl text-center mt-20">
                Ooops, it seems like you are lost!
                <br />
                The page you are looking for does not exist.
            </p>
                <span
                    className="text-3xl text-center mt-10 cursor-pointer bg-white text-black px-5 py-2 rounded-lg hover:bg-[#FF865B] hover:text-white transition-colors duration-300"
                    onClick={() => router.push("/")}
                >
                    Go back to home
                </span>
        </div>
    )
}