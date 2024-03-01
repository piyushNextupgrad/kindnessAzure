import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "@/layout/layoutTemplate";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  checkImageOrVideoFromUrl,
  checkIsNumber,
  randomKey,
  emailValidation,
} from "@/store/library/utils";
import ReactPlayer from "react-player";
import { loadStripe } from "@stripe/stripe-js";
import Modal from "./components/admin/Modal";
import showNotification from "@/helpers/show_notification";
import { getInvolvePageSevices } from "@/store/services/getInvolvedPageService";
import { Spinner } from "react-bootstrap";

const Get_involved = () => {
  const [data2, setdata2] = useState("");
  const [data3, setdata3] = useState("");
  const [data4, setdata4] = useState("");

  const [sponsorPartnerData, setSponsorPartnerData] = useState([]);

  const [donationMessage, setDonationMessage] = useState("");

  const [amountFromCheckbox, setAmountFromCheckbox] = useState(0);
  const [customAmount, setCustomAmount] = useState(0);
  const [customAmountDisable, setCustomAmountDisable] = useState(false);

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [donorGiftNote, setDonorGiftNote] = useState("");
  const [amt, setamt] = useState(null);
  const [toggle, settoggle] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [interestList, setInterestList] = useState([]);
  const [interest, setinterest] = useState("");
  const [msg, setmsg] = useState("");

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = loadStripe(publishableKey);

  const [selectedOption, setSelectedOption] = useState("");
  const router = useRouter();

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const getInterestList = async () => {
    try {
      const intListresp = await getInvolvePageSevices.getInterestList();

      if (intListresp?.data?.success) {
        const activeIntrests = intListresp?.data?.data?.filter(
          (item) => item.active == "1"
        );
        setInterestList(activeIntrests);
      }
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  async function postLearnMore() {
    if (name != "" && email != "" && phone != "" && selectedOption != "") {
      setLoaderStatus(true);

      try {
        const formData = new FormData();
        formData.append("section_name", "learn_more");
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("interest", selectedOption);
        formData.append("message", msg);

        const response =
          await getInvolvePageSevices.updateLearnMoreSectionFrontend(formData);

        if (response?.data?.success == true) {
          setLoaderStatus(false);
          setname("");
          setemail("");
          setphone("");
          setSelectedOption("");
          setmsg("");

          showNotification("Form Submit Successfully", "Success");
        } else {
          setLoaderStatus(false);
          if (response?.data?.message == "Email already exists") {
            showNotification("Email already exists", "Error");
          } else {
            showNotification("Email not sent", "Error");
          }
        }
      } catch (err) {
        // Handle any other errors that may occur during the request
        console.log(err);
      }
    } else {
      showNotification("Please fill all fields", "Error");
    }
  }

  const createCheckOutSession = async (event) => {
    if (
      customAmount == 0 &&
      amountFromCheckbox != 0 &&
      amountFromCheckbox != undefined
    ) {
      console.log("if condition", amountFromCheckbox);
      setamt(amountFromCheckbox);
    } else if (
      customAmount != undefined &&
      customAmount != 0 &&
      amountFromCheckbox == 0
    ) {
      console.log("else if condition", customAmount);
      setamt(customAmount);
    }
  };

  function callPopup() {
    if (
      donationMessage &&
      amt &&
      donorName &&
      donorEmail &&
      donorPhone &&
      donorAddress &&
      donorGiftNote
    ) {
      settoggle(true);
    } else {
      setamt(null);
      showNotification("Please fill out all the fields", "Error");
    }
  }

  useEffect(() => {
    getInterestList();
    camppage2();
    camppage3();
    showNewsSection();

    console.log("router==>", router.asPath);
    const index = router.asPath.indexOf("#");
    const scrollId = index !== -1 ? router.asPath.substring(index + 1) : "";

    if (scrollId.length > 0) {
      const section = document.getElementById(scrollId);
      setTimeout(() => {
        section?.scrollIntoView({ behavior: "smooth" });
      }, 2000);
    }
  }, []);

  const camppage3 = async () => {
    try {
      const resp2 = await getInvolvePageSevices.getStaticData();

      setdata4(resp2?.data?.data[0]);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };
  const camppage2 = async () => {
    try {
      const resp2 = await getInvolvePageSevices.getStaticDataPiyush();

      if (resp2?.data?.success) {
        let get_involved = resp2?.data?.data?.filter(
          (item) => item?.page_name == "get_involved"
        );
        let donate = resp2?.data?.data?.filter(
          (item) => item?.page_name == "donate"
        );
        console.log("get_involved", get_involved);
        console.log("donate", donate);
        if (donate[0]?.image) {
          donate[0].imageType = checkImageOrVideoFromUrl(donate[0]?.image);
        }

        setdata3(get_involved[0]);
        setdata2(donate[0]);
      } else {
      }
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  const showNewsSection = async () => {
    try {
      let params = {};
      params.sectionName = "camp_news";

      const newsResp = await getInvolvePageSevices.getDynamicData(params);

      if (newsResp?.data?.success) {
        let respData = newsResp?.data?.data?.reverse();
        let SponserPartner = respData?.filter(
          (item) => item?.sectionName == "spon_partner" && item?.active == "1"
        );
        setSponsorPartnerData(SponserPartner);
      } else {
        setSponsorPartnerData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addDefaultAmonut = (data, amount) => {
    if (data?.target.checked) {
      setCustomAmountDisable(true);
      setAmountFromCheckbox(amount);
      setCustomAmount(0);
    }
  };

  function handleClear(event) {
    event?.preventDefault();
    const radioButtons = document.querySelectorAll(
      "input[type='radio']:checked"
    );
    if (radioButtons.length > 0) {
      radioButtons.forEach((radioButton) => {
        radioButton.checked = false;
      });
      setCustomAmountDisable(false);
      setAmountFromCheckbox(0);
    }
  }

  useEffect(() => {
    console.log(
      donationMessage,
      amountFromCheckbox,
      customAmount,
      donorName,
      donorEmail,
      donorPhone,
      donorAddress,
      donorGiftNote,
      amt
    );
  }, [
    donationMessage,
    amountFromCheckbox,
    customAmount,
    donorName,
    donorEmail,
    donorPhone,
    donorAddress,
    donorGiftNote,
    amt,
  ]);

  useEffect(() => {
    console.log("amount current value", amt);
    if (amt != null && amt > 0) {
      callPopup();
    }
  }, [amt]);

  return (
    <>
      <Head>
        <title>Support - Kindness Campaign</title>
        <meta name="description" content="Support - Kindness Campaign" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout title={"Support"}>
        <section>
          <Modal
            amt={amt}
            donationMessage={donationMessage}
            customAmount={customAmount}
            amountFromCheckbox={amountFromCheckbox}
            donorName={donorName}
            donorEmail={donorEmail}
            donorPhone={donorPhone}
            donorAddress={donorAddress}
            donorGiftNote={donorGiftNote}
            setDonorName={setDonorName}
            setDonorEmail={setDonorEmail}
            setDonorPhone={setDonorPhone}
            setDonorAddress={setDonorAddress}
            setDonorGiftNote={setDonorGiftNote}
            setamt={setamt}
            setDonationMessage={setDonationMessage}
            setAmountFromCheckbox={setAmountFromCheckbox}
            setCustomAmount={setCustomAmount}
            handleClear={handleClear}
            toggle={toggle}
            settoggle={settoggle}
          />
          <div className="container">
            <div className="event_wrap_main ">
              <div className="row">
                <div className="col-md-12">
                  <h1 className="about_the_campaign">GET INVOLVED</h1>

                  <ul className="d-flex_wrap">
                    <li>Donate</li>
                    <li>
                      <i
                        className="fa fa-square square_wrap"
                        aria-hidden="true"
                      ></i>
                      Volunteer
                    </li>
                    <li>
                      <i
                        className="fa fa-square square_wrap"
                        aria-hidden="true"
                      ></i>
                      Partner
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-lg-4 mt-4">
                <div className="get_involved_sidebar_1">
                  <div className="container">
                    <form className="donation_form">
                      <h3
                        className="event_categories_wrap text-center"
                        style={{ fontSize: "15pt" }}
                      >
                        Support Our Cause
                      </h3>
                      <h3
                        className="event_categories_wrap text-center"
                        style={{ marginTop: "-5px", marginBottom: 20 }}
                      >
                        {" "}
                        LEAVE A DONATION
                      </h3>

                      <div className="mb-3">
                        <textarea
                          className="form-control donation_form_text"
                          id="Textarea1"
                          placeholder="What Inspired You To Give? *"
                          rows="3"
                          value={donationMessage}
                          onChange={(e) => setDonationMessage(e?.target?.value)}
                        ></textarea>
                      </div>

                      <div className="container">
                        <div className="row">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Select Gift Amount: *
                          </label>
                          <div className="col-md-12 col-lg-6">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault1"
                                onChange={(e) => addDefaultAmonut(e, 1000)}
                              />
                              <label
                                className="form-check-label label_radio"
                                htmlFor="flexRadioDefault1"
                              >
                                $1,000
                              </label>
                            </div>

                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault2"
                                defaultChecked=""
                                onChange={(e) => addDefaultAmonut(e, 250)}
                              />
                              <label
                                className="form-check-label label_radio"
                                htmlFor="flexRadioDefault2"
                              >
                                $250
                              </label>
                            </div>
                          </div>

                          <div className="col-md-12 col-lg-6">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault3"
                                onChange={(e) => addDefaultAmonut(e, 500)}
                              />
                              <label
                                className="form-check-label label_radio"
                                htmlFor="flexRadioDefault3"
                              >
                                $ 500
                              </label>
                            </div>

                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault4"
                                defaultChecked=""
                                value={100}
                                onChange={(e) => addDefaultAmonut(e, 100)}
                              />
                              <label
                                className="form-check-label label_radio"
                                htmlFor="flexRadioDefault4"
                              >
                                $100
                              </label>
                            </div>
                            <div className="form-check">
                              <button
                                className="clearBtn"
                                onClick={handleClear}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <input
                          type="number"
                          className="donation_form_text"
                          id="formGroupExampleInput"
                          placeholder="Custom Gift Amount:"
                          value={customAmount ? customAmount : ""}
                          onChange={(e) => setCustomAmount(e?.target?.value)}
                          disabled={customAmountDisable}
                        />
                        <div className="error">
                          {!checkIsNumber(customAmount)
                            ? "Please fill valid amount"
                            : ""}
                        </div>
                      </div>
                      <input
                        type="text"
                        className="donation_form_text"
                        placeholder="Name"
                        aria-label="Name *"
                        value={donorName}
                        onChange={(e) => setDonorName(e?.target?.value)}
                      />

                      <input
                        type="email"
                        className="donation_form_text"
                        id="inputEmail"
                        placeholder="Email *"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e?.target?.value)}
                      />

                      <input
                        type="number"
                        className="donation_form_text"
                        id="inputnumber"
                        placeholder="Phone:"
                        value={donorPhone}
                        onChange={(e) => {
                          e.target.value.length <= 10
                            ? setDonorPhone(e?.target?.value)
                            : showNotification(
                                "Only 10 digits allowed for phone number",
                                "Error"
                              );
                        }}
                      />

                      <textarea
                        className="form-control donation_form_text"
                        id="Textarea2"
                        placeholder="Address: *"
                        rows="3"
                        value={donorAddress}
                        onChange={(e) => setDonorAddress(e?.target?.value)}
                      ></textarea>

                      <textarea
                        className="form-control donation_form_text"
                        id="Textarea3"
                        placeholder="Gift Note:"
                        rows="3"
                        value={donorGiftNote}
                        onChange={(e) => setDonorGiftNote(e?.target?.value)}
                      ></textarea>
                      <div className="text-center">
                        {/*  <button
                          type="button"
                          className="btn btn-primary donate_btn"
                        >
                          Donate
                        </button> */}

                        <button
                          type="button"
                          onClick={createCheckOutSession}
                          className="btn btn-primary donate_btn"
                        >
                          {loading ? "Processing..." : "Donate"}
                        </button>
                      </div>

                      <img
                        src="../patment-img.png"
                        alt="image"
                        className="rounded mx-auto d-block mt-4"
                      />
                    </form>
                  </div>

                  <div className="container text-center mt-5">
                    <Image
                      src={
                        data4?.zelle_image
                          ? process.env.NEXT_PUBLIC_SITE_URL +
                            data4?.zelle_image
                          : "/bg-video-banner.jpg"
                      }
                      width={70}
                      height={35}
                      alt={data4?.zelle_text}
                    />
                    <p className="fst_wrap text-center">
                      {data4?.zelle_text}
                      <br />
                      the email{" "}
                      <Link href={`mailto:${data4?.mailing_text}`}>
                        {data4?.mailing_text}
                      </Link>
                    </p>

                    <Image
                      src={
                        data4?.cash_app_image
                          ? process.env.NEXT_PUBLIC_SITE_URL +
                            data4?.cash_app_image
                          : "/bg-video-banner.jpg"
                      }
                      width={250}
                      height={230}
                      alt={data4?.cash_app_text}
                    />

                    <p className="fst_wrap text-center">
                      {data4?.cash_app_text}
                    </p>

                    <p className="fst_wrap text-center">
                      <b>
                        The Kindness Campaign <br />
                        703 E 75th St
                        <br />
                        Chicago, IL 60619 - 1907
                      </b>
                    </p>
                  </div>

                  <div className="donation_form">
                    {/* <h3 className="event_categories_wrap text-center">
                      LEARN MORE
                    </h3> */}
                    <h3 className="event_categories_wrap text-center">
                      {data3?.section_post}
                    </h3>

                    <input
                      type="text"
                      className="donation_form_text"
                      placeholder="Name"
                      aria-label="Name *"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                    />

                    <input
                      type="email"
                      className="donation_form_text"
                      id="inputEmail"
                      placeholder="Email *"
                      onChange={(e) => setemail(e.target.value)}
                      value={email}
                    />

                    <input
                      type="phone"
                      className="donation_form_text"
                      id="inputnumber"
                      placeholder="Phone:"
                      value={phone}
                      onChange={(e) => {
                        e?.target?.value?.length < 11
                          ? setphone(e?.target?.value)
                          : showNotification(
                              "Only 10 digits allowed for phone number",
                              "Error"
                            );
                      }}
                    />

                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Interest: *
                    </label>
                    <ul className="fix-radio" style={{ display: "grid" }}>
                      {interestList?.length
                        ? interestList?.map((item, index) => (
                            <div className="event_intrest" key={index}>
                              <input
                                className=" label_radio "
                                type="radio"
                                value={item?.id}
                                name="radio-group"
                                id="flexCheckDefault_1"
                                checked={
                                  selectedOption == item?.id ? true : false
                                }
                                onChange={handleRadioChange}
                              />
                              &nbsp;
                              <label
                                className="form-check-label label_radio"
                                htmlFor="flexCheckDefault_1"
                              >
                                {" "}
                                {item?.interest_type}{" "}
                              </label>
                            </div>
                          ))
                        : ""}
                    </ul>

                    <textarea
                      className="form-control donation_form_text "
                      id="Textarea6"
                      placeholder="Message:"
                      rows="3"
                      value={msg}
                      onChange={(e) => setmsg(e.target.value)}
                    ></textarea>

                    <div className="text-center">
                      {loaderStatus ? (
                        <Spinner
                          style={{
                            width: "30px",
                            height: "30px",
                            color: "#0a1c51fc",
                          }}
                          animation="border"
                        />
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary donate_btn"
                          onClick={postLearnMore}
                        >
                          SEND
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar End */}

              {/* Sidebar Start */}
              <div className="col-md-12 col-lg-8" id="donate">
                <div className="container">
                  <div className="Event_sidebar">
                    <div className="on_going_events mt-4">
                      <p>DONATE</p>
                    </div>

                    <div className="container">
                      <div className="row">
                        <p className="fst_event_involved_sidebar">
                          {data2?.header_text}
                        </p>
                      </div>
                    </div>

                    <div className="container">
                      <div className="about_video_2">
                        {data2?.section_media == "video" ? (
                          <ReactPlayer
                            url={
                              data2?.image
                                ? process.env.NEXT_PUBLIC_SITE_URL +
                                  data2?.image
                                : "demo-video.mp4"
                            }
                            controls={true}
                            playing={false}
                            muted={false}
                            width={"100%"}
                            height={300}
                          />
                        ) : (
                          <>
                            {data2?.section_media == "youtube" ? (
                              <ReactPlayer
                                url={
                                  data2?.image ? data2?.image : "demo-video.mp4"
                                }
                                controls={true}
                                playing={false}
                                muted={false}
                                width={"100%"}
                                height={300}
                              />
                            ) : (
                              <>
                                <Image
                                  src={
                                    data2?.image
                                      ? process.env.NEXT_PUBLIC_SITE_URL +
                                        data2?.image
                                      : "/bg-video-banner.jpg"
                                  }
                                  height={300}
                                  width={800}
                                  alt="video-banner"
                                  style={{ width: "100%", objectFit: "cover" }}
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="container">
                      <div>
                        <div className="mt-5 text-center">
                          <h4 className="get_involved_heading">WISH LISTS</h4>
                          <p className="get_involved_p text-center">
                            {data2?.page_text}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="container">
                      <div>
                        <p className="get_involved_p text-center">
                          {data2?.section_title}
                        </p>

                        <div className="text-center">
                          <a
                            target="_blank"
                            href={
                              process.env.NEXT_PUBLIC_SITE_URL + data2?.image2
                            }
                            className="buy-btn involved_btn"
                            download
                          >
                            Students (PFD)
                          </a>
                        </div>

                        <p className="get_involved_p text-center mt-5">
                          {data2?.section_post}
                        </p>

                        <div className="text-center">
                          <a
                            target="_blank"
                            href={
                              process.env.NEXT_PUBLIC_SITE_URL + data2?.image3
                            }
                            className="buy-btn involved_btn"
                            download
                          >
                            Homeless (PFD)
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="container" id="volunteer">
                      <div className="Event_sidebar_3">
                        <div className="voluntee_p">
                          <p>VOLUNTEER</p>
                        </div>

                        <div className="container">
                          <div className="row">
                            <p className="fst_event_involved_sidebar">
                              {data3?.header_text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="container" id="partner">
                      <div className="partner_p">
                        <p>PARTNER</p>
                      </div>

                      <div className="container">
                        <div className="row">
                          <p className="fst_event_involved_sidebar">
                            {data3?.page_text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="Sponsors-and-Partner bg-secondary-1">
            <div className="container sponsors_wrap">
              <div className="row">
                {data5?.map((item) => (
                  <div key={randomKey()} className="col">
                    {item.sectionName == "SponserPartner" ? (
                      <Image src={item?.media}
                     width={224}
                     height={115}
                     alt="Picture of the author"
                     className="img-fluid"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            <h2 className="text-center mt-5 support ">
              “Thank you for all your support. We appreciate you!”
            </h2>
          </section> */}

        {/* <p className="Sponsors_Partners_Spotligh mt-5">
          Sponsors &amp; Partners Spotlight
        </p>
        {sponsorPartnerData?.length ? (
          <section className="Sponsors-and-Partner bg-secondary-1">
            <div className="container sponsors_wrap">
              <div className=" row sponsors_wrap_row">
                {sponsorPartnerData?.map((sponsItem, index) => {
                  if (index < 5)
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
              </div>

              <div className="row sponsors_wrap_row mt-4" style={{display:"flex",flexWrap:"wrap"}}>
                {sponsorPartnerData?.map((sponsItem, index) => {
                  // if (index > 4 && index < 10)
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
              </div>
            </div>

            <h2 className="text-center mt-4 support">
              {" "}
              “Thank you for all your support. We appreciate you!”
            </h2>
          </section>
        ) : (
          ""
        )} */}
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
};

export default Get_involved;
