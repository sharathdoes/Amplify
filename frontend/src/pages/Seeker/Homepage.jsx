import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FeedbackDrawer } from '../primarycomp/Drawer';
import { toast } from 'sonner'; // Import Sonner's toast function

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

  const handleGetStartedClick = () => {
    navigate('/resume');
    toast.success('Welcome to Amplify!', {
      duration: 4000, // Duration of the toast in milliseconds
    });
  };

  const handleRecruitClick = () => {
    navigate('/recruit');
    toast.success('Welcome to Amplify!', {
      duration: 4000, // Duration of the toast in milliseconds
    });
  };

  return (
    <section
      className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden "
      
    >
      <div className="absolute inset-0 bg-gradient-to-br  animate-gradient-xy"></div>
      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-4xl font-bold tracking-tighter sm:text-5xl animate__animated animate__fadeInDown">
            Amplify Opportunities
          </motion.h1>
          <motion.p className="max-w-[600px] text-gray-700 md:text-xl mt-4" variants={itemVariants}>
            From your resume through your test, we've got you covered. Upload your current resume to get started. 100% free.
          </motion.p>
          <motion.div className="mt-8 flex gap-3 justify-center" variants={itemVariants}>
            <Button onClick={handleGetStartedClick} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
            <Button onClick={handleRecruitClick} size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Recruit
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Feedback Drawer */}
      <FeedbackDrawer />
    </section>
  );
}
