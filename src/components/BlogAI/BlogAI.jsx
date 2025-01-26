import React, { useState } from "react";
import AiService from "./BlogAIService.js";

const ChatComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await AiService.sendPrompt({ prompt });
      setResponse(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded w-full max-w-md mx-auto">
      <h1 className="text-lg font-bold mb-4">AI Chat</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        placeholder="Type your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
      />
      <button
        className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>
      {response && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h2 className="font-semibold">Response:</h2>
          <p>{response.result}</p>
        </div>
      )}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default ChatComponent;
