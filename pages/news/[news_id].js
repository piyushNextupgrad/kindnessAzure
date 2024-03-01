import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/layout/layoutTemplate";

import { getInvolvePageSevices } from "@/store/services/getInvolvedPageService";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";
import { newsPageService } from "../../store/services/newsPageService";
import showNotification from "@/helpers/show_notification";
import { BiSolidUserCircle } from "react-icons/bi";
import { getFormatedDate } from "../../store/library/utils";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ReactPlayer from "react-player";

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  LinkedinShareButton,
} from "next-share";

export async function getStaticPaths() {
  // const response = await fetch(
  //   "https://nextupgrad.us/laravel-old/diligent-api/api/getHomeCampNewsAndSponsPartner"
  // );
  //console.log('process.env.NEXT_PUBLIC_API_URL+"api/getHomeCampNews"', process.env.NEXT_PUBLIC_API_URL+"api/getHomeCampNewsAndSponsPartner");
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "api/getHomeCampNewsAndSponsPartner"
  );

  const data1 = await response.json();

  const paths = data1?.data?.map((curElm) => {
    return {
      params: {
        news_id: curElm.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  console.log("context", context);
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      "api/getHomeCampNewsAndSponsPartner?id=" +
      context.params.news_id
  );

  const data1 = await response.json();

  const data = data1?.data[0];

  let media_url = "";
  if (data?.media_type == "youtube") {
    media_url = data?.media;
  } else {
    media_url = process.env.NEXT_PUBLIC_SITE_URL + data?.media;
  }

  return {
    props: {
      data,
      Newsid: context.params.news_id,
      openGraphData: [
        {
          property: "og:image",
          content: media_url,
          key: "ogimage",
        },
        {
          property: "og:image:width",
          content: "400",
          key: "ogimagewidth",
        },
        {
          property: "og:image:height",
          content: "300",
          key: "ogimageheight",
        },
        {
          property: "og:url",
          content: process.env.NEXT_PUBLIC_BASE_LIVE_URL + "news/" + data?.id,
          key: "ogurl",
        },
        {
          property: "og:image:secure_url",
          content: media_url,
          key: "ogimagesecureurl",
        },
        {
          property: "og:title",
          content: data?.title,
          key: "ogtitle",
        },
        {
          property: "og:description",
          content: data?.news_artical,
          key: "ogdesc",
        },
        {
          property: "og:type",
          content: "website",
          key: "website",
        },
      ],
    },
    revalidate: 10,
  };
}

function NewsDetailPage({ data, Newsid }) {
  const router = useRouter();
  console.log("Newsid", data, Newsid);
  const [sortedCommentsOfNews, setSortedCommentsOfNews] = useState([]);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Cmt, setCmt] = useState("");
  const [isSubmittingLoader, setIsSubmittingLoader] = useState(false);

  useEffect(() => {
    if (router.query.news_id) {
      let id = router.query?.news_id;
      console.log("Newsid", Newsid);
      fetchComments(id);
    }
  }, [router.query.news_id]);

  //function to fetch comments data
  async function fetchComments(params) {
    try {
      const resp = await newsPageService.getFilteredComments(params);

      const sortedComments = resp.data.data.filter(
        (item) => item.post_id == params
      );

      setSortedCommentsOfNews(sortedComments);
    } catch (error) {
      console.log(error);
    }
  }
  //function to post comments
  async function postUserComments(e) {
    e.preventDefault();
    if (Name != "" && Email != "" && Cmt != "") {
      setIsSubmittingLoader(true);
      try {
        const formdata = new FormData();
        formdata.append("name", Name);
        formdata.append("secName", "news");
        formdata.append("comment", Cmt);
        formdata.append("eventNewsId", router.query?.news_id);
        formdata.append("emailId", Email);
        const resp = await newsPageService.postComments(formdata);
        // console.log(resp);
        if (resp.data.success == true) {
          let news_id = router.query?.news_id;

          // fetchComments(news_id);
          setIsSubmittingLoader(false);
          showNotification(
            "Your comment is saved. It will be visible after Approval.",
            "Success"
          );
          setCmt("");
          setName("");
          setEmail("");
        } else {
          setIsSubmittingLoader(false);
          showNotification("There is some error in the input data.", "Error");
          setCmt("");
          setName("");
          setEmail("");
        }
      } catch (error) {
        setIsSubmittingLoader(false);
        showNotification("There is some error in the input data.", "Error");
        console.log(error);
      }
    } else {
      showNotification("Please fill all fields.");
    }
  }

  return (
    <>
      <Layout>
        {isSubmittingLoader ? (
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
        ) : (
          ""
        )}

        <Head>
          {console.log("data", data)}
          <title>{data?.title}</title>
          <meta name="description" content={data?.news_artical} />

          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={process.env.NEXT_PUBLIC_BASE_LIVE_URL + "news/" + data?.id}
            key="og-url"
          />
          <meta property="og:title" content={data?.title} key="og-title" />
          <meta
            property="og:description"
            content={data?.news_artical}
            key="og-desc"
          />
          <meta
            property="og:image"
            content={process.env.NEXT_PUBLIC_SITE_URL + data?.media}
            key="og-image"
          />

          <meta property="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:url"
            content={process.env.NEXT_PUBLIC_BASE_LIVE_URL + "news/" + data?.id}
          />
          <meta property="twitter:title" content={data?.title} />
          <meta property="twitter:description" content={data?.news_artical} />
          <meta
            property="twitter:image"
            content={process.env.NEXT_PUBLIC_SITE_URL + data?.media}
          />

          <link
            rel="canonical"
            href={process.env.NEXT_PUBLIC_BASE_LIVE_URL + "news/" + data?.id}
          />
        </Head>

        <section className="news_title_one ">
          <div
            className="container aos-init aos-animate bottom-bdr"
            data-aos="fade-up"
          >
            <h3 className="text-center mb-5 mt-4 kindness_campaign">
              The Kindness Campaign News
            </h3>
            {data?.media ? (
              <div className="row">
                <div className="col-md-12 col-lg align-self-center">
                  {/* <Image
                    src={
                      data?.media
                        ? process.env.NEXT_PUBLIC_SITE_URL + data?.media
                        : "news-title.png"
                    }
                    width={0}
                    height={0}
                    alt={data?.title}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                  /> */}
                  {data?.media_type == "image" ? (
                    <Image
                      src={
                        data?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL + data?.media
                          : "/no-img.jpg"
                      }
                      width={0}
                      height={0}
                      alt={data?.title}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                    />
                  ) : data.media_type == "video" ? (
                    <ReactPlayer
                      url={
                        data?.media
                          ? process.env.NEXT_PUBLIC_SITE_URL + data?.media
                          : "/no-img.jpg"
                      }
                      controls={true}
                      playing={false}
                      width={"100%"}
                    />
                  ) : (
                    <ReactPlayer
                      url={data?.media}
                      controls={true}
                      playing={false}
                      muted={false}
                      width={"100%"}
                    />
                  )}
                </div>
                <div className="col-md-12 col-lg-6">
                  <p className="News_titleSingleNews">{data?.title}</p>
                  <p className="fst2">{data?.news_artical}</p>
                </div>
              </div>
            ) : (
              <SkeletonTheme baseColor="#88b6de" highlightColor="#6c8ac4">
                <div className="skeletonNewsBanner">
                  <Skeleton height={350} width={450} duration={1} />
                  <div className="skeletonTitle">
                    <Skeleton
                      height={13}
                      width={70}
                      duration={1}
                      baseColor="#9ce37d"
                      highlightColor="#6ec348"
                    />
                    <div className="skeletonNewsContent1">
                      <Skeleton
                        height={10}
                        width={550}
                        duration={1}
                        baseColor="#e2e2e2"
                        highlightColor="#bdbbbb"
                        count={4}
                      />
                      <Skeleton
                        height={10}
                        width={270}
                        duration={1}
                        baseColor="#e2e2e2"
                        highlightColor="#bdbbbb"
                      />
                    </div>
                    <div className="skeletonNewsContent">
                      <Skeleton
                        height={10}
                        width={550}
                        duration={1}
                        baseColor="#e2e2e2"
                        highlightColor="#bdbbbb"
                        count={3}
                      />
                      <Skeleton
                        height={10}
                        width={270}
                        duration={1}
                        baseColor="#e2e2e2"
                        highlightColor="#bdbbbb"
                      />
                    </div>
                  </div>
                </div>
              </SkeletonTheme>
            )}

            <div className="row mt-4">
              <div className="col-3">
                <h3 className="align-self-center">
                  <Link href="#CommentsSec">
                    <span className="share_wrap">
                      <i className="fa fa-comment" aria-hidden="true" />

                      {sortedCommentsOfNews?.length > 0
                        ? sortedCommentsOfNews.length
                        : "0"}
                    </span>
                  </Link>
                </h3>
              </div>
              <div className="col-9">
                <h3 className="align-self-center">
                  <span className="share_wrap"> Share </span>
                  &nbsp;&nbsp;
                  <FacebookShareButton
                    url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${data?.id}`}
                    quote={data?.title}
                    hashtag={`#${data?.title} kindnessCampaign`}
                  >
                    {" "}
                    <i
                      className="fa fa-facebook share_button_tkc"
                      aria-hidden="true"
                    />
                    &nbsp;
                  </FacebookShareButton>
                  &nbsp;
                  <TwitterShareButton
                    url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${data?.id}`}
                    title={data?.title}
                  >
                    {" "}
                    <i
                      className="fa fa-twitter share_button_tkc"
                      aria-hidden="true"
                    />
                    &nbsp;
                  </TwitterShareButton>
                  &nbsp;
                  <LinkedinShareButton
                    url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}/news/${data?.id}`}
                    title={data?.title}
                  >
                    {" "}
                    <i
                      className="fa fa-linkedin-square share_button_tkc"
                      aria-hidden="true"
                    ></i>{" "}
                    &nbsp;
                  </LinkedinShareButton>
                </h3>
              </div>
            </div>
          </div>
          <div className="campaign_comments">
            <div>
              <p id="CommentsSec">Comments:</p>
              <div>
                {sortedCommentsOfNews.length > 0 ? (
                  <>
                    {sortedCommentsOfNews.map((item) => (
                      <>
                        <div>
                          <h3 className="cmtUserDetails">
                            <BiSolidUserCircle className="userIcon" />
                            <div className="cmtInSec">
                              <p>
                                {item?.name} &nbsp;{" "}
                                {getFormatedDate(item?.created_at, "MM-DD-Y")}
                              </p>
                              <h6>{item?.comment}</h6>
                              {/* <p className="cmtemail">{item.email_id}</p> */}
                            </div>
                          </h3>
                        </div>
                        <hr />
                      </>
                    ))}
                  </>
                ) : null}
              </div>
            </div>

            <form>
              <label>Add Comment:</label>
              <input
                value={Name}
                type="text"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                value={Email}
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />

              <textarea
                value={Cmt}
                id="w3review"
                name="w3review"
                rows="10"
                cols="30"
                placeholder="Type your comment"
                onChange={(e) => {
                  if (e.target.value.length < 400) {
                    setCmt(e.target.value);
                  } else {
                    showNotification("Character limit reached.");
                  }
                }}
              ></textarea>
              <div>
                <button className="cmtSubmitBtn" onClick={postUserComments}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default NewsDetailPage;
