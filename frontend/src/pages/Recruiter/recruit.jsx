import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // ShadCN Dialog
import { Button } from "@/components/ui/button"; // ShadCN Button
import ab from "@/assets/mic.jpg";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/apiClient";
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

export default function Recruit() {
  const [companyName, setCompanyName] = useState("");
  const [dialogMessage, setDialogMessage] = useState(""); // State to hold the dialog message
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control the dialog visibility
  const navigate = useNavigate();
  const { SeekerInfo, setSeekerInfo } = useAppStore((state) => ({
    SeekerInfo: state.SeekerInfo,
    setSeekerInfo: state.setSeekerInfo,
  }));
  const { userInfo, setUserInfo } = useAppStore((state) => ({
    userInfo: state.userInfo,
    setUserInfo: state.setUserInfo,
  }));

  useEffect(() => {
    if (userInfo) {
      navigate("/rprofile");
    }
  }, [userInfo, navigate]);

  const onSuccess = async (res) => {
    const accessToken = res.access_token;

    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userInfo = await userInfoResponse.json();

      const userId = userInfo.sub;

      const response = await apiClient.post(
        "/api/signin",
        { tokenId: userId, companyName }
      );

      if (response.status === 201) {
        setUserInfo(response.data.user);
        navigate("/rprofile");
      }
    } catch (error) {
      console.error("Error signing in:", error.response?.data || error.message);
    }
  };

  const onFailure = (error) => {
    console.error("Login Failed:", error);
  };

  const signIn = useGoogleLogin({
    onSuccess,
    onFailure,
    scope: "openid email profile",
    flow: "implicit",
  });

  const handleSignInClick = () => {
    if (SeekerInfo.tokenID != null) {
      setDialogMessage("You have to sign out before that.");
      setIsDialogOpen(true);
      return;
    }
    if (!companyName.trim()) {
      setDialogMessage("Please enter a company name before signing in.");
      setIsDialogOpen(true);
      return;
    }
    signIn();
  };
  const handleSignInClickk = () => {
    if (SeekerInfo.tokenID != null) {
      setDialogMessage("You have to sign out before that.");
      setIsDialogOpen(true);
      return;
    }

    signIn();
  };

  return (
    <section className="relative bg-gray-50 w-full min-h-screen pt-56 overflow-hidden ">
      <div className="absolute inset-0 bg-gradient-to-br animate-gradient-xy"></div>
      <div className="container relative z-10  ">
        <motion.div
          className="flex flex-col lg:grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="lg:col-span-3 " variants={itemVariants}>
            <h1 className="text-4xl mr-40 font-bold tracking-tighter sm:text-5xl text-center mb-4 animate__animated animate__fadeInDown">
              Recruiter Sign-in
            </h1>
            <p className="mt-4 ml-6 text-xl text-gray-600 text-center">
              Sign in with Google for a Streamlined Recruitment Process
            </p>
            <div className="mt-5 lg:mt-8 flex flex-col sm:items-center gap-4 sm:flex-row sm:gap-4">
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
                className="w-full bg-white ml-8 sm:w-auto"
              />
              <Button
                onClick={handleSignInClick}
                className=" text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Sign In with Google
              </Button>
            </div>
            {" "}
          </motion.div>
          <motion.div
            className="lg:col-span-4 mt-[-40px]"
            variants={itemVariants}
          >
            <img
              src={ab}
              alt="Hiring illustration"
              className="w-full h-auto max-w-[700px] max-h-[540px] rounded-xl"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Dialog Component */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Alert</DialogTitle>
          <DialogDescription>{dialogMessage}</DialogDescription>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
