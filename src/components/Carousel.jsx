import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { BsFillPlayFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "../styles/Carousel.css";

function Carousel({animedata}) {

  return (
    <div>
      <Swiper
        pagination={true}
        className="mySwiper"
        modules={[Navigation, Scrollbar, A11y, Autoplay]}
        spaceBetween={30}
        grabCursor={true}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
      >
        {animedata.map((item) => (
          <SwiperSlide>
            <div className="carouselitem">
              <div
                className="bannerimg"
                style={{ backgroundImage: `url(${item.cover})` }}
              >
                <div className="carouselwrapper">
                  <div className="carouselcontent">
                    <div className="banner-content-left">
                      <h2 className="carouseltitle">{item.title.english || item.title.romaji}</h2>
                      <p className="carouselgenre">{item.genres.join(", ")}</p>
                    </div>
                    <div className="banner-content-right">
                      <IconContext.Provider
                        value={{
                          size: "2rem",
                          style: {
                            verticalAlign: "middle",
                          },
                        }}
                      >
                        <button className="carouselbtn">
                          <Link
                            to={`/info/${item.id}`}
                            style={{ color: "white" }}
                          >
                            <BsFillPlayFill />
                          </Link>
                        </button>
                      </IconContext.Provider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Carousel;
