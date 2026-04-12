import { useState, useEffect } from "react";
import { motion, easeInOut, Variants } from "framer-motion";

// Typing animation settings
const fullTitle = "Welcome To Nexgen Learning Institute Of Technology";
const typingSpeed = 50;

import { Comfortaa } from "next/font/google";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "700"], // You can adjust weights
  display: "swap",
});
// Variants for main container
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, staggerChildren: 0.2, staggerDirection: -1 },
  },
};

// Variants for text
const textVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// Icon animation
const iconVariants: Variants = {
  hidden: { scale: 0, opacity: 0, rotate: -180 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 15 },
  },
  exit: { scale: 0, opacity: 0, rotate: 180, transition: { duration: 0.3 } },
};

// Flashing subtitle
const flashVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [1, 0.6, 1],
    transition: {
      repeat: Infinity,
      repeatType: "loop" as const,
      duration: 2,
      ease: easeInOut,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const WelcomeAnimation = () => {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      const nextChar = fullTitle[i];
      if (nextChar) {
        setTypedText((prev) => prev + nextChar);
        i++;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-800 to-fuchsia-700 px-6 text-white ${comfortaa.className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* SVG Icon */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="mb-8 h-20 w-20 text-pink-300 drop-shadow-lg md:h-24 md:w-24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        variants={iconVariants}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </motion.svg>

      {/* Animated Typing Title */}
      <motion.h1
        className="max-w-3xl text-center text-3xl font-extrabold tracking-tight text-fuchsia-100 drop-shadow-md md:text-4xl lg:text-5xl"
        variants={textVariants}
      >
        {typedText}
        <span className="animate-pulse text-pink-400">|</span>
      </motion.h1>

      {/* Flashing Subtitle */}
      <motion.p
        className="mt-4 max-w-2xl text-center text-lg font-semibold text-indigo-200 md:text-xl"
        variants={textVariants}
      >
        <motion.span variants={flashVariants} animate="visible">
          Affiliated by Wits Education
        </motion.span>
      </motion.p>
    </motion.section>
  );
};

export default WelcomeAnimation;
