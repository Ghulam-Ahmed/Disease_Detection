import React, { useState } from "react";
import "./boxHover.css";
import Page4 from "../Page4/swipper";
import atelectasis from "./00000109_003.png";
import cardiomegaly from "./00014449_001.png";
import effusion from "./00000011_000.png";
import healthy from "./00030802_000.png";

export default function BoxHover() {
  const [hoveredImage, setHoveredImage] = useState(null);

  const handleMouseMove = (img) => {
    setHoveredImage(img);
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  return (
    <>
      <div
        id="fixed-img"
        style={{
          backgroundImage: `url(${hoveredImage})`,
          display: hoveredImage ? "block" : "none",
        }}
      ></div>

      <div id="page3">
        <div className="heading">
          <div className="circle"></div>
          <h2>X-Rays</h2>
        </div>
        <div className="container">
          <div
            className="box"
            onMouseMove={() => handleMouseMove(atelectasis)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="content" id="b1"></div>
            <h2>Atelectasis</h2>
          </div>

          <div
            className="box"
            onMouseMove={() => handleMouseMove(cardiomegaly)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="content"></div>
            <h2>Cardiomegaly</h2>
          </div>

          <div
            className="box"
            onMouseMove={() => handleMouseMove(effusion)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="content"></div>
            <h2>Plueral Effusion</h2>
          </div>

          <div
            className="box"
            onMouseMove={() => handleMouseMove(healthy)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="content"></div>
            <h2>Healthy Person</h2>
          </div>
        </div>
      </div>
      <Page4 />
    </>
  );
}
