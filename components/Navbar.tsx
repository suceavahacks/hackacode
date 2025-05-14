"use client"
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { useUser } from "@/utils/queries/user/getUser";
import { Loading } from "./Loading";
import Avatar from "./Avatar";

const Navbar: React.FC = () => {
    const links = [
        { link: "/challenges", placeholder: "Challenges" },
        { link: "/learn", placeholder: "Learn" },
        { link: "/1v1", placeholder: "1 vs 1" },
    ];

    const { user, loading: userLoading, error } = useUser();

    if (userLoading) {
        return (
            <Loading />
        );
    }

    return (
        <motion.div
            className="drawer drawer-end bg-primary"
        >
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <div className="navbar max-h-12 bg-secondary xl:px-96 lg:px-48 md:px-10 border-b-2 border-white border-opacity-50">
                    <Link href="/" className="text-3xl flex-1 font-bold hover:rotate-1 transition-transform duration-75 color ml-12 max-md:ml-2">Hackacode</Link>
                    <div className="flex max-md:hidden">
                        <ul className="menu menu-horizontal flex items-center justify-center">
                            {links.map((link, index) => (
                                <li key={index} className="mr-2">
                                    <a
                                        href={link.link}
                                        className="hover:underline text-lg hover:bg-transparent underline-offset-4 hover:decoration-wavy"
                                    >
                                        {link.placeholder}
                                    </a>
                                </li>
                            ))}
                            {!user && (
                                <li key={links.length}>
                                    <a
                                        href="/signup"
                                        className="btn text-lg hover:scale-105 transition-transform duration-75 text-black"
                                    >
                                        Sign Up
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="flex-none hidden max-md:block">
                        <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                    </div>
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-secondary text-base-content">
                    {links.map((link, index) => (
                        <li key={index}>
                            <a
                                href={link.link}
                                className="hover:underline text-xl hover:bg-transparent underline-offset-4 hover:decoration-wavy"
                            >
                                {link.placeholder}
                            </a>
                        </li>
                    ))}
                    {user ? (
                        <>
                            <div className="flex flex-col gap-2 mt-auto">
                                <a
                                    href="/settings"
                                    className="btn text-lg hover:scale-105 transition-transform duration-75 text-black"
                                >
                                    Settings
                                </a>
                                <a
                                    href="/logout"
                                    className="btn text-lg hover:scale-105 transition-transform duration-75 text-black"
                                >
                                    Logout
                                </a>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2 mt-auto">
                            <li>
                                <a
                                    href="/signup"
                                    className="btn text-lg hover:scale-105 transition-transform duration-75 text-black"
                                >
                                    Sign Up
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/signin"
                                    className="btn text-lg hover:scale-105 transition-transform duration-75 text-black"
                                >
                                    Sign In
                                </a>
                            </li>
                        </div>
                    )}
                </ul>
            </div>
        </motion.div>
    );
};

export default Navbar;
