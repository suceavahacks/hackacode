"use client"
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Home() {

  const refLaptop = useRef<HTMLDivElement>(null);
  const refLaptopText = useRef<HTMLDivElement>(null);

  const isInViewLaptop = useInView(refLaptop, { once: true });
  const isInViewLaptopText = useInView(refLaptopText, { once: true });

  return (
    <main className="text-center mt-20">
      <motion.span
        className="text-[48px] font-extrabold"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}

      >
        Code smarter. Solve harder.
        <span style={{ color: '#FF865B', display: 'inline-block', textAlign: 'center' }}>
          Hackacode
          <motion.img
            src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/715d41dacbd45c35484059b4e69dc02d5f71df28_line3.png"
            style={{ display: 'block', margin: '0 auto', width: '250px' }}
            alt="Line"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
        </span>
      </motion.span>
      <motion.img
        src={"https://hc-cdn.hel1.your-objectstorage.com/s/v3/877c50b3b3034492ed81b482ca015d55eb716a2b_terminal.png"}
        className="mx-auto mt-14 px-5"
        alt="Terminal"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >

      </motion.img>
      <div className="flex flex-wrap justify-between items-center mt-16 container mx-auto mb-auto">
        <div className="w-full md:w-[50%] px-5">
          <p className="text-3xl text-left">
            What is{" "}
            <span
              style={{
                color: "#FF865B",
                textDecoration: "underline",
                textDecorationColor: "#FF865B",
                textDecorationStyle: "wavy",
                textUnderlineOffset: "4px",
              }}
            >
              Hackacode
            </span>{" "}
            all 'bout?
          </p>
          <p className="text-left mt-5 text-lg">
            Hackacode is a platform meant to help you learn and practice coding in a
            <span
              style={{
                color: "#FF865B",
                textDecoration: "underline",
                textDecorationColor: "#FF865B",
                textDecorationStyle: "wavy",
                textUnderlineOffset: "4px",
              }}
            >
              {" "}
              fun and interactive way
            </span>
            . Whether you want to solve coding challenges, 1 vs 1 with your friends
            or just learn a new programming language, Hackacode is the place for you!
          </p>
          <div className="text-left mt-5 text-lg">
            <span className="text-2xl font-bold text-[#FF865B]">
              What does Hackacode offer?
            </span>
            <ul className="list-disc list-inside mt-4 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#FF865B]">✔</span>
                <span>A wide range of coding challenges to solve</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF865B]">✔</span>
                <span>A 1 vs 1 mode to challenge your friends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF865B]">✔</span>
                <span>A leaderboard to see how you stack up against other users</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF865B]">✔</span>
                <span>An interactive IDE to write your code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF865B]">✔</span>
                <span>A CLI that allows you to run your code in a terminal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF865B]">✔</span>
                <span>AI powered code review to help you improve your code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF865B]">✔</span>
                <span>Contests to compete with other users</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF865B]">✔</span>
                <span>Articles and tutorials to help you learn</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-[50%] px-5 mt-10 md:mt-0 flex justify-center">
          <motion.img
            src={
              "https://hc-cdn.hel1.your-objectstorage.com/s/v3/bba1dfde0cb6b3fe66319c947773ebd0ccca7af9_terminal.png"
            }
            className="w-full max-w-md md:max-w-full"
            alt="Picture of the web app"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-10 container mx-auto max-md:flex-col">
        <motion.div
          className="w-[50%] text-left leading-none"
          initial={{ opacity: 0, x: -50 }}
          animate={isInViewLaptopText ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          ref={refLaptopText}
        >
          <p className="font-extrabold text-[48px]">
            We know it’s tough, but with
            <span style={{ color: '#FF865B' }}> Hackacode </span>, we’ve made it simple and fun!
          </p>
        </motion.div>
        <div
          className="w-[30%]"
          ref={refLaptop}
        >
          <motion.img
            src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/e4a06e09270ddc83e06c3471a97c8701f7466efe_laptop_work.svg"
            alt="Laptop Work"
            className="w-full h-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={isInViewLaptop ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
        </div>
      </div>
      <div className="h-[400px] bg-[#FF865B] my-20 container mx-auto rounded-3xl flex justify-center items-center text-black max-md:flex">
        <p className="text-7xl p-10 pt-0 pb-0 font-bold text-left w-[50%] text-black">
          🤠 So, what are you waiting for? Join us and start coding today!
        </p>
        <p className="text-2xl p-10 pt-0 text-left w-[50%]">
           <span className="text-3xl font-bold">Sign up <br/></span>
            It would be our pleasure to have you on board!
            We are still in beta, so if you have any feedback, please let us know!
            We are always looking for ways to improve our platform and make it better for you.
            <button className="btn btn-lg rounded-lg mt-4">
              <a href="/signup" target="_blank" rel="noopener noreferrer">
                Sign up now!
              </a>
            </button>
        </p>
      </div>
    </main>
  );
}
