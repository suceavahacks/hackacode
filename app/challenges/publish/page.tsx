"use client"
import React, { useState } from 'react'
import {
  FileText,
  Info,
  Code2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Clock,
  Target,
  Zap,
  BookOpen,
  Settings,
  Rocket,
  ChevronLeft
} from "lucide-react"
import clsx from "clsx"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { problemSchema } from "@/schemas/problemSchema"
import { ChangeEvent, useEffect } from "react"
import { publishProblem } from '@/utils/mutations/problems/publish'

const sectionConfig = [
  { icon: Info, label: "General Info", description: "Basic problem details" },
  { icon: BookOpen, label: "Description", description: "Problem statement & constraints" },
  { icon: Code2, label: "Solution", description: "Reference implementation" },
  { icon: FileText, label: "Test Cases", description: "Input/output validation" },
]

type TestCase = { input: string; output: string }

const Publish = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [testCaseError, setTestCaseError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [currentSection, setCurrentSection] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema)
  })

  useEffect(() => {
    setValue("test_cases", testCases)
  }, [testCases, setValue])

  const handleTestCaseUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        if (!Array.isArray(json)) {
          setTestCaseError("Invalid JSON format. Expected an array of test cases.")
          return
        }
        for (const testCase of json) {
          if (
            typeof testCase.input !== "string" ||
            typeof testCase.output !== "string"
          ) {
            setTestCaseError("Each test case must have 'input' and 'output' as strings.")
            return
          }
        }
        setTestCases(json)
        setTestCaseError(null)
      } catch {
        setTestCaseError("Failed to parse JSON file.")
      }
    }
    reader.readAsText(file)
  }

  const onSubmit = async (data: any) => {
    if (testCases.length === 0) {
      setTestCaseError("Please upload at least one test case.")
      return
    }
    setSubmitting(true)
    try {
      await publishProblem(data)
      setSubmitting(false)
    } catch (e) {
      setSubmitting(false)
      setSubmitError("Failed to publish problem.")
    }
  }

  const completedSections = (() => {
    const generalInfoCompleted =
      !!watch("title") &&
      !!watch("slug") &&
      !!watch("difficulty") &&
      !!watch("time_limit") &&
      !!watch("memory_limit")
    const descriptionCompleted =
      !!watch("description") &&
      !!watch("input_description") &&
      !!watch("output_description") &&
      !!watch("constraints")
    const solutionCompleted =
      !!watch("solution_code")
    const testCasesCompleted = testCases.length > 0
    return [
      generalInfoCompleted,
      descriptionCompleted,
      solutionCompleted,
      testCasesCompleted,
    ]
  })()

  const progressPercentage = (completedSections.filter(Boolean).length / completedSections.length) * 100

  return (
    <div className="min-h-screen text-white relative z-50">
      <div className="bg-secondary border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Rocket className="h-8 w-8 color" />
              <h1 className="text-3xl font-bold">Publish Challenge</h1>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Create and share your coding challenges with the community
            </p>
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm color">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-secondary rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold text-lg mb-4">Sections</h3>
                <nav className="space-y-2">
                  {sectionConfig.map((section, idx) => (
                    <button
                      key={section.label}
                      onClick={() => setCurrentSection(idx)}
                      className={clsx(
                        "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                        currentSection === idx 
                          ? "bg-accent/20 border border-accent/30" 
                          : "hover:bg-accent hover:text-black border border-transparent"
                      )}
                    >
                      <div className={clsx(
                        "p-2 rounded-lg",
                        currentSection === idx ? "bg-accent/20 text-accent" : "bg-gray-800 text-gray-400"
                      )}>
                        <section.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{section.label}</div>
                        <div className="text-xs text-gray-500">{section.description}</div>
                      </div>
                      {completedSections[idx] && (
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="bg-secondary rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-accent" />
                    <div>
                      <div className="text-sm font-medium">Difficulty</div>
                      <div className="text-xs text-gray-400 capitalize">
                        {watch("difficulty") || "Not set"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-accent" />
                    <div>
                      <div className="text-sm font-medium">Time Limit</div>
                      <div className="text-xs text-gray-400">
                        {watch("time_limit") ? `${watch("time_limit")}ms` : "Not set"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-accent" />
                    <div>
                      <div className="text-sm font-medium">Test Cases</div>
                      <div className="text-xs text-gray-400">
                        {testCases.length} cases
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {currentSection === 0 && (
                  <div className="bg-secondary rounded-xl p-8 border border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                      <Info className="h-6 w-6 color" />
                      <div>
                        <h2 className="text-xl font-semibold">General Information</h2>
                        <p className="text-gray-400 text-sm">Set up the basic details of your problem</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          Problem Title *
                        </label>
                        <input
                          type="text"
                          {...register("title")}
                          placeholder="e.g., Two Sum, Binary Tree Traversal"
                          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors"
                        />
                        {errors.title && <span className="text-red-500 text-xs">{errors.title.message as string}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          URL Slug
                        </label>
                        <input
                          type="text"
                          {...register("slug")}
                          placeholder="two-sum"
                          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors"
                        />
                        {errors.slug && <span className="text-red-500 text-xs">{errors.slug.message as string}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Difficulty Level *
                        </label>
                        <select
                          {...register("difficulty")}
                          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors"
                        >
                          <option value="">Select difficulty</option>
                          <option value="easy">🟢 Easy</option>
                          <option value="medium">🟡 Medium</option>
                          <option value="hard">🔴 Hard</option>
                        </select>
                        {errors.difficulty && <span className="text-red-500 text-xs">{errors.difficulty.message as string}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Time Limit (ms) *
                        </label>
                        <input
                          type="number"
                          {...register("time_limit", { valueAsNumber: true })}
                          placeholder="1000"
                          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors"
                        />
                        {errors.time_limit && <span className="text-red-500 text-xs">{errors.time_limit.message as string}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Memory Limit (MB) *
                        </label>
                        <input
                          type="number"
                          {...register("memory_limit", { valueAsNumber: true })}
                          placeholder="256"
                          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors"
                        />
                        {errors.memory_limit && <span className="text-red-500 text-xs">{errors.memory_limit.message as string}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {currentSection === 1 && (
                  <div className="bg-secondary rounded-xl p-8 border border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="h-6 w-6 color" />
                      <div>
                        <h2 className="text-xl font-semibold">Problem Description</h2>
                        <p className="text-gray-400 text-sm">Define the problem statement and requirements</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Problem Description *
                        </label>
                        <textarea
                          {...register("description")}
                          placeholder="Describe the problem clearly and concisely..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors resize-none"
                        />
                        {errors.description && <span className="text-red-500 text-xs">{errors.description.message as string}</span>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Input Format
                          </label>
                          <textarea
                            {...register("input_description")}
                            placeholder="Describe the input format..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors resize-none"
                          />
                          {errors.input_description && <span className="text-red-500 text-xs">{errors.input_description.message as string}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Output Format
                          </label>
                          <textarea
                            {...register("output_description")}
                            placeholder="Describe the expected output..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors resize-none"
                          />
                          {errors.output_description && <span className="text-red-500 text-xs">{errors.output_description.message as string}</span>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Constraints
                        </label>
                        <textarea
                          {...register("constraints")}
                          placeholder="List the constraints (e.g., 1 ≤ n ≤ 10^5)..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors resize-none"
                        />
                        {errors.constraints && <span className="text-red-500 text-xs">{errors.constraints.message as string}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Notes
                        </label>
                        <textarea
                          {...register("notes")}
                          placeholder="Any additional notes..."
                          rows={2}
                          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors resize-none"
                        />
                        {errors.notes && <span className="text-red-500 text-xs">{errors.notes.message as string}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {currentSection === 2 && (
                  <div className="bg-secondary rounded-xl p-8 border border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                      <Code2 className="h-6 w-6 color" />
                      <div>
                        <h2 className="text-xl font-semibold">Reference Solution</h2>
                        <p className="text-gray-400 text-sm">Provide the solution and explanation</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Solution Code *
                        </label>
                        <textarea
                          {...register("solution_code")}
                          placeholder="def solution(nums):&#10;    # Your solution here&#10;    pass"
                          rows={8}
                          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors resize-none font-mono text-sm"
                        />
                        {errors.solution_code && <span className="text-red-500 text-xs">{errors.solution_code.message as string}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Solution Explanation
                        </label>
                        <textarea
                          {...register("solution_explanation")}
                          placeholder="Explain your approach, time complexity, space complexity..."
                          rows={6}
                          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors resize-none"
                        />
                        {errors.solution_explanation && <span className="text-red-500 text-xs">{errors.solution_explanation.message as string}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {currentSection === 3 && (
                  <div className="bg-secondary rounded-xl p-8 border border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="h-6 w-6 color" />
                      <div>
                        <h2 className="text-xl font-semibold">Test Cases</h2>
                        <p className="text-gray-400 text-sm">Upload test cases to validate solutions</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-accent/50 transition-colors">
                        <div className="space-y-4">
                          <Upload className="h-10 w-10 color mx-auto" />
                          <div>
                            <h3 className="font-medium mb-2">Upload Test Cases</h3>
                            <p className="text-gray-400 text-sm mb-4">
                              Upload a JSON file containing your test cases
                            </p>
                            <label className="btn inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer font-medium">
                              <Upload className="h-4 w-4" />
                              Choose JSON File
                              <input 
                                type="file" 
                                accept=".json" 
                                onChange={handleTestCaseUpload} 
                                className="hidden" 
                              />
                            </label>
                          </div>
                        </div>
                        {testCaseError && (
                          <div className="mt-3 bg-red-900/50 border border-red-700 rounded p-3 flex items-center gap-2 justify-center">
                            <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                            <span className="text-red-300 text-sm">{testCaseError}</span>
                          </div>
                        )}
                      </div>
                      {testCases.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-accent" />
                              Test Cases ({testCases.length})
                            </h3>
                          </div>
                          <div className="space-y-3 max-h-80 overflow-y-auto">
                            {testCases.map((testCase, index) => (
                              <div
                                key={index}
                                className="bg-primary border border-gray-800 rounded-lg p-4"
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-primary text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <span className="font-medium">Test Case {index + 1}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                                      <Zap className="h-3 w-3" />
                                      INPUT
                                    </div>
                                    <pre className="bg-secondary border border-gray-800 rounded p-2 text-xs overflow-x-auto">
                                      {testCase.input}
                                    </pre>
                                  </div>
                                  <div>
                                    <div className="text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                                      <Target className="h-3 w-3" />
                                      EXPECTED OUTPUT
                                    </div>
                                    <pre className="bg-secondary border border-gray-800 rounded p-2 text-xs overflow-x-auto">
                                      {testCase.output}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                      currentSection === 0
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <div className="flex items-center gap-3">
                    {currentSection < 3 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentSection(Math.min(3, currentSection + 1))}
                        className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className={clsx(
                          "flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all",
                          submitting
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "btn hover:scale-105"
                        )}
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-white rounded-full"></div>
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4" />
                            Publish Problem
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Publish