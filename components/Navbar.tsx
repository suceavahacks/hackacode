"use client"
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";


const Navbar: React.FC = () => {
    const links = [
        {
            "link": "/lorem1",
            "placeholder": "Lorem 1"
        },
        {
            "link": "/lorem2",
            "placeholder": "Lorem 2"
        },
        {
            "link": "/lorem3",
            "placeholder": "Lorem 3"
        },
    ]

    return (
        <motion.nav
            className="bg-[#091319] h-[64px] w-[70%] mx-auto mt-10 rounded-lg flex items-center p-5 justify-between"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }} 
        >
            <Link href="/" className="text-3xl font-bold hover:-rotate-3 transition-transform duration-75" style={{ color: '#FF865B' }}>Hackacode</Link>
            <div className="flex gap-20">
                {links.map((link, i) => (
                    <Link className="hover:underline decoration-wavy decoration-[#FF865B]" href={link.link} key={`link-${i}`}>{link.placeholder}</Link>
                ))}
            </div>
            <Link
                className="hover:bg-[#FF865B] hover:text-black transition-all duration-200 ease-in-out rounded-lg p-2"
                href={"/signin"}
            >
                Sign Up →
            </Link>
        </motion.nav>
    );
};

export default Navbar;
