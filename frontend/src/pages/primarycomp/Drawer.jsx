import React, { useState } from "react";
import { LuPencil } from "react-icons/lu"; // Import the LuPencil icon
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
export  default function FeedbackDrawer() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const handleRatingChange = (value) => setRating(value);
  const handleFeedbackChange = (e) => setFeedback(e.target.value);
  const handleSubmit = async () => {
    try {
      const response = await apiClient.post(
        "/api/feedback",
        {
          rating,
          feedback,
        }
      );

      if (response.status === 201) {
        toast.success("Feedback submitted!", {
          duration: 4000, // Duration of the toast in milliseconds
        });
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className=" bottom-8 right-8 text-black border-2  bg-gray-50 rounded-full p-4 hover:bg-gray-100 transition duration-300">
          feedback{" "}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="pb-4">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Feedback for Amplify</DrawerTitle>
            <DrawerDescription>Your input helps us improve!</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="flex space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    variant={rating === value ? "solid" : "outline"}
                    className="rounded-full w-12 h-12"
                    onClick={() => handleRatingChange(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Feedback
              </label>
              <Textarea
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="Share your thoughts about the website..."
                rows={4}
                className="w-full mt-2"
              />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSubmit}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
