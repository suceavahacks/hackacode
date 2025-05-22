type TestCaseProps = {
    input: string
    output: string
    index: number
    group?: string
}

export const TestCase = ({ input, output, index, group }: TestCaseProps) => {
    return (
        <div className="collapse bg-seconday border">
            <input type="checkbox" />
            <div className="collapse-title font-semibold">
                Test Case {index + 1}
            </div>
            <div className="collapse-content flex flex-col gap-2">
                <span className="font-semibold">Group: {group} </span>
                <span className="font-semibold">Input:</span>
                <div className="bg-primary p-2 rounded-md">
                    <pre className="whitespace-pre-wrap">{input}</pre>
                </div>
                <span className="font-semibold">Output:</span>
                <div className="bg-primary p-2 rounded-md">
                    <pre className="whitespace-pre-wrap">{output}</pre>
                </div>
            </div>  
        </div>
    )
}