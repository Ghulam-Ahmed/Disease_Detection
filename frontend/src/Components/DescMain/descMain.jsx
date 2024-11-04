import React from "react";
import "./descMain.css";
import Video from "../VideoPage/VideoPage";

export default function descMain() {
  return (
    <>
      <div id="center">
        <div id="left">
          <h3>
            <p>
              DiagnoTechHub is a smart helper for people providing fast and
              efficient detection of disease (Atelectasis, Cardiomegaly, Pleural
              Effusion) from chest X-Ray.
            </p>
          </h3>
        </div>
        <div id="right">
          <h1>
            INSTANT <br />
            DISEASE <br />
            DETECTION
          </h1>
        </div>
      </div>
      <Video />
    </>
  );
}
