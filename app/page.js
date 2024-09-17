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
      console.log("data", data);

      if (data === "") {
        console.log("contenu Gemini totalement vide");
      }

      const aiMessageText = data.response[0].text;
      console.log("aiMessageText", aiMessageText);

      const aiMessage = { role: "ai", content: aiMessageText };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
    setInput("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gemini Chat</h1>
      <div style={styles.phone}>
        <div style={styles.screen}>
          <div id="chatbox" style={styles.chatbox}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={
                  message.role === "user" ? styles.userMessage : styles.aiMessage
                }
              >
                <strong>{message.role === "user" ? "Vous" : "Gemini"}: </strong>
                {message.content}
              </div>
            ))}
          </div>

          <div style={styles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Tapez votre message..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.button}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles CSS inline pour le chat
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: "2rem",
    color: "#4a90e2",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  phone: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "16px solid black",
    borderRadius: "36px",
    padding: "20px",
    width: "360px",
    height: "640px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    position: "relative",
  },
  screen: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  chatbox: {
    height: "450px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "15px",
    overflowY: "scroll",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "10px",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#daf7a6",
    padding: "10px",
    borderRadius: "15px",
    marginBottom: "10px",
    maxWidth: "80%",
    wordWrap: "break-word",
    color: "#333",
    animation: "fadeIn 0.3s ease",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    padding: "10px",
    borderRadius: "15px",
    marginBottom: "10px",
    maxWidth: "80%",
    wordWrap: "break-word",
    color: "#333",
    animation: "fadeIn 0.3s ease",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    marginRight: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    outline: "none",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "1rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  },
};
