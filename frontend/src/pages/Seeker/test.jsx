import React, { useState } from "react";
import axios from "axios";

const FullscreenComponent = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const generateQuestions = async () => {
    setLoading(true);
    let allQuestions = [];

    try {
      for (let i = 0; i < 10; i++) {
        const response = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAp-XHDUyaRo_qH9LLowS_kKdY25p7-JSY",
          {
            contents: [
              {
                parts: [
                  {
                    text: `Generate 10 ${input} questions, answers, correct option (remember questions, not exact format for 10 times) in the following array format:
                    {
                      question: { type: String, required: true },
                      options: { type: [String], required: true },
                      correctOption: { type: String, required: true }
                    } i need questions , options, correct option in this format in an array, nothing else, no other text, no source`,
                  },
                ],
              },
            ],
          }
        );

        // Extract the text content from the response
        const generatedText = response.data.candidates[0].content.parts[0].text;

        // Here, you need to manually process the response if it's not valid JSON
        // Example: Use a regex to match the questions format
        const regex = /{[\s\S]*?}/g; // A simple regex to match the JSON-like objects
        const matches = generatedText.match(regex);
        
        if (matches) {
          matches.forEach((match) => {
            try {
              // Safely parse each match
              const questionObj = eval(`(${match})`);
              allQuestions.push(questionObj);
            } catch (err) {
              console.warn('Skipping invalid JSON-like object', err);
            }
          });
        }
      }

      // Log the final output with 100 questions
      console.log(allQuestions);
      setQuestions(allQuestions);
    } catch (error) {
      console.error("Error generating questions:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Question Generator</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter topic (e.g., fullstack development)"
        className="p-2 border border-gray-300 rounded mb-4 w-full max-w-md"
      />
      <button
        onClick={generateQuestions}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate 100 Questions"}
      </button>
    </div>
  );
};

export default FullscreenComponent;
