import { useMutation } from '@tanstack/react-query';

interface HandleRunProps {
    code: string;
    language: string;
    input?: string;
}

export const useRunCode = (options?: any) => {
    return useMutation<any, any, HandleRunProps>({
        mutationFn: async ({ code, language, input }: HandleRunProps) => {
            const response = await fetch("https://judger.hackacode.xyz/api/v1/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: code, 
                    language: language,
                    input: input || "",
                })
            })

            if (!response.ok) {
                throw new Error("Failed to run code");
            }
            const result = await response.json();
            return result;
        },
        ...options
    })
}