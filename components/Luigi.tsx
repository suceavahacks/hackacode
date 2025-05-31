import { useState } from "react";

interface LuigiProps {
    code: string;
    setCode: (code: string) => void;
    description: string;
}

export const Orpheus = ({ code, setCode, description }: LuigiProps) => {
    const [showInput, setShowInput] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    function extractPureCode(text: string): string {
        const match = text.match(/```(?:\w*\n)?([\s\S]*?)```/);
        return match ? match[1].trim() : text;
    }

    const prompt = `
        You are Orpheus, a helpful AI assistant. Answer the user's question as best as you can.
        Hackacode is a web application that allows users to solve coding challenges in various languages.
        The user has provided the following code snippet:
        \`\`\`${code}\`\`\`
        The user has asked: "${message}"
        Please provide a concise and helpful response.
        The response will be displayed in the code editor, so make sure to actually comment the text if necessary and make modifications to the code, if needed.
        Try to explain the code, suggest improvements, or help with debugging.
        But do not hand an easy collar to the user, they are here to learn and improve their coding skills.
        Only provide the code that is necessary to answer the question.
        Do not include any additional text or explanations outside of the code block.
        Please ensure that the response is relevant to the user's question and the provided code snippet.
        If the user asks for help with a specific language, make sure to provide the response in that language.
        The problem description is: "${description}"
        Only respond with the code that is necessary to answer the question.
        Please if the user has any code written, do not change the code, but rather comment on it and suggest improvements or fixes.
        Always include all necessary library imports at the top of the code, for the language used. Missing imports are unacceptable.
        DONT ABSOLUTELY DO THE USER'S HOMEWORK FOR THEM, but rather help them understand the code and improve it.
        Write only the necessary code to solve the problem. Do not include any print statements like "Enter a number" or any other explanatory text. Read input directly and output only the result.
    `

    const GetOrpheusAsap = async () => {
        if (!message.trim()) return;
        setShowInput(true);
        setLoading(true);
        try {
            const response = await fetch("https://ai.hackclub.com/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        }
                    ]
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response from Orpheus");
            }

            const data = await response.json();

            if (data.choices && data.choices.length > 0) {
                const orpheusMessage = data.choices[0].message.content;
                setCode(extractPureCode(orpheusMessage));
            }
            setShowInput(false);
            setLoading(false);
        }
        catch (error) {
            console.error("Error fetching Orpheus response:", error);
        }
    }

    return (
        <div
            className="fixed bottom-0 left-[72px] flex flex-row items-center z-50"
            onMouseEnter={() => setShowInput(true)}
            onMouseLeave={() => setShowInput(false)}
        >
            <img
                className={`h-24 transition-all duration-300 ${showInput ? "h-28" : "hover:h-28"}`}
                src="https://hackclub.com/stickers/single%20neuron%20activated.png"
                alt="rATTOn"
            />
            {showInput && (
                <div className="relative w-full max-w-xs ml-4 mb-2">
                    <input
                        type="text"
                        autoFocus
                        placeholder={loading ? "Luigi is thinking..." : "Ask Luigi..."}
                        className="input w-full focus:outline-none focus:ring-2 focus:ring-accent bg-secondary text-white border border-gray-700 rounded-lg px-4 py-2 transition-all duration-300 pr-10"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !loading) {
                                e.preventDefault();
                                GetOrpheusAsap();
                                setMessage("");
                            }
                        }}
                        disabled={loading}
                    />
                    {loading && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};