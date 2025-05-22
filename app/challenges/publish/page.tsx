"use client"
import NotFound from "@/app/not-found"
import { Loading } from "@/components/Loading"
import { useUser } from "@/utils/queries/user/getUser"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Problem, problemSchema } from "@/schemas/problemSchema"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { publishProblem } from "@/utils/mutations/problems/publish"
import { useState } from "react"
import { TestCase } from "@/components/TestCase"

const Publish = () => {
    const { user, loading, error } = useUser()
    const [testCases, setTestCases] = useState<{ input: string, output: string, group?: string }[]>([])
    const [testCaseError, setTestCaseError] = useState<string | null>(null)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Problem>({
        resolver: zodResolver(problemSchema)
    });     

    const handleTestCaseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                console.log(event.target?.result)
                const json = JSON.parse(event.target?.result as string)
                if (!Array.isArray(json)) {
                    setTestCaseError("Invalid JSON format. Expected an array of test cases.")
                    return
                }
                
                for(const testCase of json) {
                    if (!testCase.input || !testCase.output || typeof testCase.input !== 'string' || typeof testCase.output !== 'string') {
                        setTestCaseError("Invalid test case format. Each test case should have 'input' and 'output' properties.")
                        return
                    }
                }

                setTestCases(json)
                setTestCaseError(null)
            }catch (error) {
                console.log(error)
                setTestCaseError("Failed to parse JSON file.")
            }
        }
        reader.readAsText(file)
    }

    if (loading) return <Loading />
    if (!user) return <NotFound />


    return (
        <div className="mx-auto flex flex-col mt-20 relative z-50 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Publish a Problem</h1>
            <form
                className="flex flex-col gap-6 bg-white bg-secondary p-8 rounded-lg shadow-lg"
            >
                <div>
                    <label className="block font-semibold mb-1" htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Title"
                        {...register("title")}
                        className={`border p-2 rounded w-full ${errors.title ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                </div>
                <div>
                    <label className="block font-semibold mb-1" htmlFor="slug">Slug</label>
                    <input
                        id="slug"
                        type="text"
                        placeholder="Slug"
                        {...register("slug")}
                        className={`border p-2 rounded w-full ${errors.slug ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.slug && <span className="text-red-500 text-sm">{errors.slug.message}</span>}
                </div>
                <div>
                    <label className="block font-semibold mb-1" htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        placeholder="Description"
                        {...register("description")}
                        className={`border p-2 rounded w-full max-h-[200px] min-h-[80px] ${errors.description ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
                </div>
                <div>
                    <label className="block font-semibold mb-1" htmlFor="difficulty">Difficulty</label>
                    <select
                        id="difficulty"
                        {...register("difficulty")}
                        className={`border p-2 rounded w-full ${errors.difficulty ? "border-red-500" : "border-gray-300"}`}
                    >
                        <option value="">Select difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    {errors.difficulty && <span className="text-red-500 text-sm">{errors.difficulty.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="time_limit">Time Limit (ms)</label>
                        <input
                            id="time_limit"
                            type="number"
                            placeholder="Time Limit"
                            {...register("time_limit", { valueAsNumber: true })}
                            className={`border p-2 rounded w-full ${errors.time_limit ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.time_limit && <span className="text-red-500 text-sm">{errors.time_limit.message}</span>}
                    </div>
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="memory_limit">Memory Limit (MB)</label>
                        <input
                            id="memory_limit"
                            type="number"
                            placeholder="Memory Limit"
                            {...register("memory_limit", { valueAsNumber: true })}
                            className={`border p-2 rounded w-full ${errors.memory_limit ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.memory_limit && <span className="text-red-500 text-sm">{errors.memory_limit.message}</span>}
                    </div>
                </div>
                <div>
                    <label className="block font-semibold mb-1" htmlFor="input_description">Input Description</label>
                    <textarea
                        id="input_description"
                        placeholder="Input Description"
                        {...register("input_description")}
                        className={`border p-2 rounded w-full min-h-[60px] ${errors.input_description ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.input_description && <span className="text-red-500 text-sm">{errors.input_description.message}</span>}
                </div>
                <div>
                    <label className="block font-semibold mb-1" htmlFor="output_description">Output Description</label>
                    <textarea
                        id="output_description"
                        placeholder="Output Description"
                        {...register("output_description")}
                        className={`border p-2 rounded w-full min-h-[60px] ${errors.output_description ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.output_description && <span className="text-red-500 text-sm">{errors.output_description.message}</span>}
                </div>
                <div>
                    <label className="block font-semibold mb-1" htmlFor="constraints">Constraints</label>
                    <textarea
                        id="constraints"
                        placeholder="Constraints"
                        {...register("constraints")}
                        className={`border input p-2 rounded w-full min-h-[60px] ${errors.constraints ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.constraints && <span className="text-red-500 text-sm">{errors.constraints.message}</span>}
                </div>
                <div>
                    <label className="block font-semibold mb-1" htmlFor="notes">Notes</label>
                    <textarea
                        id="notes"
                        placeholder="Notes"
                        {...register("notes")}
                        className={`border input p-2 rounded w-full min-h-[60px] ${errors.notes ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.notes && <span className="text-red-500 text-sm">{errors.notes.message}</span>}
                </div>
                <div>
                    <label className="block font-semibold mb-1" htmlFor="solution_code">Solution Code</label>
                    <textarea
                        id="solution_code"
                        placeholder="Solution Code"
                        {...register("solution_code")}
                        className={`border p-2 rounded w-full min-h-[60px] font-mono ${errors.solution_code ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.solution_code && <span className="text-red-500 text-sm">{errors.solution_code.message}</span>}
                </div>
                <div>
                    <label className="block font-semibold mb-1" htmlFor="solution_explanation">Solution Explanation</label>
                    <textarea
                        id="solution_explanation"
                        placeholder="Solution Explanation"
                        {...register("solution_explanation")}
                        className={`border p-2 rounded w-full min-h-[60px] ${errors.solution_explanation ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.solution_explanation && <span className="text-red-500 text-sm">{errors.solution_explanation.message}</span>}
                </div>
                <input type="file" accept=".json" onChange={handleTestCaseUpload} className="mb-4" />
                {testCases.map((testCase, index) => (
                    <TestCase
                        key={index}
                        input={testCase.input}
                        output={testCase.output}
                        index={index}
                        group={testCase.group}
                    />
                ))}
                {testCaseError && <span className="text-red-500 text-sm">{testCaseError}</span>}
                <div className="flex items-center gap-2">
                    <input
                        id="is_published"
                        type="checkbox"
                        {...register("is_published")}
                        className="w-4 h-4 input"
                    />
                    <label htmlFor="is_published" className="font-semibold">Publish now</label>
                </div>
                <button
                    type="submit"
                    className="bg-primary text-white font-bold py-2 px-4 rounded transition"
                    onClick={handleSubmit((data) => {
                        publishProblem(data)
                    })}
                >
                    Publish
                </button>
            </form>
        </div>
    )
}

export default Publish