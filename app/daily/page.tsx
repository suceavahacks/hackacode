"use client";
import { useDaily } from "@/utils/queries/daily/getDaily";
import { useUser } from "@/utils/queries/user/getUser";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Flame } from "lucide-react";
import NeedAuth from "@/components/NeedAuth";

interface Month {
    days: number;
    name: string;
}

interface DailyChallenge {
    day: number;
    month: string; 
    slug: string;
}

const calendar: Month[] = [
    { days: 31, name: "January" },
    { days: 28, name: "February" },
    { days: 31, name: "March" },
    { days: 30, name: "April" },
    { days: 31, name: "May" },
    { days: 30, name: "June" },
    { days: 31, name: "July" },
    { days: 31, name: "August" },
    { days: 30, name: "September" },
    { days: 31, name: "October" },
    { days: 30, name: "November" },
    { days: 31, name: "December" }
];

const Daily = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const [monthIndex, setMonthIndex] = useState(currentDate.getMonth());

    const monthName = calendar[monthIndex].name;
    const daysInMonth = calendar[monthIndex].days;
    const currentMonthStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}`;

    const { daily, loading, error } = useDaily();
    const { user } = useUser();
 
    const challengeByDay = new Map<number, DailyChallenge>();
    
    if (daily) {
        daily.forEach((challenge: DailyChallenge) => {
            if (challenge.month === currentMonthStr) {
                challengeByDay.set(challenge.day, challenge);
            }
        });
    }

    if (!user) return <NeedAuth />;

    const doneDailies = user.completed_dailies || [];

    const isDailyCompleted = (year: number, month: number, day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return doneDailies.includes(dateStr);
    };

    const isDateInPast = (day: number) => {
        const checkDate = new Date(currentYear, monthIndex, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return checkDate < today;
    };

    const handleNextMonth = () => {
        setMonthIndex((prev) => (prev + 1) % 12);
    };

    const handlePreviousMonth = () => {
        setMonthIndex((prev) => (prev - 1 + 12) % 12);
    }
    const userStreak = useMemo(() => {
        if (!user || !user.completed_dailies || user.completed_dailies.length === 0) {
            return 0;
        }

        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
        
        const hasCompletedToday = user.completed_dailies.includes(todayStr);
        const hasCompletedYesterday = user.completed_dailies.includes(yesterdayStr);
        
        if (!hasCompletedToday && !hasCompletedYesterday) {
            return 0;
        }
        
        let currentStreak = 1; 
        let checkDate = hasCompletedToday ? today : yesterday;
        
        while (true) {
            checkDate.setDate(checkDate.getDate() - 1);
            const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
            
            if (!user.completed_dailies.includes(dateStr)) {
                break;
            }
            
            currentStreak++;
        }
        
        return currentStreak;
    }, [user]);

    return (
        <div className="min-h-screen w-full bg-primary p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-3xl font-bold color">
                        Daily challenges
                    </h1>

                    <div className="bg-orange-600/20 text-orange-400 px-4 py-2 rounded-xl flex items-center gap-2 border border-orange-600/30">
                        <Flame className="h-5 w-5 text-orange-400" />
                        <div className="font-bold">{userStreak} day streak</div>
                    </div>
                </div>
                
                <div className="bg-secondary rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <button 
                            onClick={handlePreviousMonth} 
                            className="text-white color px-4 py-2 rounded hover:opacity-80 bg-primary"
                        >
                            Previous
                        </button>
                        <h2 className="text-xl text-white">
                            {monthName} {currentYear}
                        </h2>
                        <button 
                            onClick={handleNextMonth} 
                            className="text-white color px-4 py-2 rounded hover:opacity-80 bg-primary"
                        >
                            Next
                        </button>
                    </div>
                    <div className="mb-4">
                        <span className="text-white">Today is: </span>
                        <span className="text-yellow-400 font-bold">
                            {currentDate.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            })}
                        </span>
                    </div>
                    
                    <div className="flex gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <span className="text-white text-sm">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                            <span className="text-white text-sm">Today</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            <span className="text-white text-sm">Missed</span>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="text-white text-center py-4">Loading daily challenges...</div>
                    ) : error ? (
                        <div className="text-red-400 text-center py-4">Error loading challenges: {error.message}</div>
                    ) : (
                        <div className="grid grid-cols-7 gap-4">
                            {Array.from({ length: daysInMonth }, (_, day) => {
                                const dayNumber = day + 1;
                                const challenge = challengeByDay.get(dayNumber) || null;
                                const isCurrentDay = dayNumber === currentDate.getDate() && monthIndex === currentDate.getMonth();
                                const dateString = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                                const isCompleted = isDailyCompleted(currentYear, monthIndex, dayNumber);
                                const isPast = isDateInPast(dayNumber);
                                const isMissed = Boolean(isPast && !isCompleted && !isCurrentDay);

                                const cellContent = (
                                    <div className="flex flex-col items-center justify-center h-full w-full">
                                        <div className="text-2xl font-bold mb-2">{dayNumber}</div>
                                        {challenge && (
                                            <div className="text-xs text-center overflow-hidden overflow-ellipsis px-2">
                                                {challenge.slug || "No challenge"}
                                            </div>
                                        )}
                                    </div>
                                );

                                let cellClass = "flex items-center justify-center h-[150px] transition duration-300 ease-in-out rounded-lg ";
                                
                                if (isCurrentDay) {
                                    if (isCompleted) {
                                        cellClass += "bg-green-500 text-white hover:opacity-70 cursor-pointer";
                                    }
                                    cellClass += "bg-yellow-400 text-white hover:opacity-70 cursor-pointer";
                                } else if (isCompleted) {
                                    cellClass += "bg-green-500 text-white hover:opacity-70 cursor-pointer";
                                } else if (isMissed) {
                                    cellClass += "bg-red-500 opacity-30 text-white hover:opacity-70 cursor-pointer";
                                } else if (challenge) {
                                    cellClass += "bg-primary text-white hover:opacity-70 cursor-pointer";
                                } else {
                                    cellClass += "bg-primary text-white opacity-50";
                                }

                                return (
                                    <div
                                        key={day}
                                        className={cellClass}
                                    >
                                        {challenge ? (
                                            <Link 
                                                href={`/challenges/${challenge.slug}?daily=${dateString}`} 
                                                className="w-full h-full flex items-center justify-center"
                                            >
                                                {cellContent}
                                            </Link>
                                        ) : isMissed ? (
                                            cellContent
                                        ) : (
                                            cellContent
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Daily;