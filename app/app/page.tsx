"use client"
import { Loading } from "@/components/Loading";
import { useUser } from "@/utils/queries/user/getUser";

export default function App(){
    const { user, loading, error } = useUser();

    if (loading) {
        return <Loading />;
    }

    if(!user) {
        return null;
    }

    return user && (
        <div className="container ml-[64px] mt-20">
            <h1>Welcome to the app</h1>
            {user ? (
                <div>
                    <h2>Hello, user</h2>
                    <p>Your email is: {user.identities[0].email}</p>
                </div>
            ) : (
                <div>
                    <h2>Please log in</h2>
                    <p>You are not logged in.</p>
                </div>
            )}
        </div>
    );
}