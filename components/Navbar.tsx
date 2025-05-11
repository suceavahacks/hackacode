"use client"
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
    const links = [
        { link: "/lorem1", placeholder: "Lorem 1" },
        { link: "/lorem2", placeholder: "Lorem 2" },
        { link: "/lorem3", placeholder: "Lorem 3" },
    ];

    return (
        <motion.div 
            className="drawer drawer-end lg:w-[70%] mx-auto lg:p-5"
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
                        <ul className="menu menu-horizontal px-1">
                            {links.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.link}
                                        className="underline decoration-[#FF865B] underline-offset-4 hover:decoration-[#FF865B] hover:decoration-2 transition-all duration-200 decoration-wavy"
                                    >
                                        {link.placeholder}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    {links.map((link, index) => (
                        <li key={index}>
                            <Link 
                                href={link.link}
                                className="underline decoration-[#FF865B] underline-offset-4 hover:decoration-[#FF865B] hover:decoration-2 transition-all duration-200 decoration-wavy"
                            >
                                {link.placeholder}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

export default Navbar;
