import { MessageCircleQuestionIcon } from "lucide-react"

import { ReactNode } from "react";


//if you read this, i love you

interface CollapseProps {
    title: string;
    content: ReactNode;
}

const FAQ = () => {

    const Collapse = ({ title, content }: CollapseProps) => {

        return (
            <div tabIndex={0} className="collapse collapse-arrow bg-primary rounded-none">
                <div className="collapse-title font-semibold text-xl">{title}</div>
                <div className="collapse-content text-lg">
                    {content}
                </div>
            </div>
        )
    }

    const questions = [
        {
            title: "What is Hackacode?",
            content: "Hackacode is a platform that allows you to solve coding challenges, compete with friends, and improve your coding skills through interactive learning."
        },
        {
            title: "How do I get started?",
            content: "You can get started by signing up for an account on our website. Once registered, you can start solving challenges and participating in duels."
        },
        {
            title: "Is Hackacode free to use?",
            content: "Yes, Hackacode is free to use. It's also open-source, so you can contribute to the project if you'd like."
        },
        {
            title: "Can I contribute challenges?",
            content: "Absolutely! We welcome contributions from the community. You can submit your own challenges for others to solve. You can do that by forking the repository on GitHub and creating a pull request with your challenge on the /requests/challenges/<your-challenge> directory."
        },
        {
            title: "How can I contact support?",
            content: "If you have any questions or need assistance, you can reach out to our support team via the contact form on our website."
        },
        {
            title: "Where can I find the source code?",
            content: "The source code for Hackacode is available on GitHub at <a class='color underline decoration-wavy' href='https://github.com/suceavahacks/hackacode'>https://github.com/suceavahacks/hackacode</a>. You can clone the repository and run it locally. :)"
        },
        {
            title: "How can I report a bug?",
            content: "If you encounter any bugs or issues, please report them on our GitHub repository under the 'Issues' section. We appreciate your help in making Hackacode better!"
        },
        {
            title: "Can I use Hackacode for educational purposes?",
            content: "Yes, Hackacode is a great tool for learning and teaching coding. You can use it in classrooms or for self-study to improve your programming skills."
        },
        {
            title: "What programming languages are supported?",
            content: "Hackacode supports multiple programming languages including Python, JavaScript, Java, C++, and more. You can choose your preferred language when solving challenges."
        },
        {
            title: "How do I participate in duels?",
            content: "To participate in duels, you can challenge your friends or accept challenges from others. You can join a duel by clicking on the 'Duels' section in the sidebar and typing the code of the duel you want to join."
        },
        {
            title: "What is the leaderboard?",
            content: "The leaderboard displays the top users based on their performance in challenges and duels. You can check your ranking and see how you compare with others in the community."
        },
        {
            title: "How can I improve my coding skills?",
            content: "You can improve your coding skills by regularly solving challenges, participating in duels, and reviewing your code with our AI-powered code review feature. Additionally, you can read articles and tutorials available on our platform. (soon)."
        },
        {
            title: "What powers Luigi?",
            content: "Luigi is powered by <a class='color underline decoration-wavy' href='https://ai.hackclub.com/'>https://ai.hackclub.com/</a>. Last time I checked, the latest model was: meta-llama/llama-4-maverick-17b-128e-instruct. You can use it to generate code, review your code, or just have a chat with it. It's like having a coding buddy that never sleeps!"
        },
        {
            title: "What are daily challenges?",
            content: "Each day, we provide a new coding challenge that you can solve. These challenges are designed to help you practice and improve your coding skills. You can find the daily challenge in the 'Daily' section of the platform. Red cards indicate that you missed the challenge, and green cards indicate that you completed it. Yellow cards indicate that you are currently working on the challenge."
        }
    ];

    return (
        <div className="relative z-50 min-h-screen bg-secondary">
            <div className="bg-secondary border-b border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full blur-2xl"></div>
                </div>

                <div className="max-w-6xl mx-auto py-16 px-6 relative">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="relative">
                                <MessageCircleQuestionIcon className="h-12 w-12 color relative z-10" />
                            </div>
                            <h1 className="text-5xl font-bold color">
                                Frequently Asked Questions
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                            Here are some common questions and answers about Hackacode. If you have any other questions, feel free to reach out to us!
                        </p>
                    </div>
                </div>
            </div>
            <div className="max-w-3xl mx-auto px-4 py-8">
                {questions.map((q, index) => (
                    <Collapse
                        key={index}
                        title={q.title}
                        content={
                            <span dangerouslySetInnerHTML={{ __html: q.content }} />
                        }
                    />
                ))}
            </div>
        </div>
    )
}

export default FAQ;