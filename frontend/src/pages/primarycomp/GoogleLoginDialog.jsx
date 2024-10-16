// GoogleLoginDialog.jsx
import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiClient } from "@/lib/apiClient";
import { useAppStore } from "../../store/index";

function GoogleLoginDialog({ isDialogOpen, setIsDialogOpen }) {
  const [name, setName] = useState("");
  const setSeekerInfo = useAppStore((state) => state.setSeekerInfo);

  const onSuccess = async (res) => {
    const accessToken = res.access_token;

    try {
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const userInfo = await userInfoResponse.json();
      const userId = userInfo.sub;

      const response = await apiClient.post("/api/Usersignin", { tokenID: userId, name });
      console.log("this is seeker side info")
      console.log(response.data.user)
      if (response.status === 201) {
        setSeekerInfo(response.data.user);
        
        setIsDialogOpen(false); // Close the dialog after successful sign-in
      }
    } catch (error) {
      console.error("Error signing in:", error.response?.data || error.message);
    }
  };

  const signIn = useGoogleLogin({ onSuccess, flow: 'implicit' });

  const handleGoogleSignIn = () => {
    if (!name.trim()) {
      toast.error("Please enter a name before signing in.");
      return;
    }
    signIn();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In to Continue</DialogTitle>
          <DialogDescription>
            Please enter your name and sign in with Google to proceed with the upload.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
          <Button className="w-full" onClick={handleGoogleSignIn}>
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GoogleLoginDialog;
