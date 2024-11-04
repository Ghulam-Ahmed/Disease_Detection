import React from "react";
import "./VideoPage.css";
import v2 from "./v1.mp4";

export default function VideoPage() {
  return (
    <>
      <div id="shape">
        <div id="shape1"></div>
        <div id="shape2"></div>
        <div id="shape3"></div>
      </div>

      <video autoPlay loop muted src={v2}></video>
    </>
  );
}
