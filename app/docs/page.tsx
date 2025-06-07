"use client";

import React, { useState } from "react";
import { BookOpen, Code, Zap, Terminal, Bot, Award, Shield, ListTodo } from "lucide-react";
import Link from "next/link";

const sections = [
	{
		title: "How to use Hackacode",
		icon: BookOpen,
		content: [
			{
				title: "Getting started",
				description: `Follow these steps to get the most out of Hackacode as a new user.`,
				subsections: [
					{
						title: "1. Create an account",
						items: [
							"Go to the <a href='signup' class='color decoration-wavy hover:underline'>Sign Up</a> page and register with your email or Google/Slack/GitHub account.",
							"Verify your email if required.",
							"Complete your profile (add a username, avatar, and select your favorite languages) for a better experience.",
						],
					},
					{
						title: "2. Explore challenges",
						items: [
							"Browse the challenges page to see available problems.",
							"(i promise soon I will put filters and categories)",
							"Click on a challenge to view its description, constraints, and examples.",
						],
					},
					{
						title: "3. Solve and submit",
						items: [
							"Use the built-in code editor to write your solution.",
							"Select your preferred language from the dropdown.",
							"Click 'Submit' to run your code against all test cases.",
							"Ask Luigi (AI) for help or code review by hovering on him",
							"View instant feedback: passed/failed cases, score, runtime, and memory usage.",
						],
					},
					{
						title: "4. Compete in duels",
						items: [
							"Go to the Duels page to create or join a duel.",
							"Share the duel code with a friend or join an existing duel.",
							"Both users solve the same challenge in real-time. The one with the highest score wins.",
							"You can chat with your opponent during the duel.",
						],
					},
					{
						title: "5. Use the CLI (optional)",
						items: [
							"Install the CLI: curl https://hackacode.xyz/download | bash",
							"Set your API key from your Settings page.",
							"Use commands like hackacode --challenge sum --file main.cpp --language C++ to submit solutions directly from your terminal.",
						],
					},
					{
						title: "6. Use the Daily calendar",
						items: [
							"Go to the <a href='/daily' class='color decoration-wavy hover:underline'>Daily</a> page to see your challenge calendar.",
							"Each day, a new challenge is unlocked. Complete it to keep your streak.",
							"Green = completed, Yellow = in progress, Red = missed.",
							"Click on a day to see challenge details.",
						]
					},
				],
			},
		],
	},
	{
		title: "Overview",
		icon: BookOpen,
		content: [
			{
				title: "What is Hackacode?",
				description: `Hackacode is an open-source competitive programming platform built with Next.js, TypeScript, and Supabase. It offers algorithmic challenges, live duels, leaderboards, daily streaks, AI code review (Luigi), CLI integration, and a high-performance code judge written in Go.`,
				subsections: [
					{
						title: "Main features",
						items: [
							"Algorithmic challenges with automatic testing and instant feedback",
							"Live duels (1v1) with timer and live scoring",
							"Daily challenges with streaks",
							"Public profile with activity, stats, and favorite languages",
							"AI code review (Luigi) for instant feedback and hints",
							"CLI for direct submit from terminal",
							"Realtime feed with latest submissions",
						],
					},
				],
			}
		],
	},
	{
		title: "Challenges & submissions",
		icon: ListTodo,
		content: [
			{
				title: "How do challenges work?",
				description:
					"Each challenge has a statement, constraints, input/output, and test cases. You can solve in multiple languages. Submissions are auto-evaluated by the Go code judger.",
				subsections: [
					{
						title: "Submission process",
						items: [
							"Write your solution in the web editor or locally (CLI)",
							"Choose the language (Python, JS, C++, Java, Go, etc)",
							"Submit: code is sent to the Go code judge",
							"Judge runs code in a sandbox, with timeout and memory limit",
							"Get instant feedback: Passed/Failed, score, runtime, memory",
							"Detailed output for each test case",
						],
					},
					{
						title: "Submission structure (db)",
						items: [
							"id: string",
							"user_id: string",
							"challenge: string (slug)",
							"language: string",
							"timestamp: ISO string",
							"status: ACCEPTED/FAILED/TIMEOUT/ERROR",
							"score: number",
							"runtime: ms",
							"memory: KB",
							"result: { testcases: [{input, expected, output, passed}], logs, stderr }",
						],
					},
				],
			},
			{
				title: "Scoring & leaderboard",
				description: "Score is calculated per challenge, per user, and globally. The leaderboard updates live.",
				subsections: [
					{
						title: "Scoring algorithm",
						items: [
							"Each challenge has a max score (e.g. 100)",
							"Your score = max score if you pass all tests",,
							"Leaderboard: sum of unique challenge scores",
						],
					},
				],
			},
		],
	},
	{
		title: "Duels & realtime",
		icon: Zap,
		content: [
			{
				title: "Live duels",
				description: "You can challenge a user to a duel on a challenge. Both see the same statement, have a timer, and live submit.",
				subsections: [
					{
						title: "Duel flow",
						items: [
							"Create or accept a duel (unique code)",
							"Both join the room, timer starts",
							"Submissions are visible live (no code, just status)",
							"Winner is the one with the highest score when time runs out",
							"Statuses: pending, active, completed"
						],
					}
				],
			},
		],
	},
	{
		title: "CLI Integration",
		icon: Terminal,
		content: [
			{
				title: "Install & setup",
				description: "The official CLI allows submit, test, list challenges, and fast authentication. ONLY SUBMIT FOR NOW! SOON!",
				code: "curl https://hackacode.xyz/download | bash",
			},
			{
				title: "Configuration",
				description: "After install, set your API key from settings:",
				code: "export HACKACODE_API_KEY='your-api-key'",
			},
			{
				title: "Usage examples",
				subsections: [
					{
						title: "Submit a solution",
						items: [
							"hackacode --challenge sum --file main.cpp --language C++",
							"hackacode --challenge fibonacci --file solution.py --language Python",
						],
					},
					{
						title: "List challenges",
						items: [
							"hackacode --list-challenges /soon",
							"hackacode --search 'dynamic programming /soon'",
						],
					},
				],
			},
		],
	},
	{
		title: "AI: Luigi",
		icon: Bot,
		content: [
			{
				title: "What is Luigi?",
				description: "Luigi is the platform's AI, based on Llama 4 Maverick, from <a href='signup' class='color decoration-wavy hover:underline'>Hack Club</a>. It can do code review, generate hints, explanations, and even solve simple challenges.",
				subsections: [
					{
						title: "Luigi features",
						items: [
							"Automatic code review on submit (optional)",
							"Hints and explanations for challenges",
							"Optimization and best practices suggestions",
							"Chat with Luigi directly in the UI.",
							"Luigi does not access other users' code",
						],
					},
				],
			},
		],
	},
	{
		title: "Security & sandbox",
		icon: Shield,
		content: [
			{
				title: "Sandboxing & Judge",
				description: "Each code is run in an isolated container (sandbox), with limited resources. No network or external filesystem access.",
				subsections: [
					{
						title: "Security measures",
						items: [
							"Timeout per test case (e.g. 2s)",
							"Memory limit (e.g. 128MB)",
							"No uncontrolled concurrent execution",
							"Source code is not kept after evaluation",
						],
					},
				],
			},
		],
	},
	{
		title: "API & extensibility",
		icon: Code,
		content: [
			{
				title: "Public API (soon)",
				description: "The platform will expose a REST API for integration with other tools or for building custom bots/statistics.",
				subsections: [
					{
						title: "Planned endpoints",
						items: [
							"GET /api/challenges - list challenges",
							"GET /api/leaderboard - global leaderboard",
							"GET /api/profile/:username - public profile data",
							"GET /api/duels - active duels",
						],
					},
				],
			},
		],
	},
	{
		title: "Contributing & best practices",
		icon: Award,
		content: [
			{
				title: "Contribute to Hackacode",
				description: "The platform is open-source! You can contribute with challenges, bugfixes, features, or even design.",
				subsections: [
					{
						title: "How to contribute?",
						items: [
							"Fork the repo on GitHub",
							"Create a new branch for your feature/bug",
							"Open a Pull Request with a clear description",
							"Follow the style and naming guide",
							"Add tests where needed",
							"All contributions are reviewed by maintainers",
						],
					},
					{
						title: "Useful links",
						items: [
							<Link key="gh" href="https://github.com/suceavahacks/hackacode" className="underline color" target="_blank">GitHub Hackacode</Link>,
						],
					},
				],
			},
		],
	},
];

type SectionContent = {
	title: string;
	description: string | React.ReactNode;
	code?: string;
	subsections?: { title: string; items: (string | React.ReactNode)[] }[];
};

const DocsPage = () => {
	const [activeSection, setActiveSection] = useState(0);

	return (
		<div className="min-h-screen bg-primary flex justify-center items-start">
		</div>
	);
};

export default DocsPage;