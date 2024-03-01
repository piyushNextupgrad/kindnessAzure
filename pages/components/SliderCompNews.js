import Slider from "react-slick";

import Link from "next/link";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactPlayer from "react-player";
import { randomKey } from "@/store/library/utils";
const SliderCompNews = ({
  newsSectionData,
  showLoader,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  updateNewsView,
  handlefbshare,
  newsSectionFirstData,
}) => {
  let color = "red";
  var settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,

    slidesToScroll: 1,
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

  // const updateNewsView = async (newsId, views) => {
  //   try {
  //     setShowLoader(true);
  //     let currentViews = views ? views : 0;

  //     const formData = new FormData();
  //     formData.append("updateId", newsId);
  //     formData.append("view", parseInt(currentViews) + 1);
  //     formData.append("secName", "camp_news");

  //     const response = await homePageService.addCampaignNewsData(formData);

  //     if (response?.data?.success) {
  //       setShowLoader(false);
  //       // router.push(`/news/${newsId}`);
  //     } else {
  //       setShowLoader(false);
  //       showNotification(response?.data?.message, "Error");
  //     }
  //   } catch (error) {
  //     setShowLoader(false);
  //     console.error(error);
  //   }
  // };

  return (
    <div id="newsSlider">
      <Slider {...settings}>
        {newsSectionData?.length
          ? newsSectionData?.map((item, index) => (
              <>
                <div className="sliderItemNews" key={randomKey()}>
                  <article>
                    <div className="post-img">
                      {item.media_type == "image" ? (
                        <img
                          id="newsSliderimg"
                          src={
                            item?.media
                              ? process.env.NEXT_PUBLIC_SITE_URL + item?.media
                              : "/no-img.jpg"
                          }
                        />
                      ) : item.media_type == "video" ? (
                        <ReactPlayer
                          url={
                            item?.media
                              ? process.env.NEXT_PUBLIC_SITE_URL + item?.media
                              : "/no-img.jpg"
                          }
                          playing={false}
                          width={"100%"}
                          height={"200px"}
                        />
                      ) : (
                        <ReactPlayer
                          url={item?.media}
                          playing={false}
                          controls={true}
                          width={"100%"}
                          height={"200px"}
                        />
                      )}
                    </div>
                    <h2 className="News_title">
                      <Link
                        href={"/news/" + item?.id}
                        disabled={showLoader}
                        target="_blank"
                        onClick={() => updateNewsView(item?.id, item?.view)}
                      >
                        {item?.title}
                      </Link>
                    </h2>
                    <p className="post-category2">
                      {item?.news_artical?.substring(0, 200) + "..."}
                    </p>
                    <div className="row">
                      <div
                        className="col-md-4"
                        onClick={() => updateNewsView(item?.id, item?.view)}
                      >
                        <Link href={"/news/" + item?.id} target="_blank">
                          <button
                            type="button"
                            disabled={showLoader}
                            className="btn btn-info shar_btn"
                          >
                            Read more
                          </button>
                        </Link>
                      </div>

                      <div className="col-md-8 align-self-center icon_wrap">
                        <span className="share_wrap icon1">
                          <i className="fa fa-eye icon1" aria-hidden="true" />
                          {item?.view ? item?.view : 0}
                        </span>

                        <a href="#!" className="buttonexpend">
                          <span className="iconexpend">
                            {" "}
                            <span className="share">
                              <i
                                className="fa fa-share-alt "
                                aria-hidden="true"
                              ></i>
                            </span>
                          </span>
                          &nbsp;&nbsp;
                          <span className="textexpend">
                            <FacebookShareButton
                              url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${item?.id}`}
                              quote={item?.title}
                              hashtag={`#kindnesscampaign #${newsSectionFirstData?.title}`}
                            >
                              {" "}
                              <i
                                className="fa fa-facebook"
                                aria-hidden="true"
                                onClick={() =>
                                  handlefbshare(
                                    `${process.env.NEXT_PUBLIC_BASE_LIVE_URL}news/${newsSectionFirstData?.id}`,
                                    newsSectionFirstData?.title,
                                    newsSectionFirstData?.news_artical,
                                    process.env.NEXT_PUBLIC_SITE_URL +
                                      newsSectionFirstData?.media,
                                    process.env.NEXT_PUBLIC_BASE_LIVE_URL
                                  )
                                }
                              />
                              &nbsp;
                            </FacebookShareButton>

                            {/* <Link href="#">
                              <i
                                className="fa fa-youtube-play"
                                aria-hidden="true"
                              ></i>{" "}
                              &nbsp;
                            </Link> */}

                            <TwitterShareButton
                              url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${item?.id}`}
                              title={item?.title}
                            >
                              {" "}
                              <i className="fa fa-twitter" aria-hidden="true" />
                              &nbsp;
                            </TwitterShareButton>

                            <LinkedinShareButton
                              url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${item?.id}`}
                              title={item?.title}
                            >
                              {" "}
                              <i
                                className="fa fa-linkedin-square"
                                aria-hidden="true"
                              ></i>{" "}
                              &nbsp;
                            </LinkedinShareButton>

                            <Link href="#">
                              {/* <i
                              className="fa fa-instagram"
                              aria-hidden="true"
                            ></i> */}
                              &nbsp;
                            </Link>
                          </span>
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              </>
            ))
          : ""}
      </Slider>
    </div>
  );
};

export default SliderCompNews;
