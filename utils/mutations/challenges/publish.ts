import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';
import { Problem } from '@/schemas/problemSchema';

const publishProblemFn = async (problem: Problem) => {
    const supabase = createClient();
    const { data: existingProblem } = await supabase
        .from('problems')
        .select('*')
        .eq('title', problem.title)
        .single();

    if (existingProblem) {
        throw new Error('Problem with this title already exists');
    }

    const { data, error } = await supabase
        .from('problems')
        .insert(problem)
        .select('*')
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const usePublishProblem = (options?: Omit<Parameters<typeof useMutation>[0], "mutationFn">) => {
    return useMutation({
        mutationFn: publishProblemFn,
        ...options,
    });
};