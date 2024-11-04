import React, { useState, useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { Link } from "react-router-dom";
import Logo from "../Images/logo.svg";
import DescMain from "../DescMain/descMain";
import AnimateText from "../Page2/AnimateText";
import Hamburger, { Turn } from "hamburger-react";
import "./Nav.css";
import "./footer.css";
import "./loader.css";

export default function Nav(props) {
  const scrollRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });

    return () => {
      scroll.destroy();
    };
  }, []);

  const handleButtonClick = () => {
    setImageOpacity(imageOpacity === 1 ? 0 : 1);
    setShowText(!showText);
  };

  // const loaderTimeout = setTimeout(() => {
  //   const loader = document.getElementById("loader");
  //   setShowLoader((loader.style.top = "-100%"));
  // }, 4000);

  const loaderTimeout = setTimeout(() => {
    const loader = document.getElementById("loader");

    if (loader) {
      loader.style.top = "-100%";
      setShowLoader(true);
    }
  }, 4000);

  return (
    <>
      {showLoader && (
        <div id="loader">
          <h1>Diagno</h1>
          <h1>Tech</h1>
          <h1>Hub</h1>
        </div>
      )}

      <div ref={scrollRef} data-scroll-container>
        <div id="main">
          <div id="page1">
            <nav>
              <img
                src={Logo}
                alt="#"
                className="image"
                style={{ opacity: imageOpacity }}
              />

              <div id={showText ? "n2" : "n2-p1"} className="nav-part2">
                <h4>
                  <a href="#">{props.title1}</a>
                </h4>
                <h4>
                  <Link to="/upload">{props.title2}</Link>
                </h4>
                <h4>
                  <Link to="/login">{props.title3}</Link>
                </h4>
              </div>

              <div className="hamburger-menu">
                <a href="#" onClick={handleButtonClick}>
                  <Hamburger />
                </a>
              </div>
            </nav>
            <DescMain />
          </div>
          <AnimateText />
        </div>

        <div className="page5">
          <div className="footer-top"></div>
          <div id="footer">
            <div className="top">
              <div className="left">
                <a href="#">
                  <h1>Work</h1>
                </a>
                <a href="#">
                  <h1>Studio</h1>
                </a>
                <a href="#">
                  <h1>Contact</h1>
                </a>
              </div>
              <div className="right">
                <p className="p1">
                  Get industry insights and creative
                  <br />
                  inspiration straight to your inbox.
                </p>
                <input
                  className="email"
                  type="email"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="animation">
              <div className="c1">
                <div className="d1"></div>
                <div className="d2"></div>
                <div className="d3"></div>
              </div>
            </div>

            <div className="mid">
              <h1 className="p5_h1">DiagnoTechHub</h1>
            </div>

            <div className="bottom">
              <div className="line"></div>
              <div className="links">
                <p className="link" href="#">
                  Copyright © DiagnoTechHub
                </p>
                <a className="link" href="#">
                  BZQ
                </a>
                <a className="link" href="#">
                  Instagram
                </a>
                <a className="link" href="#">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
