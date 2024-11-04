import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast as ToastifyToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [gender, setGender] = useState("male");
  const [msg /* , setMsg */] = useState("");

  const handleBtnClick = async () => {
    try {
      let signUp_Api = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: JSON.stringify({ name, age, gender, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (signUp_Api.status === 409) {
        // setMsg("Email is already registered. Please use a different email.");
        ToastifyToast.error(
          "Email is already registered. Please use a different email."
        );
      } else if (signUp_Api.ok) {
        ToastifyToast.success(
          "Registration successful. A verification email has been sent to your account."
        );
        setName("");
        setAge("");
        setGender("male");
        setEmail("");
        setPass("");
      } else {
        // setMsg("An error occurred. Please try again.");
        ToastifyToast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      // setMsg("An unexpected error occurred. Please try again.");
      ToastifyToast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div id="header">
      <div id="form">
        <h1>Sign Up</h1>

        <label id="headings">
          Name
          <input
            type="text"
            className="inpt"
            required
            placeholder="Enter Name Here."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="age-gender">
          <input
            type="number"
            className="inpt"
            id="age"
            placeholder="Enter Age Here."
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <div className="inpt" id="gender">
            <label className="genderlebel">
              Gender
              <div className="mf">
                <label>
                  <input
                    type="radio"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                  />
                  Female
                </label>
              </div>
            </label>
          </div>
        </div>

        <div className="mail">
          <label id="headings">
            Email
            <input
              type="email"
              className="inpt"
              required
              placeholder="Enter Email Here. (Abc@gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        <div className="pass">
          <label id="headings">
            Password
            <input
              type="password"
              className="inpt"
              required
              placeholder="Enter Password Here."
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
          </label>
        </div>

        <div className="login">
          <Link to="/login" className="link">
            <h5>Already have an Account?</h5>
          </Link>
        </div>

        {msg && <div className="success_msg">{msg}</div>}

        <button type="button" className="btn" onClick={handleBtnClick}>
          Create Account
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}
