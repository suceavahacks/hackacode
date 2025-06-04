"use client";

interface Month {
    days: number;
    name: string;
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
    const monthIndex = currentDate.getMonth();
    const monthName = calendar[monthIndex].name;
    const daysInMonth = calendar[monthIndex].days;

    return (
        <div className="min-h-screen w-full bg-primary p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold color mb-5">
                    Daily challenges
                </h1>
                <div className="bg-secondary rounded-xl shadow-lg p-6">
                    <h2 className="text-xl text-white mb-4">
                        {monthName} {currentDate.getFullYear()}
                    </h2>
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
                    <div className="grid grid-cols-7 gap-4">
                        {Array.from({ length: daysInMonth }, (_, day) => (
                            <div
                                key={day}
                                className={`flex items-center justify-center h-[150px] hover:opacity-50 transition duration-300 ease-in-out rounded-lg cursor-pointer text-2xl font-bold ${day === currentDate.getDate() - 1

                                        ? "bg-yellow-400 text-black"
                                        : "bg-primary text-white"
                                    }`}
                            >
                                {day + 1}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Daily;