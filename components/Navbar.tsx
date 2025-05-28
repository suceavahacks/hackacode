"use client"
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { useUser } from "@/utils/queries/user/getUser";
import { Loading } from "./Loading";
import Avatar from "./Avatar";

const Navbar: React.FC = () => {

    var hc_links = `
        https://hackclub.com/stickers/macintosh.svg
        https://hackclub.com/stickers/2020_progress.png
        https://hackclub.com/stickers/enjoy.svg
        https://hackclub.com/stickers/2016_hack_camp.svg
        https://hackclub.com/stickers/2018_holidays.svg
        https://hackclub.com/stickers/2020_progress.png
        https://hackclub.com/stickers/2020_storm_the_hack.png
        https://hackclub.com/stickers/2021_design_awards.png
        https://hackclub.com/stickers/2023_OnBoard_hatching_orpheus.png
        https://hackclub.com/stickers/AI_safety_campfire.png
        https://hackclub.com/stickers/AI_safety_meme.png
        https://hackclub.com/stickers/Blot.png
        https://hackclub.com/stickers/FIRST_co-branded_no_ears_sticker.png
        https://hackclub.com/stickers/HackHackClub.png
        https://hackclub.com/stickers/I_❤️_HC.png
        https://hackclub.com/stickers/In-N-Out.png
        https://hackclub.com/stickers/MRT.png
        https://hackclub.com/stickers/OnBoard_holographic_sticker.png
        https://hackclub.com/stickers/Rummage.png
        https://hackclub.com/stickers/adobe.svg
        https://hackclub.com/stickers/airlines.png
        https://hackclub.com/stickers/all_fun_javascript.svg
        https://hackclub.com/stickers/anxiety.png
        https://hackclub.com/stickers/apocalypse.png
        https://hackclub.com/stickers/arcade.png
        https://hackclub.com/stickers/assemble.svg
        https://hackclub.com/stickers/black_lives_matter.svg
        https://hackclub.com/stickers/bottle_caps.png
        https://hackclub.com/stickers/burst.png
        https://hackclub.com/stickers/drake.svg
        https://hackclub.com/stickers/emergency_meeting.svg
        https://hackclub.com/stickers/enjoy.svg
        https://hackclub.com/stickers/epoch.png
        https://hackclub.com/stickers/epoch_among_us.png
        https://hackclub.com/stickers/epoch_bubbly.png
        https://hackclub.com/stickers/epoch_h.png
        https://hackclub.com/stickers/find out.png
        https://hackclub.com/stickers/friends.svg
        https://hackclub.com/stickers/game_lab.png
        https://hackclub.com/stickers/game_lab_flask.png
        https://hackclub.com/stickers/grab.png
        https://hackclub.com/stickers/hack-club-anime.png
        https://hackclub.com/stickers/hack_club_HQ.png
        https://hackclub.com/stickers/hack_in_the_club.svg
        https://hackclub.com/stickers/hack_ok_please.png
        https://hackclub.com/stickers/hack_strikes_back.svg
        https://hackclub.com/stickers/hack_to_the_future.svg
        https://hackclub.com/stickers/hackers,_assemble!.png
        https://hackclub.com/stickers/hacky_new_year.png
        https://hackclub.com/stickers/hcb.png
        https://hackclub.com/stickers/hcb_(dark).png
        https://hackclub.com/stickers/hcb_pumpkin.png
        https://hackclub.com/stickers/hcb_sticker_sheet_1.png
        https://hackclub.com/stickers/hcb_sticker_sheet_2.png
        https://hackclub.com/stickers/horizon_computer.png
        https://hackclub.com/stickers/horizon_patch.png
        https://hackclub.com/stickers/horse.png
        https://hackclub.com/stickers/inside.png
        https://hackclub.com/stickers/jetlag.png
        https://hackclub.com/stickers/jurassic_hack.png
        https://hackclub.com/stickers/log_on.png
        https://hackclub.com/stickers/logo.png
        https://hackclub.com/stickers/m_a_s_h.png
        https://hackclub.com/stickers/macintosh.svg
        https://hackclub.com/stickers/minecraft.svg
        https://hackclub.com/stickers/mo’ parts mo’ problems.png
        https://hackclub.com/stickers/nasa.svg
        https://hackclub.com/stickers/nest_hat_orpheus.png
        https://hackclub.com/stickers/nest_hatched_smolpheus.png
        https://hackclub.com/stickers/orpheus-having-boba.png
        https://hackclub.com/stickers/orpheus-skateboarding-PCB.png
        https://hackclub.com/stickers/orpheus_flag.svg
        https://hackclub.com/stickers/orpheus_goes_to_FIRST_robotics.png
        https://hackclub.com/stickers/orpheus_with_duck.png
        https://hackclub.com/stickers/orphmoji_peefest.png
        https://hackclub.com/stickers/orphmoji_scared.png
        https://hackclub.com/stickers/orphmoji_yippee.png
        https://hackclub.com/stickers/pride.svg
        https://hackclub.com/stickers/raycast.png
        https://hackclub.com/stickers/riveter.svg
        https://hackclub.com/stickers/semicolon.svg
        https://hackclub.com/stickers/ship.png
        https://hackclub.com/stickers/sinerider_blue.png
        https://hackclub.com/stickers/sinerider_pink.png
        https://hackclub.com/stickers/single neuron activated.png
        https://hackclub.com/stickers/skullpup.png
        https://hackclub.com/stickers/skullpup_boba.png
        https://hackclub.com/stickers/skullpup_pixel.png
        https://hackclub.com/stickers/sledding.png
        https://hackclub.com/stickers/some_assembly_required.png
        https://hackclub.com/stickers/sprig.svg
        https://hackclub.com/stickers/sprig_holographic.png
        https://hackclub.com/stickers/stranger_hacks.png
        https://hackclub.com/stickers/summer_of_making.svg
        https://hackclub.com/stickers/swiss_miss.png
        https://hackclub.com/stickers/the-bin.png
        https://hackclub.com/stickers/the_trail_sticker_sheet.png
        https://hackclub.com/stickers/tiktok.svg
        https://hackclub.com/stickers/tootsie_roll.png
        https://hackclub.com/stickers/undertale.svg
        https://hackclub.com/stickers/valorant.png
        https://hackclub.com/stickers/valorant_vertical.svg
        https://hackclub.com/stickers/zephyr.svg`.split("\n");

    const randomLink = hc_links[Math.floor(Math.random() * hc_links.length)];

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
            className="drawer drawer-end bg-primary relative z-50"
        >
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <div className="navbar max-h-12 bg-secondary xl:px-96 lg:px-48 md:px-10 border-b-2 border-white border-opacity-50">
                    <Link 
                        href="/" 
                        className="text-3xl flex-1 font-bold transition-transform duration-75 color ml-12 max-md:ml-2 flex items-center">
                        <img src={randomLink || "https://hackclub.com/stickers/ship.png"} alt="Hack Club Sticker" className="max-h-10 mr-2" />
                        Hackacode
                    </Link>
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