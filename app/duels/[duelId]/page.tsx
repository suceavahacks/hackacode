"use client"
import NotFound from "@/app/not-found";
import { Loading } from "@/components/Loading";
import { useDuel } from "@/utils/queries/duels/getDuel";
import { useUser } from "@/utils/queries/user/getUser";
import { useParams } from "next/navigation";

const Duel = () => {
    const params = useParams();
    const duelId = params.duelId;
    const { duel, loading } = useDuel(duelId?.toString() || "");
    const { user, loading: userLoading } = useUser();

    
    console.log(duel)

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
        <div className="h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center bg-primary text-white">
            
        </div>
    );
}

export default Duel;