import Head from "next/head";
import "react-tabs/style/react-tabs.css";
import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import Layout from "@/layout/layoutTemplate";
import { campaignServices } from "@/store/services/campaignPageServices";
import { homePageService } from "@/store/services";
import { useEffect } from "react";
import Image from "next/image";
import {
  randomKey,
  extractRecordFromObject,
  checkImageOrVideoFromUrl,
} from "@/store/library/utils";
import ReactPlayer from "react-player";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const About = () => {
  const [data2, setdata2] = useState("");
  const [data3, setdata3] = useState([]);
  const [check, setcheck] = useState("false");

  const [heathEquityData, setHeathEquityData] = useState([]);
  const [workforceEquityData, setWorkforceEquityData] = useState([]);
  const [publicEquityData, setPublicEquityData] = useState([]);
  const [educationEquityData, setEducationEquityData] = useState([]);

  useEffect(() => {
    homepagedata();
    camppage4();
  }, []);

  const camppage4 = async () => {
    try {
      let params = {};
      const resp4 = await campaignServices.getLoopData(params);

      if (resp4?.data?.success) {
        const respData = resp4?.data?.data?.reverse();

        let health = extractRecordFromObject(
          respData?.filter((item) => item?.sec_name == "health_equity"),
          0,
          5
        );

        let education = extractRecordFromObject(
          respData?.filter((item) => item?.sec_name == "education_equity"),
          0,
          5
        );

        let publicEq = extractRecordFromObject(
          respData?.filter((item) => item?.sec_name == "public_equity"),
          0,
          5
        );
        let workforce = extractRecordFromObject(
          respData?.filter((item) => item?.sec_name == "workforce_equity"),
          0,
          5
        );

        setHeathEquityData(health);
        setWorkforceEquityData(workforce);
        setPublicEquityData(publicEq);
        setEducationEquityData(education);
      } else {
      }

      // setdata3(resp4?.data?.reverse());
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  const homepagedata = async () => {
    try {
      let params = {};
      params.pageName = "campaign";
      const resp = await homePageService.pageStaticData(params);
      let response = resp?.data?.data[0];

      if (response?.section_media) {
        response.section_media_type = checkImageOrVideoFromUrl(
          response?.section_media
        );
      }

      setdata2(response);
      // console.log("camp header===>", response);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("heathEquityData", heathEquityData);
  }, [heathEquityData]);

  return (
    <>
      <Head>
        <title>About - Kindness Campaign</title>
        <meta name="description" content="Kindness Campaign" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout title="About Us">
        <section className="hero">
          <div className="container-fluid about_bg_wrap">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <h1 className="about_the_campaign mt-10">
                    ABOUT THE KINDNESS CAMPAIGN
                  </h1>

                  <h4 className="About_heading-1">{data2?.header_text}</h4>
                </div>
              </div>
            </div>
            <div
              className="container aos-init aos-animate mb-5"
              data-aos="fade-up"
            >
              {data2 == "" ? (
                <>
                  <span className="skeletonHEading">
                    <SkeletonTheme baseColor="#88b6de" highlightColor="#6c8ac4">
                      <Skeleton height={7} width={800} duration={1} />
                      <Skeleton height={7} width={770} duration={1} />
                      <Skeleton height={7} width={700} duration={1} />
                    </SkeletonTheme>
                  </span>
                  <SkeletonTheme baseColor="#fff" highlightColor="#d3fadd">
                    <div className="skeletonBanner2">
                      <span className="aboutBannerSkeleton">
                        <Skeleton height={300} width={420} duration={1} />
                      </span>
                      <span className="aboutBannerSkeleton">
                        <Skeleton height={300} width={500} duration={1} />
                      </span>
                    </div>
                  </SkeletonTheme>
                </>
              ) : (
                <div className="row">
                  <div className="col-md-12 col-lg-6 mb-4 align-self-center">
                    <div className="about_video">
                      {data2?.section_media_type == "video" ? (
                        <ReactPlayer
                          url={
                            data2?.section_media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                data2?.section_media
                              : "demo-video.mp4"
                          }
                          controls={true}
                          playing={false}
                          muted={true}
                          width={"100%"}
                        />
                      ) : data2?.section_media_type == "image" ? (
                        <Image
                          src={
                            data2?.section_media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                data2?.section_media
                              : "/bg-video-banner.jpg"
                          }
                          height={300}
                          width={800}
                          alt={data2?.header_text}
                          style={{ width: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <ReactPlayer
                          url={
                            data2?.section_media
                              ? data2?.section_media
                              : "demo-video.mp4"
                          }
                          controls={true}
                          playing={false}
                          autoplay={false}
                          muted={true}
                          width={"100%"}
                          height={"50vh"}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-6 about_p">
                    <p className="about_p section2AboutPage">
                      {data2?.section_post}
                    </p>
                  </div>
                </div>
              )}
              <br />
            </div>
          </div>
        </section>

        <Image
          src="/design-1.png"
          width={1920}
          height={84}
          alt="Picture of the design"
          style={{
            width: "100%",
            height: "auto",
          }}
        />

        <div>
          <section>
            <div className="container ">
              <div className="row">
                <div className="col-md-4">
                  <h3 className="about_wrap_heading">Health Equity</h3>

                  <p className="about_wrap">
                    Health Equity is our commitment to reduce and eliminate
                    disparities in health and in its determinants, including
                    social determinants. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit, sed do eiusmod tempor incididunt.
                  </p>
                </div>
                <div className="col-md-5">
                  <div className="about_video_1">
                    {heathEquityData[0]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          heathEquityData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              heathEquityData[0]?.media
                            : "demo-video.mp4"
                        }
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    ) : heathEquityData[0]?.media_type == "youtube" ? (
                      <>
                        {" "}
                        <ReactPlayer
                          url={heathEquityData[0]?.media}
                          controls={true}
                          playing={false}
                          muted={true}
                          width="100%"
                          height={300}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          src={
                            heathEquityData[0]?.media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                heathEquityData[0]?.media
                              : "/about_video_2.png"
                          }
                          width={455}
                          height={300}
                          alt={heathEquityData[0]?.description}
                          className="about_img_bottom "
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  {heathEquityData[1]?.media_type == "video" ? (
                    <ReactPlayer
                      url={
                        heathEquityData[1]?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL +
                            heathEquityData[1]?.media
                          : "demo-video.mp4"
                      }
                      controls={true}
                      playing={false}
                      muted={true}
                      width="100%"
                      height={300}
                    />
                  ) : heathEquityData[1]?.media_type == "youtube" ? (
                    <>
                      {" "}
                      <ReactPlayer
                        url={heathEquityData[1]?.media}
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src={
                          heathEquityData[1]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              heathEquityData[1]?.media
                            : "/about_video_2.png"
                        }
                        width={455}
                        height={300}
                        alt={heathEquityData[1]?.description}
                        className="about_img_bottom "
                      />
                    </>
                  )}
                  {/* <Image
                    src={
                      heathEquityData[1]?.image
                        ? process.env.NEXT_PUBLIC_SITE_URL + heathEquityData[1]?.image
                        : "/about_video_2.png"
                    }
                    width={180}
                    height={220}
                    alt="Picture of the design"
                    className="about_img_bottom "
                  /> */}
                </div>
              </div>
            </div>
            <div className="container mt-5 bg_border">
              <div className="row">
                <div className="col-md-4">
                  <ul className="about_ul_li">
                    {heathEquityData[0]?.description ? (
                      <li>{heathEquityData[0]?.description}</li>
                    ) : null}
                    {heathEquityData[1]?.description ? (
                      <li>{heathEquityData[1]?.description}</li>
                    ) : null}
                    {heathEquityData[2]?.description ? (
                      <li>{heathEquityData[2]?.description}</li>
                    ) : null}
                    {heathEquityData[3]?.description ? (
                      <li>{heathEquityData[3]?.description}</li>
                    ) : null}
                  </ul>
                </div>
                <div className="col-md-3">
                  {heathEquityData[2]?.media_type == "video" ? (
                    <ReactPlayer
                      url={
                        heathEquityData[2]?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL +
                            heathEquityData[2]?.media
                          : "demo-video.mp4"
                      }
                      controls={true}
                      playing={false}
                      muted={true}
                      width="100%"
                      height={300}
                    />
                  ) : heathEquityData[2]?.media_type == "youtube" ? (
                    <>
                      {" "}
                      <ReactPlayer
                        url={heathEquityData[2]?.media}
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src={
                          heathEquityData[2]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              heathEquityData[2]?.media
                            : "/about_video_2.png"
                        }
                        width={455}
                        height={300}
                        alt={heathEquityData[2]?.description}
                        className="about_img_bottom "
                      />
                    </>
                  )}
                  {/* <Image
                    src={
                      heathEquityData[2]?.media
                        ? process.env.NEXT_PUBLIC_SITE_URL + heathEquityData[2]?.media
                        : "/about_video_2.png"
                    }
                    width={180}
                    height={220}
                    alt="Picture of the design"
                    className="about_img_top"
                  /> */}
                </div>
                <div className="col-md-5">
                  <div className="about_video_1">
                    {/* <Image
                      src={
                        heathEquityData[3]?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL + heathEquityData[3]?.media
                          : "/about_video_2.png"
                      }
                      width={0}
                      height={280}
                      alt="Picture of the design"
                      className="about_video_1"
                      style={{ width: "100%" }}
                    /> */}
                    {heathEquityData[3]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          heathEquityData[3]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              heathEquityData[3]?.media
                            : "demo-video.mp4"
                        }
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    ) : heathEquityData[3]?.media_type == "youtube" ? (
                      <>
                        {" "}
                        <ReactPlayer
                          url={heathEquityData[3]?.media}
                          controls={true}
                          playing={false}
                          muted={true}
                          width="100%"
                          height={300}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          src={
                            heathEquityData[3]?.media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                heathEquityData[3]?.media
                              : "/about_video_2.png"
                          }
                          width={455}
                          height={300}
                          alt={heathEquityData[3]?.description}
                          className="about_img_bottom "
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="container ">
              <div className="row">
                <div className="col-md-4">
                  <h3 className="about_wrap_heading">Education Equity</h3>
                  <p className="about_wrap">
                    Education Equity is our commitment to practices, policies
                    and procedures at the school and district level to achieves
                    academic fairness, inclusion and matriculation for every
                    student. This provides students the resources, teachers,
                    interventions and supports they need to be successful.
                  </p>
                </div>
                <div className="col-md-5">
                  <div className="about_video_1">
                    {/*  <video
                      autoPlay
                      width="100%"
                      height="auto"
                      controls="true"
                    >
                      <source src={educationEquityData[0]?.media ? process.env.NEXT_PUBLIC_SITE_URL + educationEquityData[0]?.media : "/demo-video.mp4"} />
                    </video> */}
                    {/* <ReactPlayer
                      url={educationEquityData[0]?.media ? process.env.NEXT_PUBLIC_SITE_URL + educationEquityData[0]?.media : "/demo-video.mp4"}
                      controls
                      playing={true}
                      muted={true}
                      width='100%'
                      height={300}
                    /> */}
                    {educationEquityData[0]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          educationEquityData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              educationEquityData[0]?.media
                            : "demo-video.mp4"
                        }
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    ) : educationEquityData[0]?.media_type == "youtube" ? (
                      <>
                        {" "}
                        <ReactPlayer
                          url={educationEquityData[0]?.media}
                          controls={true}
                          playing={false}
                          muted={true}
                          width="100%"
                          height={300}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          src={
                            educationEquityData[0]?.media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                educationEquityData[0]?.media
                              : "/about_video_2.png"
                          }
                          width={455}
                          height={300}
                          alt={educationEquityData[0]?.description}
                          className="about_img_bottom "
                        />
                      </>
                    )}

                    {/* {educationEquityData[0]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          educationEquityData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              educationEquityData[0]?.media
                            : "demo-video.mp4"
                        }
                        controls
                        playing={true}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    ) : (
                      <Image
                        src={
                          educationEquityData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              educationEquityData[0]?.media
                            : "/about_video_2.png"
                        }
                        width={455}
                        height={300}
                        alt={educationEquityData[0]?.description}
                        className="about_img_bottom "
                      />
                    )} */}
                  </div>
                </div>
                <div className="col-md-3">
                  {educationEquityData[1]?.media_type == "video" ? (
                    <ReactPlayer
                      url={
                        educationEquityData[1]?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL +
                            educationEquityData[1]?.media
                          : "demo-video.mp4"
                      }
                      controls={true}
                      playing={false}
                      muted={true}
                      width="100%"
                      height={300}
                    />
                  ) : educationEquityData[1]?.media_type == "youtube" ? (
                    <>
                      {" "}
                      <ReactPlayer
                        url={educationEquityData[1]?.media}
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src={
                          educationEquityData[1]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              educationEquityData[1]?.media
                            : "/about_video_2.png"
                        }
                        width={455}
                        height={300}
                        alt={educationEquityData[1]?.description}
                        className="about_img_bottom "
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="container mt-5 bg_border">
              <div className="row">
                <div className="col-md-4">
                  <ul className="about_ul_li">
                    {educationEquityData[0]?.description ? (
                      <li>{educationEquityData[0]?.description}</li>
                    ) : null}
                    {educationEquityData[1]?.description ? (
                      <li>{educationEquityData[1]?.description}</li>
                    ) : null}
                    {educationEquityData[2]?.description ? (
                      <li>{educationEquityData[2]?.description}</li>
                    ) : null}
                    {educationEquityData[3]?.description ? (
                      <li>{educationEquityData[3]?.description}</li>
                    ) : null}
                  </ul>
                </div>
                <div className="col-md-3">
                  {educationEquityData[2]?.media_type == "video" ? (
                    <ReactPlayer
                      url={
                        educationEquityData[2]?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL +
                            educationEquityData[2]?.media
                          : "demo-video.mp4"
                      }
                      controls={true}
                      playing={false}
                      muted={true}
                      width="100%"
                      height={300}
                    />
                  ) : educationEquityData[2]?.media_type == "youtube" ? (
                    <>
                      {" "}
                      <ReactPlayer
                        url={educationEquityData[2]?.media}
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src={
                          educationEquityData[2]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              educationEquityData[2]?.media
                            : "/about_video_2.png"
                        }
                        width={455}
                        height={300}
                        alt={educationEquityData[2]?.description}
                        className="about_img_bottom "
                      />
                    </>
                  )}
                  {/* <Image
                    src={
                      educationEquityData[2]?.media
                        ? process.env.NEXT_PUBLIC_SITE_URL + educationEquityData[2]?.media
                        : "/about_video_2.png"
                    }
                    width={180}
                    height={220}
                    alt={educationEquityData[2]?.description}
                    className="about_img_top"
                  /> */}
                </div>
                <div className="col-md-5">
                  <div className="about_video_1">
                    {educationEquityData[3]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          educationEquityData[3]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              educationEquityData[3]?.media
                            : "demo-video.mp4"
                        }
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    ) : educationEquityData[3]?.media_type == "youtube" ? (
                      <>
                        {" "}
                        <ReactPlayer
                          url={educationEquityData[3]?.media}
                          controls={true}
                          playing={false}
                          muted={true}
                          width="100%"
                          height={300}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          src={
                            educationEquityData[3]?.media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                educationEquityData[3]?.media
                              : "/about_video_2.png"
                          }
                          width={455}
                          height={300}
                          alt={educationEquityData[3]?.description}
                          className="about_img_bottom "
                        />
                      </>
                    )}
                    {/* <Image
                      src={
                        educationEquityData[3]?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL + educationEquityData[3]?.media
                          : "/about_video_2.png"
                      }
                      width={0}
                      height={280}
                      alt={educationEquityData[3]?.description}
                      className="about_video_1"
                      style={{ width: "100%" }}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="container ">
              <div className="row">
                <div className="col-md-4">
                  <h3 className="about_wrap_heading">Workforce Equity</h3>
                  <p className="about_wrap">
                    Workforce Equity is our commitment to a labor market in
                    which bias income gaps are eliminated, all jobs are good
                    careers and everyone who wants to work has access to
                    self-supporting and family supporting employment.
                  </p>
                </div>
                <div className="col-md-5">
                  <div className="about_video_1">
                    {/* <ReactPlayer
                      url={workforceEquityData[0]?.media ? process.env.NEXT_PUBLIC_SITE_URL + workforceEquityData[0]?.media : "/demo-video.mp4"}
                      controls
                      playing={true}
                      muted={true}
                      width='100%'
                      height={300}
                    /> */}
                    {workforceEquityData[0]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          workforceEquityData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              workforceEquityData[0]?.media
                            : "demo-video.mp4"
                        }
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    ) : workforceEquityData[0]?.media_type == "youtube" ? (
                      <>
                        {" "}
                        <ReactPlayer
                          url={workforceEquityData[0]?.media}
                          controls={true}
                          playing={false}
                          muted={true}
                          width="100%"
                          height={300}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          src={
                            workforceEquityData[0]?.media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                workforceEquityData[0]?.media
                              : "/about_video_2.png"
                          }
                          width={455}
                          height={300}
                          alt={workforceEquityData[0]?.description}
                          className="about_img_bottom "
                        />
                      </>
                    )}
                    {/* {workforceEquityData[0]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          workforceEquityData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              workforceEquityData[0]?.media
                            : "demo-video.mp4"
                        }
                        controls
                        playing={true}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    ) : (
                      <Image
                        src={
                          workforceEquityData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              workforceEquityData[0]?.media
                            : "/about_video_2.png"
                        }
                        width={455}
                        height={300}
                        alt={workforceEquityData[1]?.description}
                        className="about_img_bottom "
                      />
                    )} */}
                  </div>
                </div>
                <div className="col-md-3">
                  {workforceEquityData[1]?.media_type == "video" ? (
                    <ReactPlayer
                      url={
                        workforceEquityData[1]?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL +
                            workforceEquityData[1]?.media
                          : "demo-video.mp4"
                      }
                      controls={true}
                      playing={false}
                      muted={true}
                      width="100%"
                      height={300}
                    />
                  ) : workforceEquityData[1]?.media_type == "youtube" ? (
                    <>
                      {" "}
                      <ReactPlayer
                        url={workforceEquityData[1]?.media}
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src={
                          workforceEquityData[1]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              workforceEquityData[1]?.media
                            : "/about_video_2.png"
                        }
                        width={455}
                        height={300}
                        alt={workforceEquityData[1]?.description}
                        className="about_img_bottom "
                      />
                    </>
                  )}
                  {/* <Image
                    src={
                      workforceEquityData[1]?.media
                        ? process.env.NEXT_PUBLIC_SITE_URL + workforceEquityData[1]?.media
                        : "/about_video_2.png"
                    }
                    width={200}
                    height={250}
                    alt={workforceEquityData[1]?.description}
                    className="about_img_bottom "
                  /> */}
                </div>
              </div>
            </div>
            <div className="container mt-5 bg_border">
              <div className="row">
                <div className="col-md-4">
                  <ul className="about_ul_li">
                    {workforceEquityData[0]?.description ? (
                      <li>{workforceEquityData[0]?.description}</li>
                    ) : null}
                    {workforceEquityData[1]?.description ? (
                      <li>{workforceEquityData[1]?.description}</li>
                    ) : null}
                    {workforceEquityData[2]?.description ? (
                      <li>{workforceEquityData[2]?.description}</li>
                    ) : null}
                    {workforceEquityData[3]?.description ? (
                      <li>{workforceEquityData[3]?.description}</li>
                    ) : null}
                  </ul>
                </div>
                <div className="col-md-3">
                  {workforceEquityData[2]?.media_type == "video" ? (
                    <ReactPlayer
                      url={
                        workforceEquityData[2]?.media
                          ? NEXT_PUBLIC_SITE_URL + workforceEquityData[2]?.media
                          : "demo-video.mp4"
                      }
                      controls={true}
                      playing={false}
                      muted={true}
                      width="100%"
                      height={300}
                    />
                  ) : workforceEquityData[2]?.media_type == "youtube" ? (
                    <>
                      {" "}
                      <ReactPlayer
                        url={workforceEquityData[2]?.media}
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src={
                          workforceEquityData[2]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              workforceEquityData[2]?.media
                            : "/about_video_2.png"
                        }
                        width={455}
                        height={300}
                        alt={workforceEquityData[2]?.description}
                        className="about_img_bottom "
                      />
                    </>
                  )}
                  {/* <Image
                    src={
                      workforceEquityData[2]?.media
                        ? process.env.NEXT_PUBLIC_SITE_URL + workforceEquityData[2]?.media
                        : "/about_video_2.png"
                    }
                    width={200}
                    height={250}
                    alt={workforceEquityData[2]?.description}
                    className="about_img_top"
                  /> */}
                </div>
                <div className="col-md-5">
                  <div className="about_video_1">
                    {workforceEquityData[3]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          workforceEquityData[3]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              workforceEquityData[3]?.media
                            : "demo-video.mp4"
                        }
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    ) : workforceEquityData[3]?.media_type == "youtube" ? (
                      <>
                        {" "}
                        <ReactPlayer
                          url={workforceEquityData[3]?.media}
                          controls={true}
                          playing={false}
                          muted={true}
                          width="100%"
                          height={300}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          src={
                            workforceEquityData[3]?.media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                workforceEquityData[3]?.media
                              : "/about_video_2.png"
                          }
                          width={455}
                          height={300}
                          alt={workforceEquityData[3]?.description}
                          className="about_img_bottom "
                        />
                      </>
                    )}
                    {/* <Image
                      src={
                        workforceEquityData[3]?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL + workforceEquityData[3]?.media
                          : "/about_video_2.png"
                      }
                      width={0}
                      height={280}
                      alt={workforceEquityData[3]?.description}
                      className="about_video_1"
                      style={{ width: "100%" }}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="container ">
              <div className="row">
                <div className="col-md-4">
                  <h3 className="about_wrap_heading">Public Equity</h3>
                  <p className="about_wrap">
                    Public Equity our commitment to fairness and justice in the
                    formulation of public policy, distribution of public
                    services, implementation of policy and management of all
                    institutions serving the public directly or by contract.
                  </p>
                </div>
                <div className="col-md-5">
                  <div className="about_video_1">
                    {publicEquityData[0]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          publicEquityData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              publicEquityData[0]?.media
                            : "demo-video.mp4"
                        }
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    ) : publicEquityData[0]?.media_type == "youtube" ? (
                      <>
                        {" "}
                        <ReactPlayer
                          url={publicEquityData[0]?.media}
                          controls={true}
                          playing={false}
                          muted={true}
                          width="100%"
                          height={300}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          src={
                            publicEquityData[0]?.media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                publicEquityData[0]?.media
                              : "/about_video_2.png"
                          }
                          width={455}
                          height={300}
                          alt={publicEquityData[0]?.description}
                          className="about_img_bottom "
                        />
                      </>
                    )}
                    {/* {publicEquityData[0]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          publicEquityData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL + publicEquityData[0]?.media
                            : "demo-video.mp4"
                        }
                        controls
                        playing={true}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    ) : (
                      <Image
                        src={
                          publicEquityData[0]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL + publicEquityData[0]?.media
                            : "/about_video_2.png"
                        }
                        width={455}
                        height={300}
                        alt={publicEquityData[1]?.description}
                        className="about_img_bottom "
                      />
                    )} */}
                  </div>
                </div>
                <div className="col-md-3">
                  {publicEquityData[1]?.media_type == "video" ? (
                    <ReactPlayer
                      url={
                        publicEquityData[1]?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL +
                            publicEquityData[1]?.media
                          : "demo-video.mp4"
                      }
                      controls={true}
                      playing={false}
                      muted={true}
                      width="100%"
                      height={300}
                    />
                  ) : publicEquityData[1]?.media_type == "youtube" ? (
                    <>
                      {" "}
                      <ReactPlayer
                        url={publicEquityData[1]?.media}
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src={
                          publicEquityData[1]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              publicEquityData[1]?.media
                            : "/about_video_2.png"
                        }
                        width={455}
                        height={300}
                        alt={publicEquityData[1]?.description}
                        className="about_img_bottom "
                      />
                    </>
                  )}
                  {/* <Image
                    src={
                      publicEquityData[1]?.media
                        ? process.env.NEXT_PUBLIC_SITE_URL + publicEquityData[1]?.media
                        : "/about_video_2.png"
                    }
                    width={200}
                    height={250}
                    alt={publicEquityData[1]?.description}
                    className="about_img_bottom "
                  /> */}
                </div>
              </div>
            </div>
            <div className="container mt-5 bg_border">
              <div className="row">
                <div className="col-md-4">
                  <ul className="about_ul_li">
                    {publicEquityData[0]?.description ? (
                      <li>{publicEquityData[0]?.description}</li>
                    ) : null}
                    {publicEquityData[1]?.description ? (
                      <li>{publicEquityData[1]?.description}</li>
                    ) : null}
                    {publicEquityData[2]?.description ? (
                      <li>{publicEquityData[2]?.description}</li>
                    ) : null}
                    {publicEquityData[3]?.description ? (
                      <li>{publicEquityData[3]?.description}</li>
                    ) : null}
                  </ul>
                </div>
                <div className="col-md-3">
                  {publicEquityData[2]?.media_type == "video" ? (
                    <ReactPlayer
                      url={
                        publicEquityData[2]?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL +
                            publicEquityData[2]?.media
                          : "demo-video.mp4"
                      }
                      controls={true}
                      playing={false}
                      muted={true}
                      width="100%"
                      height={300}
                    />
                  ) : publicEquityData[2]?.media_type == "youtube" ? (
                    <>
                      {" "}
                      <ReactPlayer
                        url={publicEquityData[2]?.media}
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src={
                          publicEquityData[2]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              publicEquityData[2]?.media
                            : "/about_video_2.png"
                        }
                        width={455}
                        height={300}
                        alt={publicEquityData[2]?.description}
                        className="about_img_bottom "
                      />
                    </>
                  )}
                  {/* <Image
                    src={
                      publicEquityData[2]?.media
                        ? process.env.NEXT_PUBLIC_SITE_URL + publicEquityData[2]?.media
                        : "/about_video_2.png"
                    }
                    width={200}
                    height={250}
                    alt={publicEquityData[2]?.description}
                    className="about_img_top"
                  /> */}
                </div>
                <div className="col-md-5">
                  <div className="about_video_1">
                    {publicEquityData[3]?.media_type == "video" ? (
                      <ReactPlayer
                        url={
                          publicEquityData[3]?.media
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              publicEquityData[3]?.media
                            : "demo-video.mp4"
                        }
                        controls={true}
                        playing={false}
                        muted={true}
                        width="100%"
                        height={300}
                      />
                    ) : publicEquityData[3]?.media_type == "youtube" ? (
                      <>
                        {" "}
                        <ReactPlayer
                          url={publicEquityData[3]?.media}
                          controls={true}
                          playing={false}
                          muted={true}
                          width="100%"
                          height={300}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          src={
                            publicEquityData[3]?.media
                              ? process.env.NEXT_PUBLIC_SITE_URL +
                                publicEquityData[3]?.media
                              : "/about_video_2.png"
                          }
                          width={455}
                          height={300}
                          alt={publicEquityData[3]?.description}
                          className="about_img_bottom "
                        />
                      </>
                    )}
                    {/* <Image
                      src={
                        publicEquityData[3]?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL + publicEquityData[3].media
                          : "/about_video_2.png"
                      }
                      width={0}
                      height={280}
                      alt={publicEquityData[3]?.description}
                      className="about_video_1"
                      style={{ width: "100%" }}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default About;
