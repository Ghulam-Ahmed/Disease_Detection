import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import botImg from "../Images/Bot.png";
import "./BotButton.css";

const ChatbotButton = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    navigate("/chatpage");
  };

  if (location.pathname === "/chatpage") {
    return null;
  }

  return (
    visible && (
      <div className="chatbot-button" onClick={handleClick}>
        <button>
          <img src={botImg} alt="Chatbot" />
        </button>
      </div>
    )
  );
};

export default ChatbotButton;
