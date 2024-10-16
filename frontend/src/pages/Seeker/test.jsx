import React, { useState } from "react";
import axios from "axios";

const FullscreenComponent = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  const generateQuestions = async () => {
    setLoading(true);
    setError("");
    let allQuestions = [];

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyA2Akt5sQLfZqAC4ol1ayeJBueLOMzBIcQ",
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
                    } I need questions, options, correct option in this format in an array, nothing else, no other text, no source.`,
                },
              ],
            },
          ],
        }
      );

      // Extract the text content from the response
      const generatedText = response.data.candidates[0]?.content?.parts[0]?.text;
      console.log(generatedText)
      // Safely parse the generated content
      const regex = /{[\s\S]*?}/g;
      const matches = generatedText.match(regex);

      if (matches) {
        matches.forEach((match) => {
          try {
            const questionObj = JSON.parse(match); // Use JSON.parse instead of eval
            allQuestions.push(questionObj);
          } catch (err) {
            console.warn("Skipping invalid JSON-like object", err);
          }
        });
      }

      setQuestions(allQuestions);
    } catch (error) {
      console.error("Error generating questions:", error);
      setError("Error generating questions. Please try again.");
    } finally {
      setLoading(false);
    }
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
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {questions.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">Generated Questions:</h2>
          <ul className="list-disc pl-5">
            {questions.map((q, index) => (
              <li key={index} className="mb-2">
                <strong>Q{index + 1}: {q.question}</strong>
                <br />
                Options: {q.options.join(", ")}
                <br />
                Correct Option: {q.correctOption}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FullscreenComponent;
