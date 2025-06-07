"use client";

import { MessageCircleQuestionIcon } from "lucide-react"
import { ReactNode } from "react";
import { useState } from "react";
import { useUser } from "@/utils/queries/user/getUser";
import { useSupportMutation } from "@/utils/mutations/support/useSupportMutation";

interface CollapseProps {
    title: string;
    content: ReactNode;
}


const Collapse = ({ title, content }: CollapseProps) => (
    <div tabIndex={0} className="collapse collapse-arrow bg-primary rounded-none">
        <div className="collapse-title font-semibold text-xl">{title}</div>
        <div className="collapse-content text-lg">
            <span dangerouslySetInnerHTML={{ __html: content as string }} />
        </div>
    </div>
);

const categories = [
    {
        title: "General",
        questions: [
            {
                title: "What is Hackacode?",
                content: "Hackacode is a platform that allows you to solve coding challenges, compete with friends, and improve your coding skills through interactive learning."
            },
            {
                title: "How do I get started?",
                content: "You can get started by signing up for an account on our website. Once registered, you can start solving challenges and participating in duels."
            },
            {
                title: "Is Hackacode free to use?",
                content: "Yes, Hackacode is free to use. It's also open-source, so you can contribute to the project if you'd like."
            },
            {
                title: "Where can I find the source code?",
                content: "The source code for Hackacode is available on GitHub at <a class='color underline decoration-wavy' href='https://github.com/suceavahacks/hackacode'>https://github.com/suceavahacks/hackacode</a>. You can clone the repository and run it locally. :)"
            },
            {
                title: "How can I contact support?",
                content: "If you have any questions or need assistance, you can reach out to our support team via the contact form on our website."
            },
        ]
    },
    {
        title: "Features",
        questions: [
            {
                title: "Can I contribute challenges?",
                content: "Absolutely! We welcome contributions from the community. You can submit your own challenges for others to solve. You can do that by forking the repository on GitHub and creating a pull request with your challenge on the /requests/challenges/&lt;your-challenge&gt; directory."
            },
            {
                title: "What programming languages are supported?",
                content: "Hackacode supports multiple programming languages including Python, JavaScript, Java, C++, and more. You can choose your preferred language when solving challenges."
            },
            {
                title: "What is the leaderboard?",
                content: "The leaderboard displays the top users based on their performance in challenges and duels. You can check your ranking and see how you compare with others in the community."
            },
            {
                title: "What are daily challenges?",
                content: "Each day, we provide a new coding challenge that you can solve. These challenges are designed to help you practice and improve your coding skills. You can find the daily challenge in the 'Daily' section of the platform. Red cards indicate that you missed the challenge, and green cards indicate that you completed it. Yellow cards indicate that you are currently working on the challenge."
            },
        ]
    },
    {
        title: "Duels & Community",
        questions: [
            {
                title: "How do I participate in duels?",
                content: "To participate in duels, you can challenge your friends or accept challenges from others. You can join a duel by clicking on the 'Duels' section in the sidebar and typing the code of the duel you want to join."
            },
            {
                title: "Can I use Hackacode for educational purposes?",
                content: "Yes, Hackacode is a great tool for learning and teaching coding. You can use it in classrooms or for self-study to improve your programming skills."
            },
        ]
    },
    {
        title: "Help & Support",
        questions: [
            {
                title: "How can I report a bug?",
                content: "If you encounter any bugs or issues, please report them on our GitHub repository under the 'Issues' section. We appreciate your help in making Hackacode better!"
            },
            {
                title: "How can I improve my coding skills?",
                content: "You can improve your coding skills by regularly solving challenges, participating in duels, and reviewing your code with our AI-powered code review feature. Additionally, you can read articles and tutorials available on our platform. (soon)."
            },
        ]
    },
    {
        title: "Luigi",
        questions: [
            {
                title: "What powers Luigi?",
                content: "Luigi is powered by <a class='color underline decoration-wavy' href='https://ai.hackclub.com/'>https://ai.hackclub.com/</a>. Last time I checked, the latest model was: meta-llama/llama-4-maverick-17b-128e-instruct. You can use it to generate code, review your code, or just have a chat with it. It's like having a coding buddy that never sleeps!"
            }
        ]
    },
    {
        title: "Code Judger",
        questions: [
            {
                title: "How does the code judging work?",
                content: "The code judging system runs your code in a secure environment and checks it against predefined test cases. If your code passes all tests, you get a score based on its performance and correctness."
            },
            {
                title: "What happens if my code fails?",
                content: "If your code fails any test case, you'll receive feedback on what went wrong. You can then modify your code and resubmit it for judging."
            },
            {
                title: "In what programming language is the code judging system written?",
                content: "The code judging system is written in Golang. It uses a sandboxed environment to run your code securely and efficiently (which is also used in the International Olympiad of Informatics). The code judging system is open-source, so you can check it out on <a class='color underline decoration-wavy' href='https://github.com/suceavahacks/codejudger'>GitHub</a>."
            }
        ]
    },
    {
        title: "CLI integration",
        questions: [
            {
                title: "How do I use the CLI?",
                content: "You can use the CLI to actually submit your code, check your score, and even run challenges directly from your terminal. To get started, you can install the CLI by following the instructions in your settings page & landing page. (you need to be authenticated to access the CLI). Once installed, run <code class='color'>hackacode --help</code> to see the available commands and options."
            }
        ]
    }
];

const FAQ = () => {
    const [input, setInput] = useState("");
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const { user } = useUser();
    const supportMutation = useSupportMutation();

    const handleSupportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user || !subject.trim() || !message.trim()) return;
        
        try {
            await supportMutation.mutateAsync({
                user_id: user.id,
                subject: subject.trim(),
                message: message.trim(),
            });
            
            setSuccess(true);
            setSubject("");
            setMessage("");
            
            setTimeout(() => {
                setShowSupportModal(false);
                setSuccess(false);
            }, 3000);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="relative z-50 min-h-screen bg-secondary">
            <div className="bg-secondary border-b border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full blur-2xl"></div>
                </div>
                <div className="max-w-6xl mx-auto py-16 px-6 relative">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="relative">
                                <MessageCircleQuestionIcon className="h-12 w-12 color relative z-10" />
                            </div>
                            <h1 className="text-5xl font-bold color">
                                Frequently Asked Questions
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                            Here are some common questions and answers about Hackacode. If you have any other questions, feel free to reach out to us!
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <input
                                type="text"
                                className="max-w-96 w-full bg-primary border rounded-lg px-4 py-2 text-white"
                                placeholder="Search questions..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button 
                                onClick={() => setShowSupportModal(true)}
                                className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 whitespace-nowrap"
                            >
                                <MessageCircleQuestionIcon size={20} />
                                Contact support
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            {!input ? (
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 color">{cat.title}</h2>
                            <div className="space-y-2">
                                {cat.questions.map((q, qidx) => (
                                    <Collapse
                                        key={`${cat.title}-${q.title}`}
                                        title={q.title}
                                        content={q.content}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold mb-4 color">Search results for "{input}"</h2>
                    <div className="space-y-2">
                        {(() => {
                            const results = categories.flatMap((cat) =>
                                cat.questions
                                    .filter(q =>
                                        q.title.toLowerCase().includes(input.toLowerCase()) ||
                                        q.content.toLowerCase().includes(input.toLowerCase())
                                    )
                                    .map((q) => (
                                        <Collapse
                                            key={`${cat.title}-${q.title}`}
                                            title={q.title}
                                            content={q.content}
                                        />
                                    ))
                            );
                            return results.length > 0 ? results : (
                                <p className="text-gray-400 text-center py-8">No results found.</p>
                            );
                        })()}
                    </div>
                </div>
            )}
            {showSupportModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
                    <div className="bg-primary border border-gray-700 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                            <h3 className="text-xl font-semibold color">Contact support</h3>
                            <button 
                                onClick={() => setShowSupportModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {success ? (
                                <div className="text-center py-8">
                                    <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h4 className="text-xl font-medium color mb-2">Thank you for reaching out!</h4>
                                    <p className="text-gray-400">We'll get back to you as soon as possible.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSupportSubmit} className="space-y-4">
                                    {error && (
                                        <div className="bg-red-500/20 border border-red-500 rounded p-3 text-sm text-red-400">
                                            {error}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Subject
                                        </label>
                                        <input 
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="w-full bg-secondary border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent"
                                            placeholder="How can we help?"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Message
                                        </label>
                                        <textarea 
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full bg-secondary border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-accent"
                                            rows={4}
                                            placeholder="Describe your issue..."
                                            required
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting || !subject.trim() || !message.trim()}
                                        className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded transition-colors duration-300 flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            'Send message'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default FAQ;
