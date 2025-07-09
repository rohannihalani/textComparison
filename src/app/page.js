"use client";

import { useState } from "react";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [input2, setInput2] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input, input2 }),
    });

    const data = await res.json();
    setResult(data.similarityScore.toFixed(2) * 100 + "% similarity");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Compare Text
        </h1>
        <div className="flex gap-4 w-full justify-center">
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="flex gap-4 flex-row">
              <textarea
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
                placeholder="Type something..."
                value={input}
                rows={15}
                onChange={(e) => setInput(e.target.value)}
              />
              <textarea
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
                placeholder="Type something..."
                value={input2}
                rows={15}
                onChange={(e) => setInput2(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>

        {result && (
          <div className="mt-6 text-center text-lg text-gray-700">
            <p>{result}</p>
          </div>
        )}
      </div>
    </main>
  );
}
