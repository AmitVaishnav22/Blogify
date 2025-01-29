import React, { useState } from "react";
import AiService from "./BlogAIService.js";
import { FiCopy, FiEdit } from "react-icons/fi";

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
    <div className="p-6 bg-black shadow-lg rounded-lg border border-purple-500 text-white max-w-2xl w-full mx-auto rounded-lg shadow-lg flex flex-col h-[80vh] md:h-[90vh]">
      <h1 className="text-2xl font-bold mb-4 text-center">BlogAI</h1>
      <div className="flex-1 overflow-y-auto mb-4 p-2 space-y-4">
        {messages.length === 0 && !loading && (
            <div className="p-4 text-center text-gray-400 bg-gray-800 rounded-lg">
              Start a conversation with BlogAI!
            </div>
          )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`${msg.role === "user" ? "bg-purple-600 text-white" : "bg-gray-700 text-white"} p-3 rounded-lg max-w-xs relative flex flex-col`}>  
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
                    <div className="relative flex items-center">
                      <p className="mb-2">{msg.text}</p> 

                      {msg.role === "bot" && (
                        <div className="absolute sticky-top-0 fixed-0 top-1/2 -translate-y-1/2 right-[-40px] flex flex-col space-y-2">
                          <button
                            onClick={() => handleCopy(msg.text, index)}
                            className="p-2 rounded-full bg-gray-800 hover:bg-gray-600 text-white"
                          >
                            <FiCopy size={12} />
                          </button>
                          <button
                            onClick={() => handleEdit(index, msg.text)}
                            className="p-2 rounded-full bg-gray-800 hover:bg-gray-600 text-yellow-300"
                          >
                            <FiEdit size={12} />
                          </button>
                          {copied === index && (
                            <div className="absolute top-0 right-0 bg-purple-500 text-white p-1 text-xs rounded">
                              Copied!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
              
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

      <div className="flex flex-col space-y-2">
        <textarea
          className="w-full p-3 bg-gray-800 text-white rounded-lg"
          placeholder="Generate or summarize blog content with the help of BlogAI..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
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