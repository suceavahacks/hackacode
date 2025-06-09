"use client"
import NotFound from "@/app/not-found"
import { Loading } from "@/components/Loading"
import { useChallenge } from "@/utils/queries/challenges/getChallenge"
import { useParams, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useRef } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { cpp } from "@codemirror/lang-cpp"
import { python } from "@codemirror/lang-python"
import { getTemplate } from "@/components/Languages"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useUser } from "@/utils/queries/user/getUser"
import { Luigi } from "@/components/Luigi"
import { useSubmitChallenge } from "@/utils/mutations/challenges/submit"
import { useSubmitDiscussion } from "@/utils/mutations/challenges/discussion/discussion";
import { useRealTimeDiscussion } from "@/utils/mutations/challenges/discussion/useRealTimeDiscussion"
import { createClient } from "@/utils/supabase/client";
import { useRunCode } from "@/utils/mutations/challenges/run"
import { useVoteChallenge, VoteType } from "@/utils/mutations/challenges/vote"

interface JudgeResult {
    ExitCode: string;
    Status: string;
    Killed: string;
    Time: string;
    TimeWall: string;
    Memory: string;
    CswVoluntary: string;
    CswForced: string;
    Message: string;
    Stdout: string;
    Stderr: string;
    Passed: boolean;
    CompilationError: string;
}

interface SubmissionResult {
    status: string;
    results?: JudgeResult[];
}

interface Submission {
    challenge: string;
    code: string;
    result: SubmissionResult;
    language: string;
    timestamp: string | number | Date;
    status: string; 
    score: number;
    id: string;
}

interface UserWithSubmissions {
    submissions: Submission[];
}

export default function Challenge() {
    const [language, setLanguage] = useState<string>("C++")
    const params = useParams()
    const { challenge, loading } = useChallenge(params.slug as string)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [results, setResults] = useState<any>(null)
    const [loadingSubmit, setLoading] = useState<boolean>(false)
    const { user } = useUser()
    const [activeTab, setActiveTab] = useState<"description" | "submissions" | "discussion">("description")
    const handleSubmit = useSubmitChallenge()
    const searchParams = useSearchParams()
    const dailyParam = searchParams.get("daily")
    const [discussionInput, setDiscussionInput] = useState<string>("")
    const [discussion, setDiscussion] = useState<any[]>([])
    const submitDiscussion = useSubmitDiscussion()
    const discussionEndRef = useRef<HTMLDivElement>(null)
    const [runOpen, setRunOpen] = useState<boolean>(false)
    const [runResults, setRunResults] = useState<any>(null)
    const run = useRunCode({
      onSuccess: (data : any) => {
        setRunResults(data);
      }
    })
    const voteChallenge = useVoteChallenge()

    const [runInput, setRunInput] = useState<string>("")

    const [code, setCode] = useState<string>(getTemplate(language))
    const onChange = useCallback((value: string) => {
        setCode(value)
    }, [])

    const languages = [
        { name: "C++", value: cpp() },
        { name: "Python", value: python() },
    ]

    useEffect(() => {
        if (challenge) {
            setCode(getTemplate(language))
        }
    }, [challenge, language])

    useEffect(() => {
      const fetchDiscussion = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("problems")
          .select("discussion")
          .eq("slug", challenge.slug)
          .single();
        if (!error && data?.discussion) {
          setDiscussion(data.discussion);
        }
      };
      if (challenge?.slug) fetchDiscussion();
    }, [challenge?.slug]);
    
    useRealTimeDiscussion(challenge?.slug, (newDiscussion) => {
      setDiscussion(newDiscussion);
    });

    useEffect(() => {
      discussionEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [discussion]);

    const [panelDirection, setPanelDirection] = useState<"horizontal" | "vertical">("horizontal");

    useEffect(() => {
        const handleResize = () => {
            setPanelDirection(window.innerWidth < 768 ? "vertical" : "horizontal");
        };
        
        handleResize();
        
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) {
        return <Loading />
    }

    if (!challenge) {
        return <NotFound />
    }

    const handleDiscussionSubmit = async () => {
        if (!discussionInput.trim()) return;
        const timestamp = new Date().toISOString();
        const newDiscussion = {
            username: user?.username || user?.slug, 
            message: discussionInput,
            timestamp,
            slug: challenge.slug,
        };  
        try {
            submitDiscussion.mutate(newDiscussion);
            setDiscussionInput("");
        } catch (error) {
            console.error("Failed to submit discussion:", error);
        }
    }

    const getValidDailyParam = () => {
        if (!dailyParam) return undefined;

        const dailyDate = new Date(dailyParam);
        const today = new Date();

        if (dailyDate.getDate() === today.getDate() &&
            dailyDate.getMonth() === today.getMonth() &&
            dailyDate.getFullYear() === today.getFullYear()) {
            return dailyParam;
        }
        return undefined;
    }
    
    const handleVote = (voteType: VoteType) => {
      if (!user || !challenge?.slug) return;
      
      voteChallenge.mutate({
        challengeSlug: challenge.slug,
        userId: user.id,
        voteType: voteType
      });
    }

    if(!user) {
      return <NotFound />
    }
    
    return (
        <div className="bg-primary text-white relative z-50 h-[calc(100vh-64px)] flex flex-col">
            <div className="bg-secondary border-b border-gray-700 p-4 flex flex-col md:flex-row justify-between items-start md:items-center md:ml-[64px]">
                <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
                    <h1 className="text-xl md:text-2xl font-bold truncate max-w-full">
                        #{challenge.title}
                    </h1>
                    
                    <div className="flex gap-2 mt-2 md:mt-0 md:ml-4">
                        <button
                            className={`${
                                challenge.upvotes?.includes(user.id) 
                                ? 'bg-green-600 border-green-500' 
                                : 'bg-secondary border-gray-600 hover:border-accent'
                            } text-white rounded-md px-2 md:px-3 py-1 border transition-colors flex items-center gap-1 text-sm`}
                            onClick={() => handleVote('upvote')}
                            title="Upvote this problem"
                        >
                            <span>👍</span>
                            {challenge.upvotes?.length || 0}
                        </button>
                        <button
                            className={`${
                                challenge.downvotes?.includes(user.id) 
                                ? 'bg-red-600 border-red-500' 
                                : 'bg-secondary border-gray-600 hover:border-accent'
                            } text-white rounded-md px-2 md:px-3 py-1 border transition-colors flex items-center gap-1 text-sm`}
                            onClick={() => handleVote('downvote')}
                            title="Downvote this problem"
                        >
                            <span>👎</span>
                            {challenge.downvotes?.length || 0}
                        </button>
                    </div>

                    <span className={`mt-2 md:mt-0 md:ml-4 px-2 py-1 text-xs font-medium rounded-md inline-flex ${
                        challenge.difficulty === "easy" ? "bg-green-900/50 text-green-400 border border-green-700" :
                        challenge.difficulty === "medium" ? "bg-yellow-900/50 text-yellow-400 border border-yellow-700" :
                        "bg-red-900/50 text-red-400 border border-red-700"
                    }`}>
                        {challenge.difficulty}
                    </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm mt-3 md:mt-0">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-accent"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span className="text-gray-300">Time: <span className="text-white">{challenge.time_limit}s</span></span>
                    </div>
                    <div className="flex items-center md:ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-accent"><path d="M14 9V6c0-1.1.9-2 2-2h0c1.1 0 2 .9 2 2v3"/><path d="M18 9H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z"/><path d="M6 9V6c0-1.1.9-2 2-2h0c1.1 0 2 .9 2 2v3"/></svg>
                        <span className="text-gray-300">Memory: <span className="text-white">{challenge.memory_limit}KB</span></span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <PanelGroup direction={panelDirection} className="flex-1">
                    <Panel className="md:ml-[64px] overflow-hidden flex flex-col" minSize={20} defaultSize={panelDirection === "vertical" ? 40 : 50}>
                        <div className="border-b border-gray-700 bg-secondary/40">
                            <div className="flex overflow-x-auto">
                                <button 
                                    onClick={() => setActiveTab("description")}
                                    className={`px-3 md:px-6 py-3 font-medium text-xs md:text-sm whitespace-nowrap ${
                                        activeTab === "description" 
                                            ? "text-accent border-b-2 border-accent" 
                                            : "text-white/70 hover:text-white"
                                    }`}
                                >
                                    Description
                                </button>
                                <button 
                                    onClick={() => setActiveTab("submissions")}
                                    className={`px-3 md:px-6 py-3 font-medium text-xs md:text-sm whitespace-nowrap ${
                                        activeTab === "submissions" 
                                            ? "text-accent border-b-2 border-accent" 
                                            : "text-white/70 hover:text-white"
                                    }`}
                                >
                                    Submissions
                                </button>
                                <button 
                                    onClick={() => setActiveTab("discussion")}
                                    className={`px-3 md:px-6 py-3 font-medium text-xs md:text-sm whitespace-nowrap ${
                                        activeTab === "discussion" 
                                            ? "text-accent border-b-2 border-accent" 
                                            : "text-white/70 hover:text-white"
                                    }`}
                                >
                                    Discussion
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-y-auto p-6 flex-1">
                            {activeTab === "description" && (
                                <div className="max-w-3xl">
                                    <section className="prose prose-invert prose-lg prose-pre:bg-secondary/70 prose-pre:border prose-pre:border-gray-700 prose-code:text-accent max-w-full challenge" dangerouslySetInnerHTML={{ __html: challenge.description }} />
                                </div>
                            )}
                            
                            {activeTab === "submissions" && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                                        Your submissions
                                    </h2>
                                    
                                    {user?.submissions?.filter((sub: Submission) => sub.challenge === challenge.slug).length > 0 ? (
                                        <div className="rounded-lg border border-gray-700 overflow-x-auto">
                                            <table className="w-full text-xs md:text-sm">
                                                <thead className="bg-secondary text-gray-300">
                                                    <tr>
                                                        <th className="px-2 md:px-4 py-2 md:py-3 text-left">Date</th>
                                                        <th className="px-2 md:px-4 py-2 md:py-3 text-left">Language</th>
                                                        <th className="px-2 md:px-4 py-2 md:py-3 text-left">Status</th>
                                                        <th className="px-2 md:px-4 py-2 md:py-3 text-left">Score</th>
                                                        <th className="px-2 md:px-4 py-2 md:py-3 text-left">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(user as UserWithSubmissions).submissions
                                                        .filter((sub: Submission) => sub.challenge === challenge.slug)
                                                        .map((submission: Submission, idx: number) => (
                                                            <tr 
                                                                key={idx} 
                                                                className="cursor-pointer border-t border-gray-700 hover:bg-secondary/40"
                                                                onClick={() => window.location.href = `/submissions/${submission.id}`}
                                                            >
                                                                <td className="px-2 md:px-4 py-2 md:py-3 text-gray-300 text-xs whitespace-nowrap">{new Date(submission.timestamp).toLocaleString()}</td>
                                                                <td className="px-2 md:px-4 py-2 md:py-3">{submission.language}</td>
                                                                <td className="px-2 md:px-4 py-2 md:py-3">
                                                                    <span className={`inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${
                                                                        submission.status == 'ACCEPTED' 
                                                                            ? 'bg-green-900/30 text-green-400 border border-green-700/50' 
                                                                            : 'bg-red-900/30 text-red-400 border border-red-700/50'
                                                                    }`}>
                                                                        {submission.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-2 md:px-4 py-2 md:py-3 font-mono">{submission.score}</td>
                                                                <td className="px-2 md:px-4 py-2 md:py-3">
                                                                    <button
                                                                        className="px-2 md:px-3 py-1 rounded text-xs font-medium bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setCode(submission.code);
                                                                            setLanguage(submission.language);
                                                                        }}
                                                                    >
                                                                        Load
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="bg-secondary/20 rounded-lg p-8 text-center border border-gray-700">
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/50 rounded-full mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                            </div>
                                            <h3 className="text-lg font-medium mb-1">No submissions yet</h3>
                                            <p className="text-white/60">Submit your solution to see your results here.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {activeTab === "discussion" && (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        Discussion
                                    </h2>
                                    
                                    <div className="flex-1 overflow-y-auto mb-4 border border-gray-700 rounded-lg p-4 bg-secondary/20">
                                        {discussion.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-64">
                                                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                </div>
                                                <p className="text-white/60">No messages yet. Be the first to start the discussion!</p>
                                            </div>
                                        )}
                                        
                                        <div className="space-y-3">
                                            {discussion.map((msg, idx) => (
                                                <div key={idx} className="bg-secondary/40 rounded-lg p-3 border border-gray-700">
                                                    <div className="flex items-center mb-1">
                                                        <span className="font-medium text-accent">{msg.username}</span>
                                                        <span className="ml-2 text-xs text-white/40">
                                                            {new Date(msg.timestamp).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-white/90">{msg.message}</p>
                                                </div>
                                            ))}
                                            <div ref={discussionEndRef} />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-2 bg-secondary/20 border border-gray-700 p-2 md:p-3 rounded-lg">
                                        <textarea
                                            className="bg-secondary/50 w-full rounded-lg p-2 md:p-3 text-white resize-none border border-gray-600 focus:border-accent focus:outline-none text-sm md:text-base"
                                            rows={2}
                                            placeholder="Write your message..."
                                            value={discussionInput}
                                            onChange={(e) => setDiscussionInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleDiscussionSubmit();
                                                }
                                            }}
                                        />
                                        <div className="flex justify-end mt-2">
                                            <button
                                                className="bg-accent px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-white text-sm md:text-base font-medium hover:bg-accent/80 flex items-center"
                                                onClick={handleDiscussionSubmit}
                                                disabled={!discussionInput.trim()}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Panel>
                    
                    <PanelResizeHandle className={`${panelDirection === "vertical" ? 'h-[2px] w-full' : 'w-[2px]'} bg-accent cursor-col-resize relative mx-[-2px] z-10`}>
                        <div className={`absolute ${panelDirection === "vertical" ? 'top-1/2 inset-x-0 h-0.5' : 'left-1/2 inset-y-0 w-0.5'} bg-accent-foreground/10`}></div>
                    </PanelResizeHandle>
                    
                    <Panel minSize={25}>
                        <div className="h-full flex flex-col">
                            <div className="flex-1 overflow-hidden">
                                <CodeMirror
                                    value={code}
                                    theme="dark"
                                    onChange={onChange}
                                    extensions={[cpp()]}
                                    className="monocode h-full"
                                    basicSetup={{
                                        lineNumbers: true,
                                        highlightActiveLine: true,
                                        highlightSelectionMatches: true,
                                        bracketMatching: true,
                                        autocompletion: true,
                                        foldGutter: true,
                                        indentOnInput: true,
                                    }}
                                    style={{ height: "100%", overflow: "hidden" }}
                                />
                            </div>
                            
                            <div className="bg-secondary/90 border-t border-gray-700 p-2 px-2 md:px-4 flex flex-wrap md:flex-nowrap justify-between items-center">
                                <div className="flex flex-wrap items-center gap-1 w-full md:w-auto">
                                    <select
                                        value={language}
                                        className="bg-secondary/90 text-white border border-gray-700 rounded-md py-1 px-2 text-xs md:text-sm focus:outline-none focus:border-accent mb-2 md:mb-0"
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang.name} value={lang.name}>
                                                {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    <div className="flex items-center gap-2 mb-2 md:mb-0 md:ml-2">
                                        <button 
                                            className="bg-accent hover:bg-accent/80 text-white px-2 md:px-4 py-1 text-xs md:text-sm rounded-md flex items-center" 
                                            onClick={() => setRunOpen(true)}
                                            disabled={loadingSubmit}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                            Run
                                        </button>
                                        
                                        <button 
                                            className="bg-accent hover:bg-accent/80 text-white px-2 md:px-4 py-1 text-xs md:text-sm rounded-md flex items-center"
                                            onClick={() => {
                                                handleSubmit.mutate({
                                                    code: code,
                                                    challenge: { 
                                                        slug: challenge.slug, 
                                                        time_limit: challenge.time_limit, 
                                                        memory_limit: challenge.memory_limit 
                                                    },
                                                    language: language,
                                                    user: user,
                                                    setResults: setResults,
                                                    setModalOpen: setModalOpen,
                                                    setLoading: setLoading,
                                                    daily: getValidDailyParam(),
                                                })
                                            }}
                                            disabled={loadingSubmit}
                                        >
                                            {loadingSubmit ? 
                                                <Loading /> : 
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M22 2 11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                                    Submit
                                                </>
                                            }
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex-shrink-0 mt-2 md:mt-0">
                                    <Luigi code={code} setCode={setCode} description={challenge.description} />
                                </div>
                            </div>
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[1000] p-4 overflow-y-auto">
                    <div className="bg-secondary border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full my-auto">
                        <div className="border-b border-gray-700 px-4 md:px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg md:text-xl font-semibold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
                                Submission Results
                            </h2>
                            <button 
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {!results ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loading />
                                </div>
                            ) : (
                                <div>
                                    <div className="bg-primary/50 border border-gray-700 rounded-lg p-4 mb-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <span className="text-gray-300 mr-2">Status:</span>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                                                    results.status === 'ACCEPTED' 
                                                        ? 'bg-green-900/30 text-green-400 border border-green-700/50' 
                                                        : 'bg-red-900/30 text-red-400 border border-red-700/50'
                                                }`}>
                                                    {results.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-gray-300 mr-2">Score:</span>
                                                <span className="font-mono text-lg font-semibold text-accent">
                                                    {results.score}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {results.status === "comp-failed" ? (
                                            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                                                <div className="flex items-start">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 mr-2 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                                    <div>
                                                        <h3 className="text-red-400 font-semibold mb-1">Compilation error</h3>
                                                        <pre className="font-mono text-sm bg-black/30 p-3 rounded-lg overflow-x-auto text-red-300 whitespace-pre-wrap w-full">{results.message}</pre>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-gray-700 overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-secondary/80 text-gray-300 border-b border-gray-700">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left">Test case</th>
                                                            <th className="px-4 py-3 text-left">Status</th>
                                                            <th className="px-4 py-3 text-left">Time</th>
                                                            <th className="px-4 py-3 text-left">Memory</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-700">
                                                        {results.results.map((testCase: any, index: number) => (
                                                            <tr 
                                                                key={index} 
                                                                className={`hover:bg-primary/30 ${
                                                                    testCase.Passed ? 'bg-green-900/10' : 'bg-red-900/10'
                                                                }`}
                                                            >
                                                                <td className="px-4 py-3 font-medium">Case #{index + 1}</td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                        testCase.Passed 
                                                                            ? 'bg-green-900/30 text-green-400 border border-green-700/50' 
                                                                            : 'bg-red-900/30 text-red-400 border border-red-700/50'
                                                                    }`}>
                                                                        {testCase.Passed ? "Passed" : "Failed"}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 font-mono">{testCase.Time}s</td>
                                                                <td className="px-4 py-3 font-mono">{testCase.Memory}KB</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex justify-end">
                                        <button
                                            className="bg-accent hover:bg-accent/80 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                                            onClick={() => setModalOpen(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {runOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[1000] p-4 overflow-y-auto">
                    <div className="bg-secondary border border-gray-700 rounded-lg shadow-xl max-w-xl w-full my-auto">
                        <div className="border-b border-gray-700 px-4 md:px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg md:text-xl font-semibold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                Run code
                            </h2>
                            <button 
                                onClick={() => setRunOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Custom input <span className="text-gray-400 text-xs">(will be passed to stdin)</span>
                                </label>
                                <textarea
                                    className="w-full bg-primary/50 text-white border border-gray-700 rounded-lg p-3 font-mono focus:border-accent focus:outline-none"
                                    rows={5}
                                    placeholder="Enter input for your program..."
                                    value={runInput}
                                    onChange={e => setRunInput(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 mb-4">
                                <button
                                    className="px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white hover:bg-gray-700 transition-colors"
                                    onClick={() => setRunOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-5 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/80 transition-colors flex items-center"
                                    onClick={() => {
                                        run.mutate({
                                            code: code,
                                            language: language,
                                            input: runInput,
                                        });
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    Run code
                                </button>
                            </div>
                            
                            {runResults && (
                                <div className="border border-gray-700 rounded-lg overflow-hidden">
                                    <div className="bg-primary px-4 py-3 border-b border-gray-700">
                                        <h3 className="font-medium text-white">Results</h3>
                                    </div>
                                    
                                    <div className="p-4 bg-primary/30">
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>Execution time</span>
                                                <span>Memory used</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="font-mono">{runResults.result?.Time || '-'}s</span>
                                                <span className="font-mono">{runResults.result?.Memory || '-'} KB</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-green-400"><polyline points="8 18 12 22 16 18"></polyline><path d="M12 2v20"></path></svg>
                                                    Standard output
                                                </h4>
                                                <pre className="bg-black/30 text-white/90 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                                                    {runResults.result?.Stdout || <span className="text-gray-500 italic">No output</span>}
                                                </pre>
                                            </div>
                                            
                                            {runResults.result?.Stderr && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-yellow-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                                        Standard error
                                                    </h4>
                                                    <pre className="bg-black/30 text-yellow-400 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                                                        {runResults.result.Stderr}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}