"use client";
import { useState, useEffect, useRef } from "react";

export default function WebSocketPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [wsStatus, setWsStatus] = useState("disconnected");
  const socketRef = useRef(null);

  useEffect(() => {
    // إنشاء اتصال WebSocket
    socketRef.current = new WebSocket("wss://echo.websocket.org/.ws");

    socketRef.current.onopen = () => {
      setWsStatus("connected");
      setMessages((prev) => [
        ...prev,
        { text: "تم الاتصال بخادم WebSocket!", type: "system" },
      ]);
    };

    socketRef.current.onmessage = (event) => {
      setMessages((prev) => [...prev, { text: event.data, type: "received" }]);
    };

    socketRef.current.onclose = () => {
      setWsStatus("disconnected");
      setMessages((prev) => [
        ...prev,
        { text: "تم قطع الاتصال بالخادم", type: "system" },
      ]);
    };

    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(input);
      setMessages((prev) => [...prev, { text: input, type: "sent" }]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const reconnect = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    setWsStatus("connecting");
    setMessages((prev) => [
      ...prev,
      { text: "جارٍ الاتصال بالخادم...", type: "system" },
    ]);

    socketRef.current = new WebSocket("wss://echo.websocket.org");
  };

  return (
    <div className="websocket-page">
      <div className="page-header">
        <h1>خادم WebSocket Echo</h1>
        <p>اتصال في الوقت الحقيقي مع خادم WebSocket</p>
      </div>

      <div className="connection-panel">
        <div className="connection-status">
          <div className={`status-indicator ${wsStatus}`}></div>
          <span>
            الحالة:{" "}
            {wsStatus === "connected"
              ? "متصل"
              : wsStatus === "disconnected"
              ? "غير متصل"
              : "جارٍ الاتصال"}
          </span>
        </div>

        <button
          onClick={reconnect}
          className="btn reconnect-btn"
          disabled={wsStatus === "connecting"}
        >
          {wsStatus === "connecting" ? "جارٍ الاتصال..." : "إعادة الاتصال"}
        </button>
      </div>

      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اكتب رسالة..."
          disabled={wsStatus !== "connected"}
        />
        <button
          onClick={sendMessage}
          disabled={wsStatus !== "connected" || !input.trim()}
          className="btn send-btn"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
