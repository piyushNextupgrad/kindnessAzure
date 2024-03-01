import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import "react-calendar/dist/Calendar.css";
import Image from "next/image";
import Layout from "@/layout/layoutTemplate";
import { eventPageSevices } from "@/store/services";
import ImageSlider from "../components/admin/ImageSlider";
import { getFormatedDate } from "@/store/library/utils";
import { Spinner } from "react-bootstrap";
import { randomKey } from "@/store/library/utils";
import { convertTo12HourFormat } from "../../store/library/utils";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import showNotification from "@/helpers/show_notification";
import { addToGoogleCalendar } from "@/store/library/utils";
import ReactPlayer from "react-player";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "next-share";

export async function getStaticPaths() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "api/getEventManagement"
  );

  const data1 = await response.json();

  const paths = data1?.data?.map((curElm) => {
    return {
      params: {
        id: curElm.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const id = context.params.id;
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "api/getEventManagement?id=" + id
  );
  const data2 = await response.json();
  const filter_data = data2?.data;
  return {
    props: { filter_data },
    revalidate: 10,
  };
}

const singleEventData = ({ filter_data }) => {
  const router = useRouter();

  let id = router.query?.id;
  const filter_data2 = filter_data;

  const [filteredCategoryName, setFilteredCategoryName] = useState([]);
  const [searchCategoryTitle, setSearchCategoryTitle] = useState("");
  const [allEvents, setallEvents] = useState([]);
  const [filteredAllEvents, setfilteredAllEvents] = useState([]);
  const [filteredAllEventsBackup, setfilteredAllEventsBackup] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [value, onChange] = useState(null);
  const [date, setDate] = useState(null);

  const { query, isReady } = useRouter();
  const [eventCategoryData, setEventCategoryData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [isSubmittingLoader, setIsSubmittingLoader] = useState(false);
  const [todayEvent, settodayEvent] = useState([]);
  const [weekEvent, setWeekEvent] = useState([]);
  const [monthEvent, setMonthEvent] = useState([]);
  const [Images, setImages] = useState([]);
  const [show, setShow] = useState(false);

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  const [promo, setpromo] = useState([]);
  const [Attention, setAttention] = useState("");
  const [eventListLoader, setEventListLoader] = useState(false);
  const [imageSize, setimageSize] = useState([]);

  useEffect(() => {
    if (Images?.length) {
      const filterImg = Images.filter((item) => item.active == "1");
      setimageSize(filterImg);
    }
  }, [Images]);

  async function handlersvp() {
    setIsSubmittingLoader(true);
    const eventId = filter_data2[0].id;
    if (name != "" && email != "" && city != "" && state != "") {
      if (email.includes("@")) {
        try {
          const formData = new FormData();
          formData.append("eventId", eventId);
          formData.append("userName", name);
          formData.append("email", email);
          formData.append("city", city);
          formData.append("state", state);
          const mediaResp3 = await eventPageSevices.updateRSVP(formData);

          if (mediaResp3.data.success == true) {
            setIsSubmittingLoader(false);
            setname("");
            setemail("");
            setcity("");
            setstate("");
            showNotification(
              "Thank you ! your response has been saved",
              "Success"
            );
          } else {
            setIsSubmittingLoader(false);
            showNotification("response not saved", "Error");
          }
        } catch (err) {
          setIsSubmittingLoader(false);
          console.log(err);
        }
      } else {
        setIsSubmittingLoader(false);
        showNotification("Email must be a valid Email", "Error");
      }
    } else {
      setIsSubmittingLoader(false);
      showNotification("Please fill all fields");
    }
  }

  async function fetchPromo() {
    try {
      const promo = await eventPageSevices.adminMedia2("event");

      let filterdata = promo.data.data.filter(
        (item) => item.page_name == "event"
      );
      setpromo(filterdata[0]);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  }
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const adminMedia3 = async () => {
    try {
      const mediaResp3 = await eventPageSevices.adminMedia3("event");

      setImages(mediaResp3?.data?.data);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  useEffect(() => {
    if (isReady) {
      const id = filter_data2[0].id;
      getSingleEvent(id);
    }
  }, [isReady]);

  useEffect(() => {
    showEventCategory();
    showAllEvents();
    adminMedia3();
    fetchPromo();
    fetchAttentionText();
  }, []);

  async function fetchAttentionText() {
    try {
      let params = { pageName: event };

      const res = await eventPageSevices.getAttentionText(params);

      const eventAttention = res.data.data.filter(
        (item) => item.page_name == "event"
      );

      setAttention(eventAttention[0].page_text);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  }

  const showEventCategory = async () => {
    try {
      let params = {};
      const res = await eventPageSevices.adminMedia(params);

      if (res?.data?.success) {
        setEventCategoryData(res?.data?.data);
      }
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  const getSingleEvent = async (id) => {
    try {
      let params = {};
      params.id = id;
      setIsSubmittingLoader(true);
      const newsResp = await eventPageSevices.getSingleEventData(params);
      if (newsResp?.data?.success) {
        let respData = newsResp?.data?.data[0];

        setEventData(respData);
        setIsSubmittingLoader(false);
      }
    } catch (error) {
      setIsSubmittingLoader(false);
      console.log(error);
    }
  };

  const showAllEvents = async () => {
    //function to fetch filter data at page load(today , week , month).
    try {
      let params = {};

      setIsSubmittingLoader(true);
      const newsResp = await eventPageSevices.getAllEventList(params);

      if (newsResp?.data?.success) {
        let respData = newsResp?.data?.data?.reverse();
        settodayEvent(
          newsResp?.data?.today_events.sort((a, b) =>
            a?.date > b?.date ? 1 : -1
          )
        );
        setMonthEvent(
          newsResp?.data?.this_month_events.sort((a, b) =>
            a?.date > b?.date ? 1 : -1
          )
        );
        setWeekEvent(
          newsResp?.data?.this_week_events.sort((a, b) =>
            a?.date > b?.date ? 1 : -1
          )
        );

        setIsSubmittingLoader(false);
      }
    } catch (error) {
      console.log(error);
      setIsSubmittingLoader(false);
    }
  };

  useEffect(() => {
    if (allEvents.length) {
      const uniqueArray = allEvents.reduce((accumulator, currentEvent) => {
        const isDuplicate = accumulator.some(
          (existingEvent) => existingEvent.id === currentEvent.id
        );

        if (!isDuplicate) {
          accumulator.push(currentEvent);
        }

        return accumulator;
      }, []);

      let currentDate = getFormatedDate(new Date(), "YYYY-MM-DD");
      const filteredUniqueArray = uniqueArray?.filter(
        (item) => item?.date >= currentDate && item?.active == "1"
      );

      setfilteredAllEvents(
        filteredUniqueArray.sort((a, b) => (a?.date > b?.date ? 1 : -1))
      );
      setfilteredAllEventsBackup(
        filteredUniqueArray.sort((a, b) => (a?.date > b?.date ? 1 : -1))
      );
    }
  }, [allEvents]);
  useEffect(() => {
    if (value) {
      setDate(formatDateToYyyyMmDd(value));
      console.log("date", date);
    }
  }, [value]);
  function formatDateToYyyyMmDd(dateString) {
    // Create a new Date object from the input dateString
    const date = new Date(dateString);

    // Get the year, month, and day components
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-based, so add 1
    const day = date.getDate();

    // Ensure that single-digit month and day values have leading zeros
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    // Combine the components into the "yyyy-mm-dd" format
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

    return formattedDate;
  }
  useEffect(() => {
    // Once todayEvent, weekEvent, and monthEvent are updated, update allEvents
    setallEvents([...todayEvent, ...weekEvent, ...monthEvent]);
  }, [todayEvent, weekEvent, monthEvent]);

  const handlePrintSelectedQuestions = () => {
    const printStyles = `
      <style>
        @media print {
          .question-container {
            
            page-break-inside: avoid;
          }
        }
        /* Add any additional styles here */
        body {
          
          padding: 15px 10px 5px 15px;
          font-family: "Montserrat", sans-serif;
          
        }
        h2{
          color:#ff651f;
        }
        .question-container{
          text-align: center;
        }
        .question-container2{
          color:#ff651f;
          display:block;
          width:100%;
          position:absolute;
          bottom:0;
          text-align: center;
        }
        
        #lowerText{
          margin-top:40px;
          text-align:left;
        }
        
        .singleeventdate{
          font-size:17px;
          
        }
        
        
      </style>
    `;

    const printContent = `<div><img className="logo" src=${"/logo.png"} /></div>
    <div class="question-container"><div className="container">
    <div className="row">
      <div className="col-md-12">
        <p class="singleeventdate">
          
          ${getFormatedDate(filter_data2[0]?.date, "LL")}
        </p>
      </div>

      <div className="col-md-12">
        <h2 className="fst_Single_event">
          
          ${filter_data2[0]?.event_title}
        </h2>
      </div>
    </div>
  </div>
 

<div className="col-md-4">
  <img
    src=${
      filter_data2[0]?.event_media
        ? process.env.NEXT_PUBLIC_SITE_URL + filter_data2[0]?.event_media
        : "/today_event_img.png"
    }
    
    alt=${filter_data2[0]?.title}
  />
<div id="lowerText">
<p className="fst_event">
    <b>TIME:</b>
    
    ${
      filter_data2[0]?.time ? convertTo12HourFormat(filter_data2[0]?.time) : "-"
    }
  </p>
<p className="fst_event">
    <b>LOCATION:</b>
    
    ${filter_data2[0]?.location_address} <br />
    ${filter_data2[0]?.city}, ${filter_data2[0]?.state},
    ${filter_data2[0]?.zip_code}
  </p>
<p className="fst_event">
    <b>EVENT TYPE:</b>
    
    ${filter_data2[0]?.event_type}
  </p>
  <p className="fst_event">
                                <b>EVENT COST: $</b>
                                
                                ${filter_data2[0]?.event_cost}
                              </p>
  <div className="col-md-8">
                              <p className="fst_event">
                              <b>EVENT Description:</b>
                                ${filter_data2[0]?.event_description}
                              </p>
</div>

<div class="question-container2"><p>The Kindness Campaign
703 E 75th St Chicago, IL 60619</p><p>info@kindnesseveryday.org</p></div>
</div>`;

    const printWindow = window.open("", "Print", "height=720,width=1280");
    if (printWindow) {
      printWindow.document.write(
        `<html>
          <head>
            <title>The Kindness Campaign
            703 E 75th St Chicago, IL 60619</title>
            ${printStyles}
          </head>
          <body>
            
            ${printContent}
          </body>
        </html>`
      );
      printWindow.document.close();
      printWindow.print();
    } else {
      warn("Popup blocked in browser");
    }
  };
  const updateEventView = async (eventId, views) => {
    console.log("eventId", eventId);
    console.log("views", views);
    if (eventId == filter_data2[0].id) {
      setActiveTabIndex(0);
    } else {
      setIsSubmittingLoader(true);
      try {
        let currentViews = views == null ? 0 : views;

        const formData = new FormData();
        formData.append("updateId", eventId);
        formData.append("hits", parseInt(currentViews) + 1);

        const resp = await eventPageSevices.updateEventManagement(formData);

        if (resp?.data?.success) {
          setActiveTabIndex(0);
          router.push(`/event/${eventId}`);
        } else {
          setIsSubmittingLoader(false);
          showNotification(response?.data?.message, "Error");
        }
      } catch (error) {
        setIsSubmittingLoader(false);
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (date != "" && date != null) {
      setfilteredAllEvents(filteredAllEventsBackup);
      console.log("condition hit");
      console.log("DATE===>", date);

      if (
        activeTabIndex == 0 ||
        activeTabIndex == 1 ||
        activeTabIndex == 2 ||
        activeTabIndex == 3
      ) {
        if (date) {
          console.log("Date in tab 1", date);
          // showNotification(
          //   "Please select week or month events to filter. Nothing to filter in today's events"
          // );
          setActiveTabIndex(3);

          const allFilter = filteredAllEventsBackup.filter(
            (item) => item.date == date
          );

          if (allFilter.length > 0) {
            setfilteredAllEvents(allFilter);
          } else {
            showNotification(
              "No Events on the selected date. Showing all events"
            );
          }
        }
      }

      // if (activeTabIndex == 1) {
      //   const weekFilter = weekEvent.filter((item) => item.date == date);
      //   if (trackFilter == null) {
      //     if (weekFilter.length > 0) {
      //       settrackFilter(1);
      //       setWeekEvent(weekFilter);
      //     } else {
      //       setDate("");
      //       showNotification("No Events on the selected date.");
      //     }
      //   } else {
      //     showNotification("Please reset the date filter.");
      //   }
      // }

      // if (activeTabIndex == 2) {
      //   const monthFilter = monthEvent.filter((item) => item.date == date);
      //   if (trackFilter == null) {
      //     if (monthFilter.length > 0) {
      //       settrackFilter(1);
      //       setMonthEvent(monthFilter);
      //     } else {
      //       setDate("");
      //       showNotification("No Events on the selected date.");
      //     }
      //   } else {
      //     showNotification("Please reset the date filter.");
      //   }
      // }
      // if (activeTabIndex == 3) {
      //   const allFilter = filteredAllEvents.filter((item) => item.date == date);
      //   if (trackFilter == null) {
      //     if (allFilter.length > 0) {
      //       settrackFilter(1);
      //       setfilteredAllEvents(allFilter);
      //     } else {
      //       setDate("");
      //       showNotification("No Events on the selected date.");
      //     }
      //   } else {
      //     showNotification("Please reset the date filter.");
      //   }
      // }
    } else if (date == "") {
      settrackFilter(null);
      setDate(null);
      eventDynamic();
      showAllEvents();
    }
  }, [date]);
  const handleTabSelect = (index) => {
    setActiveTabIndex(index);
  };
  function resetFilter() {
    setfilteredAllEvents(filteredAllEventsBackup);
  }

  const searchCategory = (searchString) => {
    let filterData = eventCategoryData;
    setSearchCategoryTitle(searchString);
    let filtered = filterData.filter((item) =>
      String(item?.event_category.toLowerCase()).startsWith(
        searchString.toLowerCase()
      )
    );
    setFilteredCategoryName(filtered);
  };

  return (
    <Layout title={"single Event"}>
      <section>
        <div className="container">
          <div className="event_wrap_main ">
            <div className="row">
              <div className="col-md-12">
                <h1 className="about_the_campaign">EVENT DETAILS</h1>
                <h4 className="About_heading-1">Kindness Everyday</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <div className="Event_sidebar_1">
                <div className="container">
                  <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback" />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={searchCategoryTitle}
                      onChange={(e) => searchCategory(e?.target?.value)}
                    />
                  </div>
                </div>

                <div className="container">
                  <h3 className="event_categories_wrap">Event Categories</h3>

                  {/* {eventCategoryData?.length ? (
                    <ul className="event_categories_list">
                      {eventCategoryData?.map((item) =>
                        item?.active ? (
                          <li key={randomKey()}>{item?.event_category}</li>
                        ) : null
                      )}
                    </ul>
                  ) : null} */}

                  {searchCategoryTitle?.length ? (
                    filteredCategoryName?.length ? (
                      <ul className="event_categories_list">
                        {filteredCategoryName?.map((item) =>
                          item?.active ? (
                            <li key={randomKey()}>{item?.event_category}</li>
                          ) : null
                        )}
                      </ul>
                    ) : (
                      ""
                    )
                  ) : eventCategoryData?.length ? (
                    <ul className="event_categories_list">
                      {eventCategoryData?.map((item) =>
                        item?.active ? (
                          <li key={randomKey()}>{item?.event_category}</li>
                        ) : null
                      )}
                    </ul>
                  ) : (
                    ""
                  )}

                  {/* <div className="container">
                    <Calendar
                      onChange={(selectedDate) => {
                        onChange(selectedDate);
                      }}
                      value={value}
                      minDate={new Date()}
                    />
                  </div> */}
                  <div className="resetBtn">
                    {date ? (
                      <div className="eventCalendarResetBtn">
                        <button
                          className="btn btn-secondary btn-sm mt-2"
                          onClick={resetFilter}
                        >
                          Reset Date Filter
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <section>
                  <div className="container">
                    <div className="about_video_1">
                      <ReactPlayer
                        url={
                          Object.keys(promo).length > 0
                            ? process.env.NEXT_PUBLIC_SITE_URL +
                              promo.promo_video
                            : ""
                        }
                        controls={true}
                        playing={false}
                        muted={false}
                        width={"100%"}
                      />
                    </div>
                  </div>
                </section>

                <div className="container">
                  <p className="fst">
                    <p className="fst2">ATTENTION:{Attention}</p>
                  </p>
                </div>
              </div>
            </div>
            {/* Sidebar End */}

            {/* Sidebar Start */}
            <div className="col-md-7">
              <div className="Event_sidebar_2">
                <Tabs selectedIndex={activeTabIndex} onSelect={handleTabSelect}>
                  <TabList>
                    {/* <Tab>Today</Tab> */}
                    {/* <Tab>{filter_data2[0]?.event_title}</Tab> */}
                    {/* <Tab>This Week </Tab>
                    <Tab>This Month</Tab>
                    <Tab>
                      All Upcoming Events &nbsp;
                      <i
                        className="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>
                    </Tab> */}
                  </TabList>

                  <TabPanel>
                    {isSubmittingLoader ? (
                      <Spinner
                        style={{
                          width: "100px",
                          height: "100px",
                          color: "#333",
                        }}
                        animation="border"
                      />
                    ) : (
                      <>
                        <div className="container">
                          <div className="row">
                            <div className="col-md-12">
                              <p className="fst_single_event_date">
                                {" "}
                                {getFormatedDate(
                                  filter_data2[0]?.date,
                                  "LL"
                                )}{" "}
                              </p>
                            </div>

                            <div className="col-md-12">
                              <p className="fst_Single_event">
                                {" "}
                                {filter_data2[0]?.event_title}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="container">
                          <div className="row">
                            <div className="col-md-4">
                              <Image
                                src={
                                  filter_data2[0]?.event_media
                                    ? process.env.NEXT_PUBLIC_SITE_URL +
                                      filter_data2[0]?.event_media
                                    : "/today_event_img.png"
                                }
                                width={200}
                                height={250}
                                alt={filter_data2[0]?.title}
                              />

                              <p className="fst_event">
                                <b>TIME:</b>
                                <br />
                                {filter_data2[0]?.time
                                  ? convertTo12HourFormat(filter_data2[0]?.time)
                                  : null}
                              </p>
                              <p className="fst_event">
                                <b>LOCATION:</b>
                                <br />
                                {filter_data2[0]?.location_address} <br />
                                {filter_data2[0]?.city},{" "}
                                {filter_data2[0]?.state},{" "}
                                {filter_data2[0]?.zip_code}
                              </p>
                              <p className="fst_event">
                                <b>EVENT TYPE:</b>
                                <br />
                                {filter_data2[0]?.event_type}
                              </p>
                              <p className="fst_event">
                                <b>EVENT COST:</b>
                                <br />${filter_data2[0]?.event_cost}
                              </p>
                              <div>
                                {" "}
                                <>
                                  <Button
                                    variant="info btn-sm mb-4"
                                    onClick={handleShow}
                                  >
                                    RSVP
                                  </Button>

                                  <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                      <Modal.Title>
                                        {filter_data2[0]?.event_title}
                                      </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <input
                                        value={name}
                                        type="text"
                                        class="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="Name"
                                        onChange={(e) => {
                                          setname(e.target.value);
                                        }}
                                      />
                                      <input
                                        type="email"
                                        class="form-control"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => {
                                          setemail(e.target.value);
                                        }}
                                      />

                                      <input
                                        type="text"
                                        class="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => {
                                          setcity(e.target.value);
                                        }}
                                      />
                                      <input
                                        type="text"
                                        class="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="State"
                                        value={state}
                                        onChange={(e) => {
                                          setstate(e.target.value);
                                        }}
                                      />
                                      <div className="d-flex justify-content-center">
                                        <button
                                          className="btn btn-secondary btn-block mb-4"
                                          onClick={handlersvp}
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button
                                        variant="secondary"
                                        onClick={handleClose}
                                      >
                                        Close
                                      </Button>
                                    </Modal.Footer>
                                  </Modal>
                                </>
                              </div>

                              <div className="col-12 icon_wrap">
                                <p className="fst_event">
                                  <b>SHARE:</b>
                                </p>
                                <FacebookShareButton
                                  url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}event/${id}`}
                                  quote={filter_data2[0]?.event_title}
                                  hashtag={`#kindnesscampaign ${filter_data2[0]?.event_title}`}
                                >
                                  <i
                                    className="fa fa-facebook"
                                    aria-hidden="true"
                                  />
                                  &nbsp;
                                </FacebookShareButton>

                                <TwitterShareButton
                                  url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}event/${id}`}
                                  title={filter_data2[0]?.event_title}
                                >
                                  {" "}
                                  <i
                                    className="fa fa-twitter"
                                    aria-hidden="true"
                                  />
                                  &nbsp;
                                </TwitterShareButton>

                                <LinkedinShareButton
                                  url={`${process.env.NEXT_PUBLIC_BASE_LIVE_URL}event/${id}`}
                                  title={filter_data2[0]?.event_title}
                                >
                                  {" "}
                                  <i
                                    className="fa fa-linkedin-square"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  &nbsp;
                                </LinkedinShareButton>
                                {/* <a href="#">
                                  <i
                                    className="fa fa-facebook"
                                    aria-hidden="true"
                                  ></i>
                                  &nbsp;
                                </a> */}
                                {/* <a href="#">
                                  {" "}
                                  <i
                                    className="fa fa-youtube-play"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  &nbsp;
                                </a> */}
                                {/* <a href="#">
                                  <i
                                    className="fa fa-twitter"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  &nbsp;
                                </a>
                                <a href="#">
                                  {" "}
                                  <i
                                    className="fa fa-linkedin-square"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  &nbsp;
                                </a> */}
                                {/* <a href="#">
                                  
                                  <i
                                    className="fa fa-instagram"
                                    aria-hidden="true"
                                  ></i>
                                  &nbsp;
                                </a> */}
                              </div>

                              <div className="container mt-5">
                                <div className="row">
                                  <p className="download_event">
                                    <span
                                      className="ICAL"
                                      onClick={() =>
                                        handlePrintSelectedQuestions()
                                      }
                                    >
                                      Download event (ICAL)
                                    </span>
                                  </p>
                                  <p className="download_event">
                                    <span
                                      className="ICAL"
                                      onClick={() => {
                                        const title =
                                          filter_data2[0]?.event_title;
                                        const location =
                                          filter_data2[0]?.location_address;
                                        const Date = filter_data2[0]?.date;
                                        const Desc =
                                          filter_data2[0]?.event_type;
                                        addToGoogleCalendar(
                                          title,
                                          location,
                                          Date,
                                          Desc
                                        );
                                      }}
                                    >
                                      Add to calendar (Google)
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="fixMap">
                              <p className="fst_event">
                                {filter_data2[0]?.event_description}
                              </p>

                              <section className="map">
                                <iframe
                                  src={`https://www.google.com/maps?q=${filter_data2[0]?.location_address}&output=embed`}
                                  width={"100%"}
                                  height={250}
                                  style={{ border: 0 }}
                                  allowFullScreen=""
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                />
                              </section>

                              <p className="fst_event">
                                NOTICE: {filter_data2[0]?.notice}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </TabPanel>

                  <TabPanel>
                    {eventListLoader ? (
                      <Spinner
                        style={{
                          width: "50px",
                          height: "50px",
                          align: "center",
                          color: "#333",
                        }}
                        animation="border"
                      />
                    ) : weekEvent?.length ? (
                      weekEvent?.map((item, index) => (
                        <div className="container" key={randomKey()}>
                          <div className="row">
                            <div className="col-md-12 col-lg-4 mt-4">
                              {/* <Link href={`${"/event/"}${item?.id}`}> */}
                              <Image
                                className="eventImageIcon"
                                src={
                                  item?.event_media
                                    ? process.env.NEXT_PUBLIC_SITE_URL +
                                      item?.event_media
                                    : "/today_event_img.png"
                                }
                                width={200}
                                height={250}
                                alt={item?.event_title}
                                onClick={() =>
                                  updateEventView(item?.id, item?.hits)
                                }
                              />
                              {/* </Link> */}
                            </div>

                            <div className="col-md-12 col-lg-8 mt-4">
                              <p className="fst_event">
                                <span>
                                  {/* <i
                                    className="fa fa-download"
                                    aria-hidden="true"
                                  ></i> */}
                                </span>
                              </p>
                              <p className="fst_event">
                                {item?.date
                                  ? getFormatedDate(item?.date, "MM/DD/YYYY")
                                  : null}{" "}
                                {item?.time
                                  ? convertTo12HourFormat(item?.time)
                                  : null}
                              </p>
                              {/* <p className="fst_event">{item?.time} 3:00pm - 5:30pm</p> */}

                              {/* <Link href={`${"/event/"}${item?.id}`}> */}
                              <p
                                className="fst_event color_heading eventImageIcon"
                                onClick={() =>
                                  updateEventView(item?.id, item?.hits)
                                }
                              >
                                {item?.event_title}
                              </p>
                              {/* </Link> */}

                              <p className="fst_event">
                                <b>Location:</b> {item?.location_address},{" "}
                                {item?.city}, {item?.state}
                              </p>
                              <p className="fst_event">
                                <b>Event Type:</b> {item?.event_type}
                              </p>
                              <p className="fst_event">
                                <b>Cost:</b> {item?.event_cost}{" "}
                                <span>
                                  {/* <i
                                    className="fa fa-plus-square-o"
                                    aria-hidden="true"
                                  ></i> */}
                                  <i className="fa fa-eye" aria-hidden="true">
                                    {item?.hits == null ? 0 : item?.hits}
                                  </i>
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : null}
                  </TabPanel>

                  <TabPanel>
                    {eventListLoader ? (
                      <Spinner
                        style={{
                          width: "50px",
                          height: "50px",
                          align: "center",
                          color: "#333",
                        }}
                        animation="border"
                      />
                    ) : monthEvent?.length ? (
                      monthEvent?.map((item, index) => (
                        <div className="container" key={randomKey()}>
                          <div className="row">
                            <div className="col-md-12 col-lg-4 mt-4">
                              {/* <Link href={`${"/event/"}${item?.id}`}> */}
                              <Image
                                className="eventImageIcon"
                                src={
                                  item?.event_media
                                    ? process.env.NEXT_PUBLIC_SITE_URL +
                                      item?.event_media
                                    : "/today_event_img.png"
                                }
                                width={200}
                                height={250}
                                alt={item?.event_title}
                                onClick={() =>
                                  updateEventView(item?.id, item?.hits)
                                }
                              />
                              {/* </Link> */}
                            </div>

                            <div className="col-md-12 col-lg-8 mt-4">
                              <p className="fst_event">
                                <span>
                                  {/* <i
                                    className="fa fa-download"
                                    aria-hidden="true"
                                  ></i> */}
                                </span>
                              </p>
                              <p className="fst_event">
                                {item?.date
                                  ? getFormatedDate(item?.date, "MM/DD/YYYY")
                                  : null}{" "}
                                {item?.time
                                  ? convertTo12HourFormat(item?.time)
                                  : null}
                              </p>
                              {/* <p className="fst_event">{item?.time} 3:00pm - 5:30pm</p> */}

                              {/* <Link href={`${"/event/"}${item?.id}`}> */}
                              <p
                                className="fst_event color_heading eventImageIcon"
                                onClick={() =>
                                  updateEventView(item?.id, item?.hits)
                                }
                              >
                                {item?.event_title}
                              </p>
                              {/* </Link> */}

                              <p className="fst_event">
                                <b>Location:</b> {item?.location_address},{" "}
                                {item?.city}, {item?.state}
                              </p>
                              <p className="fst_event">
                                <b>Event Type:</b> {item?.event_type}
                              </p>
                              <p className="fst_event">
                                <b>Cost:</b> {item?.event_cost}{" "}
                                <span>
                                  {/* <i
                                    className="fa fa-plus-square-o"
                                    aria-hidden="true"
                                  ></i> */}
                                  <i className="fa fa-eye" aria-hidden="true">
                                    {item?.hits == null ? 0 : item?.hits}
                                  </i>
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : null}
                  </TabPanel>
                  <TabPanel>
                    {eventListLoader ? (
                      <Spinner
                        style={{
                          width: "50px",
                          height: "50px",
                          align: "center",
                          color: "#333",
                        }}
                        animation="border"
                      />
                    ) : filteredAllEvents?.length ? (
                      filteredAllEvents?.map((item, index) => (
                        <div className="container" key={randomKey()}>
                          <div className="row">
                            <div className="col-md-12 col-lg-4 mt-4">
                              {/* <Link href={`${"/event/"}${item?.id}`}> */}
                              <Image
                                className="eventImageIcon"
                                src={
                                  item?.event_media
                                    ? process.env.NEXT_PUBLIC_SITE_URL +
                                      item?.event_media
                                    : "/today_event_img.png"
                                }
                                width={200}
                                height={250}
                                alt={item?.event_title}
                                onClick={() =>
                                  updateEventView(item?.id, item?.hits)
                                }
                              />
                              {/* </Link> */}
                            </div>

                            <div className="col-md-12 col-lg-8 mt-4">
                              <p className="fst_event">
                                <span>
                                  {/* <i
                                    className="fa fa-download"
                                    aria-hidden="true"
                                  ></i> */}
                                </span>
                              </p>
                              <p className="fst_event">
                                {item?.date
                                  ? getFormatedDate(item?.date, "MM/DD/YYYY")
                                  : null}{" "}
                                {item?.time
                                  ? convertTo12HourFormat(item?.time)
                                  : null}
                              </p>
                              {/* <p className="fst_event">{item?.time} 3:00pm - 5:30pm</p> */}

                              {/* <Link href={`${"/event/"}${item?.id}`}> */}
                              <p
                                className="fst_event color_heading eventImageIcon"
                                onClick={() =>
                                  updateEventView(item?.id, item?.hits)
                                }
                              >
                                {item?.event_title}
                              </p>
                              {/* </Link> */}

                              <p className="fst_event">
                                <b>Location:</b> {item?.location_address},{" "}
                                {item?.city}, {item?.state}
                              </p>
                              <p className="fst_event">
                                <b>Event Type:</b> {item?.event_type}
                              </p>
                              <p className="fst_event">
                                <b>Event Cost:</b>{" "}
                                {item?.event_cost && item?.event_cost != "0"
                                  ? `$ ${item?.event_cost}`
                                  : " Free"}
                                <span>
                                  {/* <i
                                    className="fa fa-plus-square-o"
                                    aria-hidden="true"
                                  ></i> */}
                                  <i className="fa fa-eye" aria-hidden="true">
                                    {item?.hits == null ? 0 : item?.hits}
                                  </i>
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <section className="tabPanel">No events found</section>
                    )}
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>

      {imageSize.length > 3 ? (
        <ImageSlider Images={Images} />
      ) : imageSize.length == 3 ? (
        <>
          <div className="EventImageSlider">
            <img
              className="flexItem"
              src={
                imageSize[0]?.item?.event_media
                  ? process.env.NEXT_PUBLIC_SITE_URL + item?.event_media
                  : "/about-2.jpg"
              }
              alt="Picture of the author"
            />

            <img
              className="flexItem"
              src={
                imageSize[1]?.item?.event_media
                  ? process.env.NEXT_PUBLIC_SITE_URL + item?.event_media
                  : "/about-2.jpg"
              }
              alt="Picture of the author"
            />

            <img
              className="flexItem"
              src={
                imageSize[2]?.item?.event_media
                  ? process.env.NEXT_PUBLIC_SITE_URL + item?.event_media
                  : "/about-2.jpg"
              }
              alt="Picture of the author"
            />
          </div>
        </>
      ) : imageSize.length == 2 ? (
        <div className="EventImageSlider">
          <img
            className="flexItem"
            src={
              imageSize[0]?.item?.event_media
                ? process.env.NEXT_PUBLIC_SITE_URL + item?.event_media
                : "/about-2.jpg"
            }
            alt="Picture of the author"
          />

          <img
            className="flexItem"
            src={
              imageSize[1]?.item?.event_media
                ? process.env.NEXT_PUBLIC_SITE_URL + item?.event_media
                : "/about-2.jpg"
            }
            alt="Picture of the author"
          />
        </div>
      ) : (
        <div className="EventImageSlider">
          <img
            className="flexItem"
            src={
              imageSize[0]?.item?.event_media
                ? process.env.NEXT_PUBLIC_SITE_URL + item?.event_media
                : "/about-2.jpg"
            }
            alt="Picture of the author"
          />
        </div>
      )}
    </Layout>
  );
};
export default singleEventData;
