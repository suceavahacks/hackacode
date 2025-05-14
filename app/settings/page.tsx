"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@/utils/queries/user/getUser";
import { Loading } from "@/components/Loading";


export default function Settings() {
    //change username, password, email, profile picture, and ofc delete account
    const { user, loading, error } = useUser();
    if (loading) {
        return <Loading />;
    }
    if (!user) {
        window.location.href = "/signin";
        return null;
    }



    if (error) return ;
    return (
        <div className="container ml-20 max-md:ml-2 mt-5">
            <h1 className="text-4xl font-bold mb-4">Settings</h1>
        </div>
    );
}