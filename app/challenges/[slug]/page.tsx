"use client"
import NotFound from "@/app/not-found"
import { Loading } from "@/components/Loading"
import { useChallenge } from "@/utils/queries/user/getChallenge"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { cpp } from "@codemirror/lang-cpp"
import { createClient } from "@/utils/supabase/client"
import { getTemplate } from "@/components/Languages"


export default function Challenge() {
    const [language, setLanguage] = useState<string>("C++")
    const params = useParams()
    const { challenge, loading } = useChallenge(params.slug as string)
    const supabase = createClient()

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
    }


    if (loading) {
        return <Loading />
    }

    if (!challenge) {
        return <NotFound />
    }

    return (
        <div className="bg-primary h-screen rounded-lg shadow-md text-white relative z-50 flex max-md:flex-col">
            <div className="w-[40%] max-md:w-[60%] bg-secondary h-screen">
                <div className="ml-20 max-md:ml-2 p-4">
                    <a href={`/challenges/${challenge.slug}`} className="text-4xl font-bold mb-4">
                        # {challenge.title}
                    </a>
                    <section className="mb-4 challenge" dangerouslySetInnerHTML={{ __html: challenge.description }} />
                </div>
            </div>
            <div className="w-[60%] max-md:w-[40%] h-screen">
                <CodeMirror
                    value={code}
                    theme="dark"
                    onChange={onChange}
                    extensions={[cpp()]}
                    height="100vh"
                    className="monocode"
                />
            </div>
            <div className="fixed bottom-0 right-0 p-4 z-[100]">
                <button
                    className="bg-accent hover:opacity-70 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    onClick={handleSubmit}
                >
                    Submit 👾
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
        </div>
    )
}