import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

interface SupportFormData {
    user_id: string;
    subject: string;
    message: string;
}

const submitSupport = async (data: SupportFormData) => {
    const supabase = createClient();
    const { error } = await supabase
        .from('support')
        .insert([data]);

    if (error) {
        throw new Error('Something went wrong. Please try again.');
    }

    return true;
};

export const useSupportMutation = () => {
    return useMutation({
        mutationFn: submitSupport
    });
};