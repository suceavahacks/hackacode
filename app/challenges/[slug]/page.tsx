"use client"
import NotFound from "@/app/not-found"
import { Loading } from "@/components/Loading"
import { useChallenge } from "@/utils/queries/challenges/getChallenge"
import { useParams, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { cpp } from "@codemirror/lang-cpp"
import { python } from "@codemirror/lang-python"
import { getTemplate } from "@/components/Languages"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useUser } from "@/utils/queries/user/getUser"
import { Luigi } from "@/components/Luigi"
import { useSubmitChallenge } from "@/utils/mutations/challenges/submit"

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

    if (loading) {
        return <Loading />
    }

    if (!challenge) {
        return <NotFound />
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

    if(!user) {
      return <NotFound />
    }
    
    return (
        <div className="bg-primary rounded-lg shadow-md text-white relative z-50 flex max-md:flex-col h-[calc(100vh-64px)]">
            <PanelGroup direction="horizontal">
                <Panel className="flex-1 ml-[64px]">
                    <div className="flex flex-col h-full">
                        <div className="flex">
                          <button 
                            onClick={() => setActiveTab("description")}
                            className={`px-6 py-3 font-medium text-lg transition-all ${activeTab === "description" ? 
                              "text-accent border-b-2 border-accent" : 
                              "text-white/70 hover:text-white"}`}
                          >
                            Description
                          </button>
                          <button 
                            onClick={() => setActiveTab("submissions")}
                            className={`px-6 py-3 font-medium text-lg transition-all ${activeTab === "submissions" ? 
                              "text-accent border-b-2 border-accent" : 
                              "text-white/70 hover:text-white"}`}
                          >
                            Submissions
                          </button>
                          <button 
                            onClick={() => setActiveTab("discussion")}
                            className={`px-6 py-3 font-medium text-lg transition-all ${activeTab === "discussion" ? 
                              "text-accent border-b-2 border-accent" : 
                              "text-white/70 hover:text-white"}`}
                          >
                            Discussion
                          </button>
                        </div>
                        
                        <div className="overflow-y-auto p-4 h-full">
                          {activeTab === "description" && (
                            <div>
                              <h1 className="text-4xl font-bold mb-4">
                                # {challenge.title}
                              </h1>
                              <section className="mb-4 challenge" dangerouslySetInnerHTML={{ __html: challenge.description }} />
                            </div>
                          )}
                          
                          {activeTab === "submissions" && (
                            <div>
                              <h2 className="text-2xl font-bold mb-4">Your previous submissions</h2>
                              {user?.submissions?.filter((sub: Submission) => sub.challenge === challenge.slug).length > 0 ? (
                                <div 
                                  className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)]" 
                                >
                                  <table className="table w-full">
                                    <thead>
                                      <tr>
                                        <th>Date</th>
                                        <th>Language</th>
                                        <th>Status</th>
                                        <th>Score</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(user as UserWithSubmissions).submissions
                                        .filter((sub: Submission) => sub.challenge === challenge.slug)
                                        .map((submission: Submission, idx: number) => (
                                          <tr key={idx} 
                                            className="cursor-pointer hover:bg-secondary/20"
                                            onClick={() => window.location.href = `/submissions/${submission.id}`}
                                          >
                                            <td>{new Date(submission.timestamp).toLocaleString()}</td>
                                            <td>{submission.language}</td>
                                            <td>
                                              <span className={`badge ${submission.status == 'ACCEPTED' ? 'badge-success' : 'badge-error'}`}>
                                                {submission.status}
                                              </span>
                                            </td>
                                            <td>{submission.score}</td>
                                            <td>
                                              <button
                                                className="btn btn-xs btn-outline"
                                                onClick={() => {
                                                  setCode(submission.code);
                                                  setLanguage(submission.language);
                                                }}
                                              >
                                                Load code
                                              </button>
                                            </td>
                                          </tr>
                                        ))
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="bg-secondary/20 rounded-lg p-6 text-center">
                                  <p className="text-white/80">No submissions yet for this challenge.</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {activeTab === "discussion" && (
                            <div>
                              <h2 className="text-2xl font-bold mb-4">Discussion</h2>
                            </div>
                          )}
                        </div>
                      </div>
                </Panel>
                <PanelResizeHandle className="bg-secondary w-2 p-0 m-0 cursor-col-resize bg-accent" />
                <Panel>
                    <div className="relative h-full">
                        <div className="absolute top-4 right-4 z-50">
                          <Luigi code={code} setCode={setCode} description={challenge.description} />
                        </div>
                        <div className="h-full">
                            <CodeMirror
                                value={code}
                                theme="dark"
                                onChange={onChange}
                                extensions={[cpp()]}
                                className="monocode h-full"
                                basicSetup={{
                                    lineNumbers: true,
                                    highlightActiveLine: true,
                                }}
                                style={{ height: "100%", overflowY: "auto" }}
                            />
                        </div>
                    </div>
                </Panel>
            </PanelGroup>

            <div className="fixed bottom-0 right-0 p-4 z-[100] flex items-end gap-4">
                <button
                    className="bg-accent hover:opacity-70 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    onClick={() => {
                        handleSubmit.mutate({
                          code: code,
                          challenge: { slug: challenge.slug, time_limit: challenge.time_limit, memory_limit: challenge.memory_limit },
                          language: language,
                          user: user,
                          setResults: setResults,
                          setModalOpen: setModalOpen,
                          setLoading: setLoading,
                          daily: getValidDailyParam(),
                      })
                    }}
                    disabled={loading}
                >
                    {loadingSubmit ? <Loading /> : "Submit 👾"}
                </button>
            </div>
            <div className="absolute bottom-12 right-0 p-4 z-[100]">
                {!loadingSubmit && (
                  <select
                    defaultValue="Language" className="select bg-secondary text-white"
                    onChange={(e) => {
                        setLanguage(e.target.value);
                    }}
                >
                    <option disabled={true}>Language</option>
                    {languages.map((lang) => (
                        <option key={lang.name} value={lang.name}>
                            {lang.name}
                        </option>
                    ))}
                </select>
                )}
            </div>
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] transfort ease-in-out">
                    <div className="bg-primary p-6 rounded-lg shadow-lg max-w-2xl w-full">
                        {!results ? (
                            <Loading />
                        ) : (
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">
                                    Results for <span className="text-accent">{challenge.title}</span>
                                </h2>

                                <div className="bg-secondary p-3 rounded mb-4 text-left">
                                    <h3 className="font-semibold mb-2">Status:
                                        <span className={`ml-2 badge ${results.status === 'ACCEPTED' ? 'badge-success' : 'badge-error'}`}>
                                            {results.status}
                                        </span>
                                        <span className="ml-2 text-accent font-bold">
                                          Score: {results.score}
                                        </span>
                                    </h3>

                                    {results.status == "comp-failed" ? (
                                      <div className="alert monocode alert-error my-4 whitespace-pre-wrap">
                                        {results.message}
                                      </div>
                                    ) : (
                                      <div className="overflow-x-auto">
                                        <table className="table w-max min-w-[700px]">
                                          <thead>
                                            <tr>
                                              <th>Test Case</th>
                                              <th>Status</th>
                                              <th>Time</th>
                                              <th>Memory</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {results.results.map((testCase: any, index: number) => (
                                              <tr key={index} className="hover">
                                                <td>#{index + 1}</td>
                                                <td>
                                                  <span className={`badge ${testCase.Passed ? "badge-success" : "badge-error"}`}>
                                                    {testCase.Passed ? "Passed" : "Failed"}
                                                  </span>
                                                </td>
                                                <td>{testCase.Time}s</td>
                                                <td>{testCase.Memory}KB</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                </div>

                                <button
                                    className="btn"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}