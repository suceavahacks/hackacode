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

        const response = await fetch("http://157.180.71.65:1072/api/v1", {
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

        const { data: submissionInsert, error: submissionError } = await supabase
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
                <Panel className="flex-1">
                    <div className="overflow-y-auto">
                        <div className="ml-20 max-md:ml-2 p-4">
                            <a href={`/challenges/${challenge.slug}`} className="text-4xl font-bold mb-4">
                                # {challenge.title}
                            </a>
                            <section className="mb-4 challenge" dangerouslySetInnerHTML={{ __html: challenge.description }} />
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] transform transition-all duration-300 ease-in-out">
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
                                                {results.results.map((testCase : any, index: number) => (
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