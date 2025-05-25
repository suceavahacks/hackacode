"use client"
import NotFound from "@/app/not-found"
import { Loading } from "@/components/Loading"
import { useChallenge } from "@/utils/queries/user/getChallenge"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function Challenge() {
    const params = useParams()
    const { challenge, loading } = useChallenge(params.slug as string)
    
    useEffect(() => {
        if (challenge) {
            console.log("Challenge data:", challenge)
        }
    }, [challenge])

    if (loading) {
        return <Loading />
    }

    if (!challenge) {
        return <NotFound />
    }

    return (
        <div className="ml-20">{params.slug}</div>
    )
}