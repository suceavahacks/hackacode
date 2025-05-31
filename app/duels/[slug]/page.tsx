"use client"
import NotFound from "@/app/not-found";
import { Loading } from "@/components/Loading";
import { useDuel } from "@/utils/queries/duels/getDuel";
import { useUser } from "@/utils/queries/user/getUser";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Duel = () => {
    const params = useParams();
    const duelId = params.slug;
    const { duel, loading } = useDuel(duelId?.toString() || "");
    const { user, loading: userLoading } = useUser();

    
    if (loading || userLoading) {
        return <Loading />;
    }
    
    if(!user) {
        return <NotFound />
    }

    if(!duel) { 
        return <NotFound />
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Duel Page</h1>
            <p className="text-lg">This is duel with ID: {duel.id}</p>
            <p className="text-lg">User 1: {duel.user1_id}</p>
            <p className="text-lg">User 2: {duel.user2_id}</p>
            <p className="text-lg">Status: {duel.status}</p>
        </div>
    );
}

export default Duel;