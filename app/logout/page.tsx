"use client"

import { useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
const Logout = () => {
    useEffect(() => {
        const supabase = createClient()
        const logout = async () => {
            await supabase.auth.signOut()
            window.location.href = "/"
        }
        logout()
    }, [])

    return (
        <div className="container ml-[64px] mt-20">
            <h1>Logging out...</h1>
        </div>
    )
}

export default Logout