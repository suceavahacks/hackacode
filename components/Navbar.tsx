"use client"
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { useUser } from "@/utils/queries/user/getUser";
import { Loading } from "./Loading";

const Navbar: React.FC = () => {
    const links = [
        { link: "/challenges", placeholder: "Challenges" },
        { link: "/learn", placeholder: "Learn" },
        { link: "/1v1", placeholder: "1 vs 1" },
    ];

    const { user, loading: userLoading } = useUser();
    console.log(user);
    return (
        <motion.div
            className="drawer drawer-end lg:w-[60%] mx-auto lg:p-5"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <div className="navbar bg-base-100 px-4 lg:rounded-lg">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                    </div>
                    <Link href="/" className="text-3xl flex-1 font-bold hover:rotate-1 transition-transform duration-75" style={{ color: '#FF865B' }}>Hackacode</Link>
                    <div className="hidden lg:flex">
                        <ul className="menu menu-horizontal">
                            {links.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.link}
                                        className="hover:underline text-lg hover:bg-transparent decoration-[#FF865B] underline-offset-4 hover:decoration-wavy"
                                    >
                                        {link.placeholder}
                                    </a>
                                </li>
                            ))}
                            {!user ? (
                                <li key={links.length}>
                                    <a
                                        href="/signup"
                                        className="btn btn-primary text-lg hover:bg-[#FF865B] bg-[#FF865B] hover:scale-105 transition-transform duration-75 text-black"
                                    >
                                        Sign Up
                                    </a>
                                </li>
                            ) : (
                                <li key={links.length + 1}>
                                    <a
                                        href="/logout"
                                        className="btn btn-primary text-lg hover:bg-[#FF865B] bg-[#FF865B] hover:scale-105 transition-transform duration-75 text-black"
                                    >
                                        Logout
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    {links.map((link, index) => (
                        <li key={index}>
                            <a
                                href={link.link}
                                className="hover:underline text-xl hover:bg-transparent decoration-[#FF865B] underline-offset-4 hover:decoration-wavy"
                            >
                                {link.placeholder}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

export default Navbar;
