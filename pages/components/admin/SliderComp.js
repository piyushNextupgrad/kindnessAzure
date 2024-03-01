import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const SliderComp = (props) => {
  let color = "red";
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
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
        breakpoint: 786,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  const sortedData = props?.data
    ?.filter(
      (item) => item.active == "1" && item.sectionName == "DescAccomplishment"
    )
    .sort((a, b) => a.order_in_slider - b.order_in_slider);
  // console.log("Sorted Slider ", sortedData);
  return (
    <Slider {...settings}>
      {sortedData.map((item) => {
        color == "red" ? (color = "blue") : (color = "red");
        return (
          <div className="carousel-col" key={item?.id}>
            <div
              className={`block ${
                color == "red" ? "blue" : "red"
              } img-responsive`}
            >
              <div className="container">
                <p className="counter_wrap_2">{item?.column_1}+</p>

                <p className="accessed_p">{item?.column_2}</p>

                <p className="accessed_p2nd">{item?.impactYear} IMPACT</p>
              </div>
            </div>
          </div>
        );
      })}
    </Slider>
  );
};

export default SliderComp;
