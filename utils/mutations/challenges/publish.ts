import { createClient } from '@/utils/supabase/client';
import { Problem } from '@/schemas/problemSchema'

export const publishProblem = async (problem: Problem) => {
    const supabase = createClient();
    const { data: existingProblem, error: existingProblemError } = await supabase
        .from('problems')
        .select('*')
        .eq('title', problem.title)
        .single()
    
    if (existingProblem) {
        throw new Error('Problem with this title already exists');
        return null;
    }

    const { data, error } = await supabase
        .from('problems')
        .insert(problem)
        .select('*')
        .single();
    
    if (error) {
        return null;
    }
    return data;

}