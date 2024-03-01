import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const ImageSlider = ({ Images }) => {
  var settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="my-5">
      <Slider {...settings}>
        {Images?.length > 0
          ? Images.filter((item) => item.active === "1").map((item, key) => (
              <div key={key} style={{ display: "flex", alignItems: "center" }}>
                <img
                  id="fix-width-piyush"
                  src={
                    item?.event_media
                      ? process.env.NEXT_PUBLIC_SITE_URL + item?.event_media
                      : "/about-2.jpg"
                  }
                  alt="Picture of the author"
                />
              </div>
            ))
          : null}
      </Slider>
    </div>
  );
};

export default ImageSlider;
