"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchQuery } from "@/utils/queries/search/search";
import Link from "next/link";
import NeedAuth from "@/components/NeedAuth";
import { useUser } from "@/utils/queries/user/getUser";

function useDebouncedValue<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}

const SearchPage = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebouncedValue(value, 700);
    const { data: results = [], isLoading } = useSearchQuery(debouncedValue);

    const showResults = !isLoading && results.length > 0 && debouncedValue.trim();
    const showNoResults = !isLoading && results.length === 0 && debouncedValue.trim();
    const { user } = useUser();

    if (!user) {
        return <NeedAuth />;
    }

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
                <div className="mt-8 min-h-[40px]">
                    {isLoading && debouncedValue.trim() && (
                        <div className="text-white/80">Search...</div>
                    )}
                    {showResults && (
                        <ul>
                            {results.map((item) => (
                                <li key={item.type + item.id} className="text-white py-2 border-b border-white/10 flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/10">{item.type}</span>
                                    {item.type === "User" ? (
                                        <Link href={`/profile/${item.label}`} className="text-white hover:underline hover:decoration-wavy">
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <Link href={`/challenges/${item.label}`} className="text-white hover:underline hover:decoration-wavy">
                                            {item.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {showNoResults && (
                        <div className="text-white/40">Niciun rezultat.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;