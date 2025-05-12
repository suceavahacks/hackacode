"use client"

import { useEffect } from "react"

const Logout = () => {
    
    useEffect(() => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("expires_at")
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