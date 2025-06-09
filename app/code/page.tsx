"use client";
import { useState, useCallback, useEffect } from "react";
import { useUser } from "@/utils/queries/user/getUser";
import { useRunCode } from "@/utils/mutations/challenges/run";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { getTemplate } from "@/components/Languages";
import { Luigi } from "@/components/Luigi";
import { Loading } from "@/components/Loading";
import NeedAuth from "@/components/NeedAuth";
import { Code2Icon, Terminal, BookOpen, Zap } from "lucide-react";

export default function CodePage() {
    const [language, setLanguage] = useState<string>("C++");
    const [code, setCode] = useState<string>(getTemplate(language));
    const [runInput, setRunInput] = useState<string>("");
    const [runResults, setRunResults] = useState<any>(null);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [showTips, setShowTips] = useState<boolean>(false);
    const { user, loading } = useUser();

    const run = useRunCode({
        onSuccess: (data: any) => {
            setRunResults(data);
            setIsRunning(false);
        },
        onError: () => {
            setIsRunning(false);
        }
    });

    useEffect(() => {
        setCode(getTemplate(language));
    }, [language]);


    const onChange = useCallback((value: string) => {
        setCode(value);
    }, []);

    const handleRunCode = () => {
        setIsRunning(true);
        setRunResults(null);
        run.mutate({
            code: code,
            language: language,
            input: runInput || " ",
        });
    };


    const languages = [
        { name: "C++", value: cpp() },
        { name: "Python", value: python() },
    ];


    if (loading) return <Loading />;
    if (!user) return <NeedAuth />;

    return (
        <div className="bg-primary text-white h-[calc(100vh-64px)] flex flex-col">
            <div className="bg-secondary border-b border-gray-700 p-4 flex flex-col md:flex-row justify-between items-start md:items-center md:ml-[64px]">
                <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
                    <h1 className="text-xl md:text-2xl font-bold flex items-center">
                        <Code2Icon className="h-6 w-6 text-accent mr-2" />
                        <span className="color">Code playground</span>
                    </h1>
                </div>
                <button
                    className="mt-3 md:mt-0 text-xs text-gray-400 hover:text-white flex items-center gap-1"
                    onClick={() => setShowTips(prev => !prev)}
                >
                    <BookOpen size={14} />
                    {showTips ? "Hide tips" : "Show tips"}
                </button>
            </div>

            {showTips && (
                <div className="bg-secondary/70 border-b border-gray-700 p-4 md:ml-[64px]">
                    <div className="max-w-3xl">
                        <h3 className="font-medium mb-2 flex items-center gap-1">
                            <Zap size={16} className="text-accent" />
                            Some quick tips for you
                        </h3>
                        <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                            <li>Select your language from the dropdown (C++ and Python supported)</li>
                            <li>Write your code in the editor and add input if needed</li>
                            <li>Click <span className="text-accent">Run code</span> to execute and see the results</li>
                            <li>Hover over Luigi in the top right to get AI help with your code</li>
                        </ul>
                    </div>
                </div>
            )}
            <div className={`flex-1 flex flex-col lg:flex-row overflow-hidden md:ml-[64px] ${showTips ? 'h-[calc(100vh-190px)]' : 'h-[calc(100vh-140px)]'}`}>
                <div className="flex-1 code-editor-container">
                    <div className="code-editor-scrollable">
                        <div className="absolute top-4 right-4 z-50">
                            <Luigi code={code} setCode={setCode} description="" />
                        </div>
                        <CodeMirror
                            value={code}
                            theme="dark"
                            onChange={onChange}
                            extensions={[language === "C++" ? cpp() : python()]}
                            className="monocode h-full"
                            height="100%"
                            basicSetup={{
                                lineNumbers: true,
                                highlightActiveLine: true,
                                highlightSelectionMatches: true,
                                bracketMatching: true,
                                autocompletion: true,
                                foldGutter: true,
                                indentOnInput: true,
                            }}
                        />
                    </div>

                    <div className="bg-secondary/90 border-t border-gray-700 p-3 px-4 flex flex-wrap md:flex-nowrap justify-between items-center">
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <div className="flex items-center">
                                <Terminal size={16} className="text-gray-400 mr-2" />
                                <select
                                    value={language}
                                    className="bg-secondary/90 text-white border border-gray-700 rounded-md py-1 px-3 text-sm focus:outline-none focus:border-accent"
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    {languages.map((lang) => (
                                        <option key={lang.name} value={lang.name}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                className="bg-accent hover:bg-accent/80 text-white px-4 py-1.5 text-sm rounded-md flex items-center ml-2 transition-all"
                                onClick={handleRunCode}
                                disabled={isRunning}
                            >
                                {isRunning ?
                                    <Loading /> :
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                        Run code
                                    </>
                                }
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-80 lg:h-full lg:w-[40%] border-t lg:border-t-0 lg:border-l border-gray-700 flex flex-col overflow-hidden">
                    <div className="bg-secondary/40 border-b border-gray-700 p-3 flex justify-between items-center">
                        <h2 className="font-medium flex items-center">
                            <Terminal size={16} className="text-accent mr-2" />
                            Input / Output
                        </h2>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <div className="p-3 border-b border-gray-700">
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                <span>Input</span> 
                                <span className="text-gray-400 text-xs ml-2">(will be passed to stdin)</span>
                            </label>
                            <textarea
                                className="w-full bg-primary/50 text-white border border-gray-700 rounded-lg p-3 font-mono focus:border-accent focus:outline-none text-sm transition-colors"
                                rows={4}
                                placeholder="Enter input for your program..."
                                value={runInput}
                                onChange={e => setRunInput(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 overflow-auto p-3">
                            <div className="mb-2 flex items-center">
                                <label className="block text-sm font-medium text-gray-300">Output</label>
                                {runResults && 
                                    <div className="ml-auto text-xs flex items-center">
                                        <span className="text-gray-400 mr-2">Time:</span>
                                        <span className="font-mono">{runResults.result?.Time || '0'}s</span>
                                        <span className="text-gray-400 mx-2">Memory:</span>
                                        <span className="font-mono">{runResults.result?.Memory || '0'} KB</span>
                                    </div>
                                }
                            </div>
                            {!runResults ? (
                                <div className="bg-primary/30 text-gray-400 rounded-lg p-4 h-full flex items-center justify-center border border-gray-700">
                                    <p>Run your code to see the output here</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-green-400"><polyline points="8 18 12 22 16 18"></polyline><path d="M12 2v20"></path></svg>
                                            Standard output
                                        </h4>
                                        <pre className="bg-black/30 text-white/90 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-40 overflow-y-auto border border-gray-800">
                                            {runResults.result?.Stdout || <span className="text-gray-500 italic">No output</span>}
                                        </pre>
                                    </div>
                                    {runResults.result?.Stderr && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-yellow-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                                Standard error
                                            </h4>
                                            <pre className="bg-black/30 text-yellow-400 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-40 overflow-y-auto border border-gray-800">
                                                {runResults.result.Stderr}
                                            </pre>
                                        </div>
                                    )}
                                    {runResults.result?.CompilationError && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-red-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                                Compilation error
                                            </h4>
                                            <pre className="bg-black/30 text-red-400 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-40 overflow-y-auto border border-gray-800">
                                                {runResults.result.CompilationError}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
