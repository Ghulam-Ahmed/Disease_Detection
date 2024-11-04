import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./login.css";

const LogInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   const log = localStorage.getItem("user");
  //   if (log) {
  //     navigate("/");
  //   }
  // }, []);

  const loginHandle = async () => {
    // console.log(email, password);
    let logResult = await fetch("http://localhost:5000/login", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    logResult = await logResult.json();
    // console.log(logResult);

    if (logResult.name) {
      localStorage.setItem("user", JSON.stringify(logResult));
      navigate("/upload");
    } else {
      toast.error("Please Enter Correct Email or Password");
    }
  };

  return (
    <div className="header">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="wrapper">
        <h1>Login</h1>
        <div className="input">
          <input
            type="Email"
            placeholder="Enter Your Email."
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="react-icon" />
        </div>

        <div className="input">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="react-icon" />
        </div>

        <div id="btns">
          <Link to="/signup" className="dha">
            Don't have Account?
          </Link>

          <button type="submit" onClick={loginHandle}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
