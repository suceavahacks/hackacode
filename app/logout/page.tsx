"use client"

import { useEffect } from "react"

const Logout = () => {

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem("access_token")
            window.localStorage.removeItem("refresh_token")
            window.localStorage.removeItem("expires_at")
        }
    }, [])

    window.location.href = "/"
    return (
        <div className="w-screen flex flex-col items-center justify-center gap-10 min-h-screen max-md:mt-40">
            <h1 className="text-7xl font-extrabold text-center max-md:text-5xl">You have been logged out</h1>
            <p className="text-xl">Redirecting...</p>
        </div>
    )

}

export default Logout