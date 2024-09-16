"use client";  

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    
    if (input.trim() === "") return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
        
      });

      const data = await res.json();
      console.log("data",data)

      if (data === ""){
        console.log("contenue gemini totalement vide zinzin")
      }

      const aiMessageText = data.response[0].text;
      console.log("aiMessageText", aiMessageText)

      const aiMessage = { role: "ai", content: aiMessageText };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
    console.log("message entré par utilisateur", messages)
    setInput("");
  };

  return (
    <div>
      <h1>Gemini Chat</h1>
      <div id="chatbox" style={{ height: "400px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((message, index) => (
          <div key={index} style={{ margin: "10px 0" }}>
            <strong>{message.role === "user" ? "Vous" : "Gemini"}:</strong> {message.content}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Tapez votre message"
          style={{ width: "80%", padding: "10px" }}
        />
        <button onClick={sendMessage} style={{ padding: "10px", marginLeft: "10px" }}>Envoyer</button>
      </div>
    </div>
  );
}
