"use client";

import { useEffect, useRef, useState } from "react";

function page() {
  const messageRef = useRef();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [displayMessage, setDisplayMessage] = useState("Hi there!");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const prompt = messageRef.current.value;

    setLoading(true);

    let newMessageList = [
      ...messages,
      {
        role: "user",
        content: prompt,
      },
    ];

    try {
      const response = await fetch("/api/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessageList }),
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      newMessageList.push({
        role: data.response.message.role,
        content: data.response.message.content,
      });

      setMessages(newMessageList);
      setDisplayMessage(data.response.message.content);
      messageRef.current.value = "";
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto max-w-4xl">
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <label className="font-bold">Say something..</label>
          <input
            className="px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border border-gray-700 rounded-lg"
            required
            type="text"
            ref={messageRef}
            placeholder="Ask a question or say something nice."
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 mt-2 text-gray-700 bg-gray-100 border border-gray-700 rounded-lg hover:scale-110 transition-all duration-200"
        >
          Ask Question
        </button>
      </form>

      <div className="mt-6">
        {messages.map((message) => {
          return (
            <div key={message.content} className="flex items-center gap-4 py-2">
              <div className="w-[10%] flex items-center">
                {message.role === "assistant" ? (
                  <div className="text-lg font-bold">bot:</div>
                ) : (
                  <div className="text-xl font-bold">You:</div>
                )}
              </div>

              <div className="bg-gray-100 py-2 px-4 border border-gray-400 rounded-xl">
                {message.content}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default page;
