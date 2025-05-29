"use client"
import NotFound from "@/app/not-found"
import { Loading } from "@/components/Loading"
import { useChallenge } from "@/utils/queries/challenges/getChallenge"
import { useParams } from "next/navigation"
import { use, useCallback, useEffect, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { cpp } from "@codemirror/lang-cpp"
import { createClient } from "@/utils/supabase/client"
import { getTemplate } from "@/components/Languages"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useUser } from "@/utils/queries/user/getUser"
interface SubmissionResult {
    status: string;
    results?: {
        Passed: boolean;
        Time: number;
        Memory: number;
    }[];
}

interface Submission {
    challenge: string;
    code: string;
    result: SubmissionResult;
    language: string;
    timestamp: string | number | Date;
}

interface UserWithSubmissions {
    submissions: Submission[];
    [key: string]: any;
}

export default function Challenge() {
    const [language, setLanguage] = useState<string>("C++")
    const params = useParams()
    const { challenge, loading } = useChallenge(params.slug as string)
    const supabase = createClient()
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [results, setResults] = useState<any>(null)
    const [loadingSubmit, setLoading] = useState<boolean>(false)
    const { user } = useUser()

    const [code, setCode] = useState<string>(getTemplate(language))
    const onChange = useCallback((value: string) => {
        setCode(value)
    }, [])

    const languages = [
        { name: "C++", value: cpp() },
        { name: "Javascript", value: javascript() },
    ]

    useEffect(() => {
        if (challenge) {
            setCode(getTemplate(language))
        }
    }, [challenge, language])

    const handleSubmit = async () => {
        const { data, error } = await supabase.auth.getSession()
        const accessToken = data.session?.access_token
        setLoading(true)

        const response = await fetch("https://judger.hackacode.xyz/api/v1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                code: code,
                slug: challenge.slug,
                language: 'C++',
                challenge: challenge.slug
            }),
        })

        if (!response.ok) {
            console.error("things are not ok", response.statusText)
            return
        }

        const result = await response.json()

        const { data: userData } = await supabase
            .from("users")
            .select("submissions")
            .eq('id', user.id)
            .single();

        const submissions = userData?.submissions || [];

        submissions.push({
            challenge: challenge.slug,
            code: code,
            result: result,
            language: language,
            timestamp: new Date()
        });

        await supabase
            .from("users")
            .update({
                submissions: submissions
            })
            .eq('id', user.id);

        setResults(result)
        setModalOpen(true)
        setLoading(false)
    }


    if (loading) {
        return <Loading />
    }

    if (!challenge) {
        return <NotFound />
    }

    return (
        <div className="bg-primary h-screen rounded-lg shadow-md text-white relative z-50 flex max-md:flex-col">
            <PanelGroup direction="horizontal">
                <Panel className="flex-1 ml-20">
                    <div role="tablist" className="tabs tabs-lifted">
                        <input type="radio" name="my_tabs_2" role="tab" className="tab w-[33%]" aria-label="Description" defaultChecked />
                        <div role="tabpanel" className="tab-content overflow-y-auto">
                            <div className="p-2 mt-10">
                                <h1 className="text-4xl font-bold mb-4">
                                    {challenge.title}
                                </h1>
                                <section className="mb-4 challenge" dangerouslySetInnerHTML={{ __html: challenge.description }} />
                            </div>
                        </div>

                        <input type="radio" name="my_tabs_2" role="tab" className="tab w-[33%]" aria-label="Submissions" />
                        <div role="tabpanel" className="tab-content overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-4">Your precious submissions</h2>
                            {user?.submissions?.filter((sub : Submission) => sub.challenge === challenge.slug).length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Language</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {(user as UserWithSubmissions).submissions
                                                .filter((sub: Submission) => sub.challenge === challenge.slug)
                                                .map((submission: Submission, idx: number) => (
                                                    <tr key={idx} className="hover">
                                                        <td>{new Date(submission.timestamp).toLocaleString()}</td>
                                                        <td>{submission.language}</td>
                                                        <td>
                                                            <span className={`badge ${submission.result.status === 'success' ? 'badge-success' : 'badge-error'}`}>
                                                                {submission.result.status}
                                                            </span>
                                                        </td>
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
                                <p>No submissions yet for this challenge.</p>
                            )}
                        </div>

                        <input type="radio" name="my_tabs_2" role="tab" className="tab w-[33%]" aria-label="Discussion" />
                        <div role="tabpanel" className="tab-content overflow-y-auto">
                        </div>
                    </div>
                </Panel>
                <PanelResizeHandle className="bg-secondary w-1 cursor-col-resize" />
                <Panel>
                    <div>
                        <CodeMirror
                            value={code}
                            theme="dark"
                            onChange={onChange}
                            extensions={[cpp()]}
                            height="100vh"
                            className="monocode"
                        />
                    </div>
                </Panel>
            </PanelGroup>

            <div className="fixed bottom-0 right-0 p-4 z-[100]">
                <button
                    className="bg-accent hover:opacity-70 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    onClick={() => {
                        handleSubmit()
                    }}
                    disabled={loading}
                >
                    {loadingSubmit ? <Loading /> : "Submit 👾"}
                </button>
            </div>
            <div className="absolute top-0 right-0 p-4 z-[100]">
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
            </div>
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] transfort ease-in-out">
                    <div className="bg-primary p-6 rounded-lg shadow-lg max-w-2xl w-full">
                        {!results?.results ? (
                            <Loading />
                        ) : (
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">
                                    Results for <span className="text-accent">{challenge.title}</span>
                                </h2>

                                <div className="bg-secondary p-3 rounded mb-4 text-left">
                                    <h3 className="font-semibold mb-2">Status:
                                        <span className={`ml-2 badge ${results.status === 'success' ? 'badge-success' : 'badge-error'}`}>
                                            {results.status}
                                        </span>
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
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