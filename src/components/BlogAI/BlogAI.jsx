import React, { useState } from "react";
import AiService from "./BlogAIService.js";

const ChatComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null); 
  const [editing, setEditing] = useState(null); 
  const [editedText, setEditedText] = useState("");

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: prompt },
    ]);
    setPrompt("");

    try {
      const data = await AiService.sendPrompt({ prompt });
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", text: data.result },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index); 
    setTimeout(() => setCopied(null), 2000); 
  };

  const handleEdit = (index, currentText) => {
    setEditing(index);
    setEditedText(currentText); 
  };

  const handleSaveEdit = (index) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      newMessages[index].text = editedText;
      return newMessages;
    });
    setEditing(null);
    setEditedText("");
  };

  return (
    <div className="p-6 bg-black text-white max-w-md mx-auto rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">BlogAI</h1>

      <div className="overflow-y-auto max-h-96 mb-4 p-2 space-y-4">
        {/* Render the chat messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-white"
              } p-3 rounded-lg max-w-xs relative`}
            >
              {editing === index ? (
                <div>
                  <textarea
                    className="w-full p-2 bg-gray-800 text-white rounded-lg mb-2"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <button
                    onClick={() => handleSaveEdit(index)}
                    className="w-full p-2 bg-purple-600 text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  {msg.text}
                  {msg.role === "bot" && (
                    <button
                      onClick={() => handleCopy(msg.text, index)}
                      className="absolute top-0 right-12 text-sm text-purple-300 hover:text-purple-500"
                    >
                      Copy
                    </button>
                  )}
                  {msg.role === "bot" && (
                    <button
                      onClick={() => handleEdit(index, msg.text)}
                      className="absolute top-0 right-0 text-sm text-yellow-300 hover:text-yellow-500"
                    >
                      Edit
                    </button>
                  )}
                  {copied === index && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-white p-1 text-xs rounded">
                      Copied!
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 p-3 rounded-lg max-w-xs">Typing...</div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <textarea
          className="w-full p-2 bg-gray-800 text-white rounded-lg mb-4"
          placeholder="Generate or summarize blog content with the help of BlogAI..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full p-3 bg-purple-600 text-white rounded-lg disabled:bg-gray-600"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default ChatComponent;
