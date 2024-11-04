import React from "react";
import "./swipper.css";
import a1 from "./avatar1.png";
import a2 from "./avatar2.png";
import a3 from "./avatar3.png";
import a4 from "./avatar4.png";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

export default function swipper() {
  return (
    <>
      <h5 className="p4_h5">
        <span className="dot"></span>
        Doctors
      </h5>
      <div id="page4">
        <Swiper
          slidesPerView={"3.5"}
          // centeredSlides={false}
          spaceBetween={100}
          className="mySwiper"
        >
          <SwiperSlide>
            <img src={a1} alt="" />
            <p>
              Doctor Name <br /> Doctor Speciality
            </p>
          </SwiperSlide>

          <SwiperSlide>
            <img src={a2} alt="" />
            <p>
              Doctor Name <br /> Doctor Speciality
            </p>
          </SwiperSlide>

          <SwiperSlide>
            <img src={a3} alt="" />
            <p>
              Doctor Name <br /> Doctor Speciality
            </p>
          </SwiperSlide>

          <SwiperSlide>
            <img src={a4} alt="" />
            <p>
              Doctor Name <br /> Doctor Speciality
            </p>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}
