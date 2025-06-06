"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/utils/queries/user/getUser";
import { Loading } from "@/components/Loading";
import NotFound from "@/app/not-found";
import { useEffect, useState } from "react";

const Submission = () => {
    const { id } = useParams();
    const { user, loading } = useUser();
    const [submission, setSubmission] = useState<any>(null);

    if(loading) {
        return <Loading />
    }
    if(!user) {
        return <NotFound />
    }

    const getSubmission = async (id : string) => {
        try {
            const submission = user.submissions || [];
            const submissionData = submission.find((sub: any) => sub.id === id);
            if (!submissionData) {
                return null;
            }
            setSubmission(submissionData);
        }catch (error) {
            return null;
        }
    }

    useEffect(() => {
        if (id) {
            getSubmission(id as string);
        }
    }, [id]);

    if (!submission) {
        return <NotFound />
    }

    return (
        <div className="ml-20"></div>
    );
}


export default Submission;