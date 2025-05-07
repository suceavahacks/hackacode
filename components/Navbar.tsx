import Link from "next/link";
import React from "react";

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
        <nav className="bg-[#091319] h-[64px] w-[70%] mx-auto mt-10 rounded-lg flex items-center p-5 justify-between">
            <Link href="/" className="text-3xl font-bold hover:-rotate-3 transition-transform duration-75" style={{ color: '#FF865B' }}>Hackacode</Link>
            <div className="flex gap-20">
                {links.map((link, i) => (
                    <Link className="hover:underline decoration-wavy decoration-[#FF865B]" href={link.link} key={`link-${i}`}>{link.placeholder}</Link>
                ))}
            </div>
            <Link
                className="hover:bg-[#FF865B] hover:text-black transition-all duration-200 ease-in-out rounded-lg p-2"
                href={"/sign-up"}
            >
                Sign Up →
            </Link>
        </nav>
    );
};

export default Navbar;
