"use client"
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { FlagIcon, Swords, UserPlus, LoaderCircle, ChevronDown } from "lucide-react";
import { useUser } from "@/utils/queries/user/getUser";
import NotFound from "../not-found";
import useDuelRealtime from "@/utils/duels/useDuelRealtime";
import { useRouter } from "next/navigation";

const Duels = () => {
    const supabase = createClient();
    const [duelId, setDuelId] = useState<string | null>(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [joinLoading, setJoinLoading] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [selectedTimeLimit, setSelectedTimeLimit] = useState(600);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [error, setError] = useState<string | null>(null); 
    const { user } = useUser();
    const router = useRouter();
     
    useEffect(() => {
        setTimeout(() => {
            setError(null);
            setCreateLoading(false);    
            setJoinLoading(false);
        }, 5000);
    }, [error]);

    const timeLimitOptions = [
        { value: 300, label: "5 minutes" },
        { value: 600, label: "10 minutes" },
        { value: 900, label: "15 minutes" },
        { value: 1800, label: "30 minutes" },
    ];

    if(!user) {
        return <NotFound />;
    }

    useDuelRealtime(duelId, (payload) => {
        if (payload.status === 'active') {
            router.push(`/duels/${payload.id}`);
        }
    })

    const handleCreateDuel = async () => {
        setCreateLoading(true);
        try {
            const { data, error } = await supabase
                .from('duels')
                .insert([{ user1_id: user.id, time_limit: selectedTimeLimit }])
                .select('id')
                .single();

            if (error) throw error;

            setDuelId(data.id);
        } catch (error) {
            setError('Error creating duel');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleJoinDuel = async () => {
        if (!joinCode) return;
        
        setJoinLoading(true);

        try {
            const { data: duelData, error: fetchError } = await supabase
                .from('duels')
                .select('*')
                .eq('id', joinCode)
                .single();
            
            if (fetchError || !duelData) {
                setError(`Duel not found with join code: ${joinCode}`);
                setJoinLoading(false);
                return;
            }

            if(duelData.user1_id === user.id) {
                setError(`You cannot join your own duel`);
                setJoinLoading(false);
                return;
            }

            if(duelData.status !== 'pending') {
                setError(`Duel is not in pending status: ${duelData.status}`);
                setJoinLoading(false);
                return;
            }

            const { error: updateError } = await supabase
                .from('duels')
                .update({ 
                    user2_id: user.id,
                    status: 'active',
                    started_at: new Date().toISOString()
                })
                .eq('id', joinCode);

            if (updateError) {
                setError(`Error updating duel: ${updateError.message}`);
                setJoinLoading(false);
                return;
            }

            router.push(`/duels/${joinCode}`);
            
        } catch (error) {
            setError('Error joining duel');
        } finally {
            setJoinLoading(false);
        }
    };

    return (
        <div className="w-screen mx-auto py-16 px-6 relative bg-secondary border-b border-gray-800 h-[calc(100vh-64px)]">
            {error && (
                <div className="toast toast-bottom toast-right">
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                </div>
            )}
            <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="relative">
                        <FlagIcon className="h-12 w-12 color relative z-10" />
                    </div>
                    <h1 className="text-5xl font-bold color">
                        Duels!
                    </h1>
                </div>
                <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                    Mhm. Duels?! Yep, we have them! Create or join a duel to compete with others in real-time coding challenges. Show off your skills and climb the leaderboard!
                </p>

                <div className="flex justify-center gap-8 mt-8">
                    <div className="text-center">
                        <div className="text-2xl font-bold btn">{0}</div>
                        <div className="text-sm text-gray-400">
                            Active duels!
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 flex gap-8 justify-center">
                    <div className="bg-secondary p-6 rounded-xl shadow-lg w-96 border border-gray-800">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary rounded-full">
                                <Swords size={32} className="color" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Create a duel</h2>
                        <p className="text-gray-400 mb-6">Challenge someone to a coding battle!</p>
                        
                        {!duelId ? (
                            <div className="space-y-4">
                                <div className="relative">
                                    <button 
                                        className="w-full px-4 py-3 bg-primary rounded-lg flex items-center justify-between"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                        <span>
                                            {timeLimitOptions.find(opt => opt.value === selectedTimeLimit)?.label || "Select time limit"}
                                        </span>
                                        <ChevronDown size={16} />
                                    </button>
                                    
                                    {dropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-primary rounded-lg shadow-lg">
                                            {timeLimitOptions.map(option => (
                                                <div 
                                                    key={option.value}
                                                    className="px-4 py-2 cursor-pointer hover:bg-secondary"
                                                    onClick={() => {
                                                        setSelectedTimeLimit(option.value);
                                                        setDropdownOpen(false);
                                                    }}
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    className="w-full px-4 py-3 btn rounded-lg flex items-center justify-center gap-2 transition"
                                    onClick={() => { handleCreateDuel() }}
                                    disabled={createLoading}
                                >
                                    {createLoading ? (
                                        <LoaderCircle size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Swords size={20} />
                                            Create duel
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="color font-medium">Duel Created!</p>
                                <p className="text-gray-400">
                                    Your duel is ready. An ID has been generated.
                                </p>
                                <div className="bg-primary p-3 rounded-lg font-mono text-sm">
                                    {duelId}
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Waiting for an opponent to join... <br/>
                                    BTW: do not leave this page, otherwise you will have to create a new duel.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-secondary p-6 rounded-xl shadow-lg w-96 border border-gray-800">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary rounded-full">
                                <UserPlus size={32} className="color" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Join a duel</h2>
                        <p className="text-gray-400 mb-6">Enter a duel code to join an existing battle!</p>
                        
                        <div className="space-y-4">
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Enter duel code"
                                    className="w-full px-4 py-3 bg-primary rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                />
                            </div>
                            <button 
                                className="w-full px-4 py-3 btn rounded-lg flex items-center justify-center gap-2 transition"
                                onClick={() => { handleJoinDuel() }}
                                disabled={joinLoading || !joinCode}
                            >
                                {joinLoading ? (
                                    <LoaderCircle size={20} className="animate-spin" />
                                ) : (
                                    <>
                                        <UserPlus size={20} />
                                        Join battle
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Duels;