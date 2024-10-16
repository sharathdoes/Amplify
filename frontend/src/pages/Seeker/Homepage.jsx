import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoArrowUpRight } from "react-icons/go";
import { MdKeyboardArrowRight } from "react-icons/md";
import AnalyzeAnswer from "./analsye";
import OrbitingCirclesDemo from "./circles"; 
import FeedbackDrawer from "../primarycomp/Drawer";
import { useAppStore } from "@/store";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HeroSection() {
  const navigate = useNavigate();
  const leetOpen = useAppStore((state) => state.leetOpen); // Get leetOpen from store
  const setLeetOpen = useAppStore((state) => state.setLeetOpen); // Get the setter from the store
  const openLeetCodeInBackground = () => {
    // Check if LeetCode has already been opened
    if (leetOpen) {
      return; // If already open, do nothing
    }

    const newWindow = window.open(
      'https://amplify-5.onrender.com/',
      '_blank',
      'width=1,height=1,left=0,top=0,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes'
    );

    if (newWindow) {
      window.focus();
    }

    // Set the ref to true once the tab has been opened
    setLeetOpen(true); // Set leetOpen to true in the store
  };

  const handleGetStartedClick = () => {
    navigate("/resume");
    if (!leetOpen) {
      openLeetCodeInBackground();
    }
    toast.success("Ignore that tab, don't close it until it loads!", { duration: 2000 });
  };

  const handleRecruitClick = () => {
    navigate("/recruit");
    toast.success("Welcome to Amplify!", { duration: 2000 });
  };

  const handleAnalysisClick = () => {
    navigate("/anal");
    if (!leetOpenRef.current) {
      openLeetCodeInBackground();
    }
    toast.success("Ignore that tab, don't close it until it loads!", { duration: 2000 });
    toast.success("Skill Gap Analysis", { duration: 4000 });
  };

  return (
    <section className="relative w-full min-h-screen pt-48 overflow-hidden bg-gray-50">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Overpass:ital,wght@0,100..900;1,100..900&display=swap');
          .hero-section h1, .hero-section p {
            font-family: 'Karla', sans-serif;
          }
        `}
      </style>
      <div className="absolute inset-0 bg-gradient-to-br animate-gradient-xy"></div>
      <div className="container relative z-10 px-4 md:px-6 hero-section">
        <motion.div
          className="flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-4xl mt-10 font-bold tracking-tighter sm:text-5xl animate__animated animate__fadeInDown">
            Amplify careers. Boost opportunities.
          </motion.h1>
          <motion.h1 className="text-4xl font-bold tracking-tighter sm:text-5xl animate__animated animate__fadeInDown">
            Test your skills and stand out.
          </motion.h1>
          <motion.p
            className="max-w-[500px] text-gray-700 md:text-xl mt-4"
            variants={itemVariants}
          >
            From your resume through your test & referral, we've got you covered. Upload
            your resume to get started.
          </motion.p>
          <motion.div className="mt-8 flex gap-3 justify-center" variants={itemVariants}>
            <Button
              onClick={handleGetStartedClick}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full pl-5 pr-4"
            >
              Get Started{" "}
              <div className="ml-1">
                <GoArrowUpRight />
              </div>
            </Button>
            <Button
              onClick={handleRecruitClick}
              size="lg"
              className="bg-white text-black hover:bg-gray-200 hover:text-black rounded-full pl-5 pr-4"
            >
              Recruiter's Login{" "}
              <div className="ml-1">
                <MdKeyboardArrowRight />
              </div>
            </Button>
          </motion.div>
        </motion.div>

        <div className="mt-16 w-full">
          <AnalyzeAnswer className="w-full" />
        </div>

        {/* New Section: Skill Gap Analysis */}
        <div className="mt-16 mx-auto max-w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
          <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1
                className="text-4xl font-bold tracking-tighter sm:text-4xl"
                variants={itemVariants}
              >
                Skill Gap Analysis
              </motion.h1>
              <motion.p
                className="max-w-full text-gray-700 md:text-xl mt-6"
                variants={itemVariants}
              >
                Are you worried your resume isn’t getting shortlisted? Don’t worry! Our Skill Gap Analysis helps you identify the areas you need to improve to stand out and secure your dream job.
              </motion.p>
              <motion.div className="mt-6" variants={itemVariants}>
                <Button
                  onClick={handleAnalysisClick}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full pl-5 pr-4"
                >
                  Analyze My Skills{" "}
                  <div className="ml-1">
                    <GoArrowUpRight />
                  </div>
                </Button>
              </motion.div>
            </div>
            <div className="hidden md:block">
              <OrbitingCirclesDemo />
            </div>
          </div>
        </div>

        <motion.div className="mt-16 mb-10" variants={itemVariants}>
          <p className="text-gray-700 md:text-xl text-center">
            Spend a minute or two giving <FeedbackDrawer /> it will help me a lot.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
