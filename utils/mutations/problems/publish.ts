import { createClient } from '@/utils/supabase/client';
import { Problem } from '@/schemas/problemSchema'

export const publishProblem = async (problem: Problem) => {
    const supabase = createClient();
    //first check if the problem already exists
    const { data: existingProblem, error: existingProblemError } = await supabase
        .from('problems')
        .select('*')
        .eq('title', problem.title)
        .single()
    
    if (existingProblemError) {
        console.error('Error checking for existing problem:', existingProblemError);
        throw new Error('Error checking for existing problem');
    }
    if (existingProblem) {
        console.log('Problem already exists:', existingProblem);
        throw new Error('Problem already exists');
    }

    const { data, error } = await supabase
        .from('problems')
        .insert(problem)
        .select('*')
        .single();
    
    if (error) {
        console.error('Error publishing problem:', error);
        throw new Error('Error publishing problem');
    }
    console.log('Problem published successfully:', data);
    return data;

}