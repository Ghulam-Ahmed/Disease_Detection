import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import BotImage from "../Images/doctors.png";
import CustomLoader from "./CustomLoader";
import { Link } from "react-router-dom";
import "./ChatPage.css";

export default function Bot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = {
      type: "human",
      content: input,
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      const botMessage = {
        type: "bot",
        content: data.answer,
      };

      setMessages([...messages, newMessage, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const checkStatus = () => {
    let isActive = true;
    const date = new Date();
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dateTime = `${days[day]}, ${months[month]}, ${day} ${year}`;
    if (dateTime === "Tuesday, July 09 2024") {
      isActive = false;
    }

    const status = document.querySelector(".status");

    if (isActive) {
      status.innerHTML = "Active";
      status.className = "status-active";
    } else {
      status.innerHTML = "Not Active";
      status.className = "status-false";
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="bot-container">
      <div className="back">
        <Link to="/">
          <button className="Back-btn">
            <svg
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 1024 1024"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </svg>
          </button>
        </Link>
      </div>

      <div className="app">
        <div className="wrappers">
          <div className="contents">
            <div className="headers">
              <div className="imgs">
                <img src={BotImage} alt="Chatbot" />
              </div>
              <div className="rights">
                <div className="name" id="btn-shine">
                  Chatbot
                </div>
                <div className="status">Active</div>
              </div>
            </div>

            <div className="mains">
              <div className="main-content">
                <div className="messages">
                  {messages.map((message, index) => (
                    <div key={index} className={`${message.type}-message`}>
                      {message.content}
                    </div>
                  ))}
                  {isLoading && <CustomLoader />}{" "}
                </div>
              </div>
            </div>

            <div className="bottom">
              <div className="btm">
                <div className="inputs">
                  <input
                    type="text"
                    id="input"
                    placeholder="Enter Your Query."
                    autoComplete="off"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="btn">
                  <button onClick={handleSendMessage}></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
