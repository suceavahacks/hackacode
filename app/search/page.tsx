"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const search = () => {
    const [value, setValue] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!value.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const timeout = setTimeout(async () => {
            const { data: problems } = await supabase
                .from("problems")
                .select("slug")
                .ilike("title", `%${value}%`);

            const { data: users } = await supabase
                .from("users")
                .select("id, username, slug")
                .or(`username.ilike.%${value}%,slug.ilike.%${value}%`);

            const formattedProblems = (problems || []).map((item: any) => ({
                id: item.id,
                label: item.slug,
                type: "Challenge",
            }));

            const formattedUsers = (users || []).map((item: any) => ({
                id: item.id,
                label: item.slug,
                type: "User",
            }));

            setResults([...formattedUsers, ...formattedProblems]);
            setLoading(false);
        }, );
        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-start backdrop-blur-6xl">
            <div className="w-full max-w-2xl mx-auto px-4 pt-12">
                <div className="flex items-center border-b-2 border-white px-3 py-2">
                    <Search className="mr-3 text-white" size={32} />
                    <input
                        type="text"
                        className="w-full bg-transparent outline-none py-4 px-2 text-3xl text-white"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        autoComplete="off"
                    />
                </div>
                <div className="mt-8">
                    {loading && <div className="text-white/80">Search...</div>}
                    {!loading && results.length > 0 && (
                        <ul>
                            {results.map((item) => (
                                <li key={item.type + item.id} className="text-white py-2 border-b border-white/10 flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/10">{item.type}</span>
                                    <span>{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!loading && results.length === 0 && value && (
                        <div className="text-white/40">Niciun rezultat.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default search;