import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

import { useRouter } from "next/router";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "next-share";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Layout from "@/layout/layoutTemplate";
import SliderComp from "./components/admin/SliderComp";
import SliderCompNews from "./components/SliderCompNews";
import { homePageService } from "@/store/services/homepageServices";
import { getInvolvePageSevices } from "@/store/services/getInvolvedPageService";
import {
  checkImageOrVideoFromUrl,
  getFormatedDate,
  randomKey,
  formatDate,
} from "@/store/library/utils";
import showNotification from "@/helpers/show_notification";
import { Spinner } from "react-bootstrap";
import TeamModal from "./components/ShowTeam";
import { newsPageService } from "./../store/services/newsPageService";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function MainPage({ metaData }) {
  const router = useRouter();

  const [isSubmitingLoader, setIsSubmitingLoader] = useState(false);

  const [staticContent, setStaticContent] = useState({});
  const [data3, setdata3] = useState([]);
  const [newsSectionData, setNewsSectionData] = useState([]);
  const [newsSectionFirstData, setNewsSectionFirstData] = useState([]);
  const [sponsorPartnerData, setSponsorPartnerData] = useState([]);
  const [signUpEmail, setSignUpEmail] = useState("");
  const [volunteerText, setVolunteerText] = useState("");
  const [partnerText, setPartnerText] = useState("");
  const [donateText, setDonateText] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [MissionText, setMission] = useState("");
  const [newsURL, setNewsURL] = useState("");

  const [meetExeutive, setMeetExeutive] = useState([]);
  const [readMore, setReadMore] = useState(false);

  //states for OG TAG
  const [ogDesc, setogDesc] = useState("");
  const [ogTitle, setogTitle] = useState("");
  const [ogURL, setogURL] = useState("");
  const [ogSiteName, setogSiteName] = useState("");
  const [ogImg, setogImg] = useState("");
  const [ogSummary, setSummary] = useState("");
  const [featuredCmts, setfeaturedCmts] = useState([]);

  //function to handle facebook share
  function handlefbshare(url, quote, description, image, domain) {
    setogURL(url);
    setogDesc(description);
    setogImg(image);
    setogTitle(quote);
    setogSiteName(domain);
  }

  //function to toggle readmore
  function toggleReadmore() {
    if (readMore == false) {
      setReadMore(true);
    } else {
      setReadMore(false);
    }
  }

  useEffect(() => {
    homePageStaticContent();
    homePageDynamicContent();
    showNewsSection();
    getMeetExecutive();
  }, []);
  useEffect(() => {
    if (newsSectionFirstData?.id) {
      fetchFeaturedComment();
    }
  }, [newsSectionFirstData]);

  function closeModal() {
    setToggle(false);
  }

  const updateNewsView = async (newsId, views) => {
    try {
      setShowLoader(true);
      let currentViews = views ? views : 0;

      const formData = new FormData();
      formData.append("updateId", newsId);
      formData.append("view", parseInt(currentViews) + 1);
      formData.append("secName", "camp_news");

      const response = await homePageService.addCampaignNewsData(formData);

      if (response?.data?.success) {
        setShowLoader(false);
        // router.push(`/news/${newsId}`);
      } else {
        setShowLoader(false);
        showNotification(response?.data?.message, "Error");
      }
    } catch (error) {
      setShowLoader(false);
      console.error(error);
    }
  };

  const homePageStaticContent = async () => {
    try {
      let params = {};
      // params.pageName = "home";

      const resp = await homePageService?.pageStaticData(params);
      console.log("Static Data===>", resp);

      if (resp?.data?.success) {
        let homeData = resp?.data?.data?.filter(
          (item) => item?.page_name == "home"
        );
        let get_involved = resp?.data?.data?.filter(
          (item) => item?.page_name == "get_involved"
        );
        let donate = resp?.data?.data?.filter(
          (item) => item?.page_name == "donate"
        );

        if (homeData[0]?.image) {
          homeData[0].imageType = checkImageOrVideoFromUrl(homeData[0]?.image);
        }

        if (homeData[0]?.image2) {
          homeData[0].imageType2 = checkImageOrVideoFromUrl(
            homeData[0]?.image2
          );
        }

        if (homeData[0]?.image3) {
          homeData[0].imageType3 = checkImageOrVideoFromUrl(
            homeData[0]?.image3
          );
        }
        setMission(homeData[0].mission_text);

        setVolunteerText(get_involved[0]?.header_text);
        setPartnerText(get_involved[0]?.page_text);
        setDonateText(donate[0]?.header_text);
        setStaticContent(homeData[0]);
      } else {
        setStaticContent();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const homePageDynamicContent = async () => {
    try {
      let params = {};

      const resp = await homePageService.homePageDescAccomp(params);
      if (resp?.data?.success) {
        setdata3(resp?.data?.data);
      } else {
        setdata3([]);
      }
    } catch (err) {
      console.log(err?.message);
    }
  };

  const showNewsSection = async () => {
    try {
      let params = {};
      params.sectionName = "camp_news";

      const newsResp = await getInvolvePageSevices.getDynamicData(params);

      if (newsResp?.data?.success) {
        let respData = newsResp?.data?.data?.reverse();
        let currentDate = getFormatedDate(new Date(), "YYYY-MM-DD");

        let campignNews = respData?.filter(
          (item) =>
            item?.sectionName == "camp_news" &&
            item?.expire_date > currentDate &&
            item?.active == "1"
        );

        let SponserPartner = respData?.filter(
          (item) => item?.sectionName == "spon_partner" && item?.active == "1"
        );
        setSponsorPartnerData(SponserPartner);

        if (campignNews?.length) {
          let firstNewsData = campignNews?.filter(
            (item) => item?.featuredItem == "1"
          );

          setNewsSectionFirstData(firstNewsData[0]);

          let AllNewsData = campignNews?.filter(
            (item) => item?.featuredItem != "1"
          );
          setNewsSectionData(AllNewsData);
        } else {
          setNewsSectionFirstData();
          setNewsSectionData([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveSignUpData = async () => {
    if (signUpEmail == "") {
      showNotification("Please fill a valid email.", "Error");
    } else {
      if (signUpEmail.includes("@")) {
        setIsSubmitingLoader(true);
        try {
          const formData = new FormData();

          formData.append("email", signUpEmail);
          formData.append("section_name", "sign_up");

          const response = await getInvolvePageSevices.addSignUpData(formData);
          console.log("SignupToday", response);

          if (response?.data?.success) {
            setIsSubmitingLoader(false);
            setSignUpEmail("");
            showNotification("Response Saved.", "Success");
          } else {
            if (response?.data?.message == "Email already exists") {
              setIsSubmitingLoader(false);
              showNotification("Email already exists", "Error");
            } else {
              setIsSubmitingLoader(false);
              showNotification("Failed to send", "Error");
            }
          }
        } catch (error) {
          setIsSubmitingLoader(false);
          console.error(error);
        }
      } else {
        showNotification("Please anter a valid email.", "Error");
      }
    }
  };

  const getMeetExecutive = async () => {
    try {
      let params = {};
      params.sectionName = "DescAccomplishment";
      const response = await homePageService.homePageDescAccomp(params);

      if (response?.data?.success) {
        let dataResp = response?.data?.data;
        let meetExeutiveData = dataResp.filter(
          (item) => item.sectionName == "MeetExecutive"
        );

        setMeetExeutive(meetExeutiveData);
      } else {
        setMeetExeutive([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showTeamData = () => {
    setToggle(!toggle);
  };

  async function fetchFeaturedComment(params) {
    try {
      const resp = await newsPageService.getFilteredComments(params);

      const sortedComments = resp?.data?.data;

      const featuredComments = sortedComments.filter(
        (item) => item.post_id == newsSectionFirstData.id
      );

      setfeaturedCmts(featuredComments);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Home - Kindness Campaign</title>
        <meta name="description" content="Kindness Campaign" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Kindness Campaign News | ${metaData?.header_text}`}
        />
        <meta property="og:description" content={metaData?.page_text} />
        <meta property="og:url" content={metaData?.impact_link} />
        <meta property="og:site_name" content="Kindness Campaign" />

        <meta property="og:image" content={ogImg} />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content={ogImg} />
      </Head>
      <Layout>
        <TeamModal
          closeModal={closeModal}
          toggle={toggle}
          meetExeutive={meetExeutive}
        />
        {isSubmitingLoader ? (
          <div className="overlay">
            <div className="spinner-container">
              <Spinner
                className="loaderSpinnerPiyush"
                style={{
                  width: "100px",
                  height: "100px",
                  color: "#0a1c51fc",
                }}
                animation="border"
              />
            </div>
          </div>
        ) : null}
        <section className="hero">
          <div className="container position-relative">
            <div className="row gy-5" data-aos="fade-in">
              <div className="col-lg-12 col-md-12">
                <h4 className="home-main-heading-1">
                  {staticContent?.header_text ? staticContent?.header_text : ""}
                </h4>
              </div>
            </div>
          </div>
          {/* start edited by sudhanshu */}

          <div className=" " data-aos="fade-up" data-aos-delay={200} style={{}}>
            {Object.keys(staticContent).length != 0 ? (
              <div className="banner">
                <div className="banner_items">
                  <div className="">
                    {staticContent?.imageType == "video" ? (
                      <ReactPlayer
                        url={
                          staticContent?.image
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              staticContent?.image
                            : "demo-video.mp4"
                        }
                        controls={true}
                        autoplay={false}
                        muted={false}
                        width={"100%"}
                      />
                    ) : (
                      <img
                        src={
                          staticContent?.image
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              staticContent?.image
                            : "/bg-video-banner.jpg"
                        }
                        alt="video-banner"
                      />
                    )}
                  </div>
                </div>

                <div className=" banner_vid">
                  <div className="">
                    {staticContent?.imageType2 == "video" ? (
                      <ReactPlayer
                        url={
                          staticContent?.image2
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              staticContent?.image2
                            : "demo-video.mp4"
                        }
                        controls={true}
                        playing={false}
                        muted={false}
                        width={"100%"}
                      />
                    ) : (
                      <img
                        src={
                          staticContent?.image2
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              staticContent?.image2
                            : "/bg-video-banner.jpg"
                        }
                        alt="video-banner"
                      />
                    )}
                  </div>
                </div>

                <div className="banner_items">
                  <div className="">
                    {staticContent?.imageType3 == "video" ? (
                      <ReactPlayer
                        url={
                          staticContent?.image3
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              staticContent?.image3
                            : "demo-video.mp4"
                        }
                        controls={true}
                        playing={false}
                        muted={true}
                        width={"100%"}
                      />
                    ) : (
                      <img
                        src={
                          staticContent?.image3
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              staticContent?.image3
                            : "/bg-video-banner.jpg"
                        }
                        alt="video-banner"
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <SkeletonTheme baseColor="#88b6de" highlightColor="#6c8ac4">
                <div className="skeletonBanner">
                  <Skeleton height={300} width={420} duration={1} />
                  <Skeleton height={300} width={420} duration={1} />
                  <Skeleton height={300} width={420} duration={1} />
                </div>
              </SkeletonTheme>
            )}
          </div>

          {/* editing end by sudhanshu */}

          <div className="container">
            <h4 className="home-main-heading-2">{MissionText}</h4>
          </div>
          <Image
            src={"/design-1.png"}
            width={0}
            height={0}
            alt="Meet-OUR-Founder 1"
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          />
        </section>
        {/* End Hero Section */}

        <section className="vission" id="vission">
          <div className="container aos-init aos-animate" data-aos="fade-up">
            <div className="row gy-12">
              <div className="col-lg-12">
                <h4 className="home-main-heading-3">
                  {staticContent?.page_text}
                </h4>
                <div className="text-center">
                  <a href="/get-involved" className="buy-btn supportbtn">
                    Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="row">
            <div className="container-fluid">
              <div className="row full_wrap">
                <div className="col-md-11">
                  <SliderComp data={data3} />
                </div>
              </div>

              <div className="container">
                <h2 className="text-center">
                  {" "}
                  <Link
                    target="_blank"
                    href={`${
                      staticContent?.impact_link
                        ? staticContent?.impact_link
                        : "#!"
                    }`}
                  >
                    <u className="decriptions_wrap">
                      CLICK HERE for detail decriptions of our IMPACTS
                    </u>
                  </Link>
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="MeetOURFounder">
          <div className="container aos-init aos-animate" data-aos="fade-up">
            <div className="row">
              <div className="col-md-12 col-lg-5 align-self-center">
                <Image
                  src={
                    staticContent?.section_media
                      ? process.env.NEXT_PUBLIC_API_URL +
                        staticContent?.section_media
                      : "/images/Meet-OUR-Founder.png"
                  }
                  width={0}
                  height={350}
                  alt="Meet-OUR-Founder_2"
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <div className="col-md-12 col-lg-7 align-self-center">
                {staticContent?.section_title ? (
                  <h2 className="meetteam">{staticContent?.section_title}</h2>
                ) : (
                  ""
                )}
                {staticContent?.section_post && (
                  <p className="fst2">
                    {staticContent?.section_post ? (
                      <p>
                        {readMore == false
                          ? staticContent?.section_post.slice(0, 200)
                          : staticContent?.section_post}
                        <button
                          className="readMoreBtn"
                          onClick={toggleReadmore}
                        >
                          {readMore == false ? (
                            <p> Read More</p>
                          ) : (
                            <p> Read Less</p>
                          )}
                        </button>
                      </p>
                    ) : null}
                  </p>
                )}
                <p>&nbsp;</p>
                <h2>
                  {" "}
                  <Link href="#!" onClick={showTeamData}>
                    <u className="decriptions_wrap">
                      CLICK HERE to meet The Kindness Campaign TEAM!
                    </u>
                  </Link>
                </h2>
              </div>
            </div>
          </div>
        </section>
        <h3 className="text-center mb-5 mt-4 kindness_campaign">
          The Kindness Campaign News
        </h3>

        {newsSectionFirstData?.title ? (
          <section className="news_title_one ">
            <div
              className="container aos-init aos-animate bottom-bdr"
              data-aos="fade-up"
            >
              <div className="row">
                <div className="col-md-12 col-lg-6 align-self-center">
                  {/* <Image
                    src={
                      newsSectionFirstData?.media
                        ? process.env.NEXT_PUBLIC_SITE_URL + newsSectionFirstData?.media
                        : "news-title.png"
                    }
                    width={0}
                    height={0}
                    alt={newsSectionFirstData?.title}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                  /> */}
                  {newsSectionFirstData?.media_type == "image" ? (
                    <Image
                      src={
                        newsSectionFirstData?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL +
                            newsSectionFirstData?.media
                          : "/no-img.jpg"
                      }
                      width={0}
                      height={0}
                      alt={newsSectionFirstData?.title}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                    />
                  ) : newsSectionFirstData.media_type == "video" ? (
                    <ReactPlayer
                      url={
                        newsSectionFirstData?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL +
                            newsSectionFirstData?.media
                          : "/no-img.jpg"
                      }
                      controls={true}
                      playing={true}
                      muted={true}
                      width={"100%"}
                    />
                  ) : (
                    <ReactPlayer
                      url={`${newsSectionFirstData?.media}?showinfo=0&enablejsapi=1&origin=http://localhost:3000`}
                      playing={false}
                      controls={true}
                      muted={false}
                      width={"100%"}
                    />
                  )}
                </div>
                <div className="col-md-12 col-lg-6 news_sec">
                  <Link
                    href={"/news/" + newsSectionFirstData?.id}
                    target="_blank"
                    onClick={() =>
                      updateNewsView(
                        newsSectionFirstData?.id,
                        newsSectionFirstData?.view
                      )
                    }
                  >
                    <span className="newsLink" disabled={showLoader}>
                      <h2 className="News_title2">
                        {newsSectionFirstData?.title}
                      </h2>
                    </span>
                  </Link>

                  <p className="fst2">
                    {newsSectionFirstData?.news_artical?.length > 500
                      ? newsSectionFirstData?.news_artical?.substring(0, 500) +
                        "..."
                      : newsSectionFirstData?.news_artical}
                  </p>
                  {newsSectionFirstData?.news_artical?.length > 500 && (
                    <Link
                      href={"/news/" + newsSectionFirstData?.id}
                      target="_blank"
                      onClick={() =>
                        updateNewsView(
                          newsSectionFirstData?.id,
                          newsSectionFirstData?.view
                        )
                      }
                    >
                      <button
                        type="button"
                        className="readbtn"
                        disabled={showLoader}
                        onClick={() =>
                          updateNewsView(
                            newsSectionFirstData?.id,
                            newsSectionFirstData?.view
                          )
                        }
                      >
                        Read More {/*M capitalist by sudhanshu*/}
                      </button>
                    </Link>
                  )}
                  <div className="row mt-4 icons">
                    <div className="col-md-2">
                      <h3 className="align-self-center">
                        <Link
                          href={"/news/" + newsSectionFirstData?.id}
                          target="_blank"
                          onClick={() =>
                            updateNewsView(
                              newsSectionFirstData?.id,
                              newsSectionFirstData?.view
                            )
                          }
                        >
                          <span className="share_wrap">
                            <i className="fa fa-comment" aria-hidden="true" />
                            {featuredCmts?.length > 0
                              ? featuredCmts?.length
                              : "0"}
                          </span>
                        </Link>
                      </h3>
                    </div>{" "}
                    <div className="col-md-2">
                      <span className="share_wrap">
                        <i className="fa fa-eye" aria-hidden="true" />
                        &nbsp;{" "}
                        {newsSectionFirstData?.view
                          ? newsSectionFirstData?.view
                          : 0}
                      </span>
                    </div>
                    <div className="col-md-2">
                      <h3 className="align-self-center">
                        <a href="#!" className="buttonexpend">
                          <span className="iconexpend">
                            {" "}
                            <span className="share">
                              <i
                                className="fa fa-share-alt"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </span>
                          &nbsp;&nbsp;
                          <span className="textexpend">
                            <FacebookShareButton
                              url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}news/${newsSectionFirstData?.id}`}
                              quote={newsSectionFirstData?.title}
                              hashtag={`#kindnesscampaign ${newsSectionFirstData?.title}`}
                            >
                              <i
                                className="fa fa-facebook"
                                aria-hidden="true"
                              />
                              &nbsp;
                            </FacebookShareButton>

                            <TwitterShareButton
                              url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionFirstData?.id}`}
                              title={newsSectionFirstData?.title}
                            >
                              {" "}
                              <i className="fa fa-twitter" aria-hidden="true" />
                              &nbsp;
                            </TwitterShareButton>

                            <LinkedinShareButton
                              url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionFirstData?.id}`}
                              title={newsSectionFirstData?.title}
                              description={newsSectionFirstData?.news_artical}
                            >
                              {" "}
                              <i
                                className="fa fa-linkedin-square"
                                aria-hidden="true"
                              ></i>{" "}
                              &nbsp;
                            </LinkedinShareButton>
                          </span>
                        </a>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          ""
        )}

        {newsSectionData.length > 3 ? (
          <>
            <section id="swiper_slider">
              <SliderCompNews
                handlefbshare={handlefbshare}
                updateNewsView={updateNewsView}
                FacebookShareButton={FacebookShareButton}
                TwitterShareButton={TwitterShareButton}
                LinkedinShareButton={LinkedinShareButton}
                showLoader={showLoader}
                newsSectionData={newsSectionData}
                ogDesc={ogDesc}
                setogDesc={setogDesc}
                ogTitle={ogTitle}
                setogTitle={setogTitle}
                ogURL={ogURL}
                setogURL={setogURL}
                ogSiteName={ogSiteName}
                setogSiteName={setogSiteName}
                ogImg={ogImg}
                setogImg={setogImg}
                newsSectionFirstData={newsSectionFirstData}
              />
            </section>
          </>
        ) : newsSectionData.length == 3 ? (
          <>
            <div className="newsSectionthreeItems">
              <div className="sliderItemNews">
                <article>
                  <div className="post-img-in">
                    {newsSectionData[0]?.media_type == "image" ? (
                      <Image
                        className="newsSliderImage"
                        src={
                          newsSectionData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[0]?.media
                            : "/no-img.jpg"
                        }
                        width={300}
                        height={300}
                      />
                    ) : newsSectionData[0]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          newsSectionData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[0]?.media
                            : "/no-img.jpg"
                        }
                        playing={true}
                        muted={true}
                        width="100%"
                        height="250px"
                      />
                    ) : (
                      <ReactPlayer
                        url={newsSectionData[0]?.media}
                        playing={false}
                        controls={true}
                        muted={false}
                        width="100%"
                        height="250px"
                      />
                    )}
                  </div>
                  <h2 className="News_title">
                    <Link
                      href={"/news/" + newsSectionData[0]?.id}
                      disabled={showLoader}
                      target="_blank"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[0]?.id,
                          newsSectionData[0]?.view
                        )
                      }
                    >
                      {newsSectionData[0]?.title}
                    </Link>
                  </h2>
                  <p className="post-category2">
                    {newsSectionData[0]?.news_artical?.substring(0, 200) +
                      "..."}
                  </p>
                  <div className="row">
                    <div
                      className="col-md-4"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[0]?.id,
                          newsSectionData[0]?.view
                        )
                      }
                    >
                      <Link
                        href={"/news/" + newsSectionData[0]?.id}
                        target="_blank"
                      >
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
                        {newsSectionData[0]?.view
                          ? newsSectionData[0]?.view
                          : 0}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[0]?.id}`}
                            quote={newsSectionData[0]?.title}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[0]?.id}`}
                            title={newsSectionData[0]?.title}
                          >
                            {" "}
                            <i className="fa fa-twitter" aria-hidden="true" />
                            &nbsp;
                          </TwitterShareButton>

                          <LinkedinShareButton
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[0]?.id}`}
                            title={newsSectionData[0]?.title}
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

              <div className="sliderItemNews">
                <article>
                  <div className="post-img-in">
                    {newsSectionData[1]?.media_type == "image" ? (
                      <Image
                        className="newsSliderImage"
                        src={
                          newsSectionData[1]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[1]?.media
                            : "/no-img.jpg"
                        }
                        width={300}
                        height={300}
                      />
                    ) : newsSectionData[1]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          newsSectionData[1]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[1]?.media
                            : "/no-img.jpg"
                        }
                        controls={true}
                        playing={true}
                        muted={true}
                        width="100%"
                        height="250px"
                      />
                    ) : (
                      <ReactPlayer
                        url={newsSectionData[1]?.media}
                        playing={false}
                        controls={true}
                        width="100%"
                        height="250px"
                      />
                    )}
                  </div>
                  <h2 className="News_title">
                    <Link
                      href={"/news/" + newsSectionData[1]?.id}
                      disabled={showLoader}
                      target="_blank"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[1]?.id,
                          newsSectionData[1]?.view
                        )
                      }
                    >
                      {newsSectionData[1]?.title}
                    </Link>
                  </h2>
                  <p className="post-category2">
                    {newsSectionData[1]?.news_artical?.substring(0, 200) +
                      "..."}
                  </p>
                  <div className="row">
                    <div
                      className="col-md-4"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[1]?.id,
                          newsSectionData[1]?.view
                        )
                      }
                    >
                      <Link
                        href={"/news/" + newsSectionData[1]?.id}
                        target="_blank"
                      >
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
                        {newsSectionData[1]?.view
                          ? newsSectionData[1]?.view
                          : 0}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[1]?.id}`}
                            quote={newsSectionData[1]?.title}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[1]?.id}`}
                            title={newsSectionData[1]?.title}
                          >
                            {" "}
                            <i className="fa fa-twitter" aria-hidden="true" />
                            &nbsp;
                          </TwitterShareButton>

                          <LinkedinShareButton
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[1]?.id}`}
                            title={newsSectionData[1]?.title}
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

              <div className="sliderItemNews">
                <article>
                  <div className="post-img-in">
                    {newsSectionData[2]?.media_type == "image" ? (
                      <Image
                        className="newsSliderImage"
                        src={
                          newsSectionData[2]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[2]?.media
                            : "/no-img.jpg"
                        }
                        width={300}
                        height={300}
                      />
                    ) : newsSectionData[2]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          newsSectionData[2]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[2]?.media
                            : "/no-img.jpg"
                        }
                        controls={true}
                        playing={true}
                        muted={true}
                        width="100%"
                        height="250px"
                      />
                    ) : (
                      <ReactPlayer
                        url={newsSectionData[2]?.media}
                        playing={false}
                        controls={true}
                        muted={false}
                        width="100%"
                        height="250px"
                      />
                    )}
                  </div>
                  <h2 className="News_title">
                    <Link
                      href={"/news/" + newsSectionData[2]?.id}
                      disabled={showLoader}
                      target="_blank"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[2]?.id,
                          newsSectionData[2]?.view
                        )
                      }
                    >
                      {newsSectionData[2]?.title}
                    </Link>
                  </h2>
                  <p className="post-category2">
                    {newsSectionData[2]?.news_artical?.substring(0, 200) +
                      "..."}
                  </p>
                  <div className="row">
                    <div
                      className="col-md-4"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[2]?.id,
                          newsSectionData[2]?.view
                        )
                      }
                    >
                      <Link
                        href={"/news/" + newsSectionData[2]?.id}
                        target="_blank"
                      >
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
                        {newsSectionData[1]?.view
                          ? newsSectionData[1]?.view
                          : 0}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[2]?.id}`}
                            quote={newsSectionData[2]?.title}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[2]?.id}`}
                            title={newsSectionData[1]?.title}
                          >
                            {" "}
                            <i className="fa fa-twitter" aria-hidden="true" />
                            &nbsp;
                          </TwitterShareButton>

                          <LinkedinShareButton
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[2]?.id}`}
                            title={newsSectionData[1]?.title}
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
            </div>
          </>
        ) : newsSectionData.length == 2 ? (
          <>
            <div className="newsSectionthreeItems">
              <div className="sliderItemNews">
                <article>
                  <div className="post-img-in">
                    {newsSectionData[0]?.media_type == "image" ? (
                      <Image
                        className="newsSliderImage2Items"
                        src={
                          newsSectionData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[0]?.media
                            : "/no-img.jpg"
                        }
                        width={300}
                        height={300}
                      />
                    ) : newsSectionData[0]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          newsSectionData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[0]?.media
                            : "/no-img.jpg"
                        }
                        playing={true}
                        muted={true}
                        width="100%"
                        height="350px"
                      />
                    ) : (
                      <ReactPlayer
                        url={newsSectionData[0]?.media}
                        playing={false}
                        controls={true}
                        muted={false}
                        width="100%"
                        height="350px"
                      />
                    )}
                  </div>
                  <h2 className="News_title">
                    <Link
                      href={"/news/" + newsSectionData[0]?.id}
                      disabled={showLoader}
                      target="_blank"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[0]?.id,
                          newsSectionData[0]?.view
                        )
                      }
                    >
                      {newsSectionData[0]?.title}
                    </Link>
                  </h2>
                  <p className="post-category2">
                    {newsSectionData[0]?.news_artical?.substring(0, 200) +
                      "..."}
                  </p>
                  <div className="row">
                    <div
                      className="col-md-4"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[0]?.id,
                          newsSectionData[0]?.view
                        )
                      }
                    >
                      <Link
                        href={"/news/" + newsSectionData[0]?.id}
                        target="_blank"
                      >
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
                        {newsSectionData[0]?.view
                          ? newsSectionData[0]?.view
                          : 0}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[0]?.id}`}
                            quote={newsSectionData[0]?.title}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[0]?.id}`}
                            title={newsSectionData[0]?.title}
                          >
                            {" "}
                            <i className="fa fa-twitter" aria-hidden="true" />
                            &nbsp;
                          </TwitterShareButton>

                          <LinkedinShareButton
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[0]?.id}`}
                            title={newsSectionData[0]?.title}
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

              <div className="sliderItemNews">
                <article>
                  <div className="post-img-in">
                    {newsSectionData[1]?.media_type == "image" ? (
                      <Image
                        className="newsSliderImage2Items"
                        src={
                          newsSectionData[1]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[1]?.media
                            : "/no-img.jpg"
                        }
                        width={300}
                        height={300}
                      />
                    ) : newsSectionData[1]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          newsSectionData[1]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[1]?.media
                            : "/no-img.jpg"
                        }
                        controls={true}
                        playing={true}
                        muted={true}
                        width="100%"
                        height="350px"
                      />
                    ) : (
                      <ReactPlayer
                        url={newsSectionData[1]?.media}
                        playing={false}
                        controls={true}
                        muted={false}
                        width="100%"
                        height="350px"
                      />
                    )}
                  </div>
                  <h2 className="News_title">
                    <Link
                      href={"/news/" + newsSectionData[1]?.id}
                      disabled={showLoader}
                      target="_blank"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[1]?.id,
                          newsSectionData[1]?.view
                        )
                      }
                    >
                      {newsSectionData[1]?.title}
                    </Link>
                  </h2>
                  <p className="post-category2">
                    {newsSectionData[1]?.news_artical?.substring(0, 200) +
                      "..."}
                  </p>
                  <div className="row">
                    <div
                      className="col-md-4"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[1]?.id,
                          newsSectionData[1]?.view
                        )
                      }
                    >
                      <Link
                        href={"/news/" + newsSectionData[1]?.id}
                        target="_blank"
                      >
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
                        {newsSectionData[1]?.view
                          ? newsSectionData[1]?.view
                          : 0}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[1]?.id}`}
                            quote={newsSectionData[1]?.title}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[1]?.id}`}
                            title={newsSectionData[1]?.title}
                          >
                            {" "}
                            <i className="fa fa-twitter" aria-hidden="true" />
                            &nbsp;
                          </TwitterShareButton>

                          <LinkedinShareButton
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[1]?.id}`}
                            title={newsSectionData[1]?.title}
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
            </div>
          </>
        ) : (
          <>
            <div className="newsSectionthreeItems">
              <div className="sliderItemNews ">
                <article>
                  <div className="post-img-in ">
                    {newsSectionData[0]?.media_type == "image" ? (
                      <Image
                        className="newsSliderImageSingleItem"
                        src={
                          newsSectionData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[0]?.media
                            : "/no-img.jpg"
                        }
                        width={300}
                        height={300}
                      />
                    ) : newsSectionData[0]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          newsSectionData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              newsSectionData[0]?.media
                            : "/no-img.jpg"
                        }
                        playing={true}
                        muted={true}
                        width={"100%"}
                      />
                    ) : (
                      <ReactPlayer
                        url={newsSectionData[0]?.media}
                        playing={false}
                        controls={true}
                        muted={false}
                        width={"100%"}
                      />
                    )}
                  </div>
                  <h2 className="News_title">
                    <Link
                      href={"/news/" + newsSectionData[0]?.id}
                      disabled={showLoader}
                      target="_blank"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[0]?.id,
                          newsSectionData[0]?.view
                        )
                      }
                    >
                      {newsSectionData[0]?.title}
                    </Link>
                  </h2>
                  <p className="post-category2">
                    {newsSectionData[0]?.news_artical?.substring(0, 200) +
                      "..."}
                  </p>
                  <div className="row">
                    <div
                      className="col-md-4"
                      onClick={() =>
                        updateNewsView(
                          newsSectionData[0]?.id,
                          newsSectionData[0]?.view
                        )
                      }
                    >
                      <Link
                        href={"/news/" + newsSectionData[0]?.id}
                        target="_blank"
                      >
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
                        {newsSectionData[0]?.view
                          ? newsSectionData[0]?.view
                          : 0}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[0]?.id}`}
                            quote={newsSectionData[0]?.title}
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
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[0]?.id}`}
                            title={newsSectionData[0]?.title}
                          >
                            {" "}
                            <i className="fa fa-twitter" aria-hidden="true" />
                            &nbsp;
                          </TwitterShareButton>

                          <LinkedinShareButton
                            url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${newsSectionData[0]?.id}`}
                            title={newsSectionData[0]?.title}
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
            </div>
          </>
        )}

        <section className="text-center p-5 my-5" id="signuptoday">
          <div className="inboxSection container p-3">
            <h1 className="getinbox">GET THE LATEST IN YOUR INBOX</h1>
            <h3 className="getinbox-2">
              Get exclusive updates on our work and how you can help.
            </h3>
            <form>
              <input
                type="email"
                name="signupEmail"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e?.target?.value)}
                className="your_inbox_wrap"
              />
              <button
                type="button"
                onClick={saveSignUpData}
                className="btn-1 btn-primary "
              >
                SIGN UP TODAY
              </button>
            </form>
          </div>
        </section>

        <section className="news_title_two">
          <div className="container">
            <h3 className="mb-4 get_involved_wrap">GET INVOLVED</h3>
            <div className="row">
              <div className="col-lg-7 col-md-12 mb-4 align-self-centers">
                <Image
                  src="news-title-3.png"
                  width={0}
                  height={0}
                  alt="news-title-3"
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
                <Link href="/get-involved/#donate" target="_blank">
                  <p className="get_p">
                    DONATE <br />
                    {donateText?.length > 150
                      ? donateText?.substring(0, 150)
                      : donateText}
                  </p>
                </Link>
              </div>

              <div className="col-md-12 col-lg-5">
                <div className="col-md-12">
                  <Image
                    src="news-title-1.png"
                    width={0}
                    height={0}
                    alt="news-title-3"
                    sizes="100vw"
                    className="news_title_1"
                  />
                  <Link href="/get-involved/#volunteer" target="_blank">
                    <p className="get_kindness">
                      VOLUNTEER <br />
                      {volunteerText?.length > 100
                        ? volunteerText?.substring(0, 100)
                        : volunteerText}
                    </p>
                  </Link>
                </div>
                &nbsp;
                <div className="col-md-12 ">
                  <Image
                    src="news-title-2.png"
                    width={0}
                    height={0}
                    alt="news-title-3"
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                  />
                  <Link href="/get-involved/#partner" target="_blank">
                    <p className="get_kindness">
                      PARTNER <br />
                      {partnerText?.length > 100
                        ? partnerText?.substring(0, 100)
                        : partnerText}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center p-5 my-5">
          <div className="container p-4">
            <h1 className="getinbox-3">
              Check Out <b> Putting Chicago To Work</b>
            </h1>
            <p className="getinbox-4">
              Putting Chicago To Work is a weekly publication that contains a
              plethora of job opportunities, community resources &amp;
              vocational training opportunities.
            </p>

            <p className="Putting_Chicago fst">
              Want the latest issue of Putting Chicago To Work?
              <a
                href={
                  staticContent?.issue_link ? staticContent?.issue_link : "#!"
                }
                style={{ display: "inline-flex" }}
                target="_blank"
              >
                Click here.
              </a>
            </p>

            <p className="Putting_Chicago fst">
              Want access to daily job postings on Facebook?
              <a
                href={
                  staticContent?.job_post_link
                    ? staticContent?.job_post_link
                    : "#!"
                }
                style={{ display: "inline-flex" }}
                target="_blank"
              >
                Click here.
              </a>
            </p>
          </div>
        </section>

        {sponsorPartnerData?.length ? (
          <section className="Sponsors-and-Partner bg-secondary-1 pb-4">
            <p className="Sponsors_Partners_Spotligh mt-4">
              Sponsors &amp; Partners Spotlight
            </p>
            <div className="container sponsors_wrap">
              <ul className=" row sponsors_wrap_row sponsorList">
                {sponsorPartnerData?.map((sponsItem, index) => {
                  return (
                    <li className="col" key={randomKey()}>
                      <Image
                        src={
                          sponsItem?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              sponsItem?.media
                            : "clients/client-1.png"
                        }
                        width={224}
                        height={115}
                        alt={sponsItem?.title}
                        className="img-fluid"
                      />
                    </li>
                  );
                })}
              </ul>

              {/* <div className="row sponsors_wrap_row mt-4">
                {sponsorPartnerData?.map((sponsItem, index) => {
                  if (index > 4 && index < 10)
                    return (
                      <div className="col" key={randomKey()}>
                        <Image
                          src={
                            sponsItem?.media
                              ? process.env.NEXT_PUBLIC_SITE_URL + sponsItem?.media
                              : "clients/client-1.png"
                          }
                          width={224}
                          height={115}
                          alt={sponsItem?.title}
                          className="img-fluid"
                        />
                      </div>
                    );
                })}
              </div> */}
            </div>

            <h2 className="text-center my-5 support">
              {" "}
              “Thank you for all your support. We appreciate you!”
            </h2>
          </section>
        ) : (
          ""
        )}
      </Layout>
    </>
  );
}

// export async function getStaticProps() {
//   const data = {
//     title: "The Kindness Campaign",
//     description: "The Kindness Campaign",
//   };
//   return {
//     props: { data },
//   };
// }

export default MainPage;
