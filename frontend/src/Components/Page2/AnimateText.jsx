import React from "react";
import "./AnimateText.css";
import img1 from "./img1.jpg";
import BoxHover from "../Page3/boxHover";

export default function AnimateText() {
  return (
    <>
      <div id="animateDiseases">
        <div id="animateText">
          <div className="contain">
            <h1>Atelectasis</h1>
            <div className="circle"></div>
            <h1>Cardiomegaly</h1>
            <div className="circle"></div>
            <h1>Effusion</h1>
            <div className="circle"></div>
          </div>
          <div className="contain">
            <h1>Atelectasis</h1>
            <div className="circle"></div>
            <h1>Cardiomegaly</h1>
            <div className="circle"></div>
            <h1>Effusion</h1>
            <div className="circle"></div>
          </div>
          <div className="contain">
            <h1>Atelectasis</h1>
            <div className="circle"></div>
            <h1>Cardiomegaly</h1>
            <div className="circle"></div>
            <h1>Effusion</h1>
            <div className="circle"></div>
          </div>
        </div>

        <div id="bg-effect"></div>

        <div id="page2">
          <h1>
            Groundbreaking system which aims to make healthcare diagnostics
            accessible to everyone worldwide. Identifying diseases in Chest
            X-ray images, answering queries.
          </h1>
          <div className="page2-img">
            <img src={img1} alt="#" />
            <p>
              Explore our unique health website, simplifying X-ray image
              analysis for diagnosing diseases. With user-friendly features and
              personalized guidance, individuals can easily find answers to
              their medical questions, empowering them to make informed
              decisions about their health.
            </p>
          </div>
        </div>
      </div>
      <BoxHover />
    </>
  );
}
