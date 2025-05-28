"use client"
import NotFound from "@/app/not-found"
import { Loading } from "@/components/Loading"
import { useChallenge } from "@/utils/queries/user/getChallenge"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"

export default function Challenge() {
    const params = useParams()
    const { challenge, loading } = useChallenge(params.slug as string)

    const [code, setCode] = useState<string>("console.log('lmao')")
    const onChange = useCallback((value: string) => {
        setCode(value)
    }, [])


    if (loading) {
        return <Loading />
    }

    if (!challenge) {
        return <NotFound />
    }

    return (
        <div className="bg-primary h-screen rounded-lg shadow-md text-white relative z-50 flex max-md:flex-col">
            <div className="w-[40%] bg-secondary h-screen">
                <div className="ml-20 p-4">
                    <a href={`/challenges/${challenge.slug}`} className="text-4xl font-bold mb-4">
                        # {challenge.title}
                    </a>
                    <section className="mb-4" dangerouslySetInnerHTML={{ __html: challenge.description }} />
                </div>
            </div>
            <div className="w-[60%] h-screen">
                <CodeMirror   
                    value={code}
                    theme="dark"
                    onChange={onChange}
                    extensions={[javascript()]}
                    height="100vh"
                    className="monocode"
                />  
                <button className="absolute bottom-4 right-4 bg-accent hover:opacity-70 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Submit
                </button>
            </div>
        </div>
    )
}