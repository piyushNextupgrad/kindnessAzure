import Head from "next/head";
import Layout from "@/layout/layoutTemplate";
import { contactPageSevices } from "@/store/services/contactUs.js";
import { useEffect, useState } from "react";
import ImageSlider from "./components/admin/ImageSlider";
import showNotification from "@/helpers/show_notification";
import Link from "next/link";
import { Spinner } from "react-bootstrap";

const Events = () => {
  const [data, setdata] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitingLoader, setIsSubmitingLoader] = useState(false);

  useEffect(() => {
    contactPageData();
  }, []);

  const contactPageData = async () => {
    setIsSubmitingLoader(true);
    try {
      const resp = await contactPageSevices.contactUsGet();
      setdata(resp?.data?.data);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
    setIsSubmitingLoader(false);
  };

  const submitContactForm = async (e) => {
    e.preventDefault();
    setIsSubmitingLoader(true);
    try {
      if (email != "" && name != "" && message != "") {
        if (email.includes("@")) {
          const formData = new FormData();

          formData.append("email", email);
          formData.append("name", name);
          formData.append("message", message);
          formData.append("section_name", "contact_us");

          const response = await contactPageSevices.sendContactFormData(
            formData
          );
          console.log("FORMpostRESP", response);

          if (response?.status == 200) {
            setIsSubmitingLoader(false);

            setEmail("");
            setName("");
            setMessage("");

            showNotification(response?.data.message, "Success");
          }
        } else {
          showNotification("Email must be a valid Email", "Error");
        }
      } else {
        showNotification("Please fill all the fields", "Error");
      }
      // showNotification("Form sent successfully", "Success");
      //  else {
      //   console.log("else RAN");
      //   showNotification("Error");
      // }
    } catch (error) {
      setIsSubmitingLoader(false);
      showNotification("Some Data is incomplte", "Error");
    }
    setIsSubmitingLoader(false);
  };

  return (
    <>
      <Head>
        <title>Contact Us - Kindness Campaign</title>
        <meta name="description" content="Contact Us - Kindness Campaign" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout title={"Contact Us"}>
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
        <section id="contact" className="contact_us_wrap hero">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-lg-5 align-self-center wow fadeInUp over_contact_wrap">
                <div className="row">
                  <div className="col-md-12 col-lg-6 contact_add">
                    <i
                      className="fa fa-map-marker contact_wrap"
                      aria-hidden="true"
                    ></i>
                    <h6> OUR MAIN OFFICE </h6>
                    <p>{data?.address} </p>
                  </div>

                  <div className="col-md-12 col-lg-6 contact_add">
                    <i
                      className="fa fa-volume-control-phone contact_wrap"
                      aria-hidden="true"
                    ></i>
                    <h6> PHONE NUMBER </h6>
                    <p>
                      {" "}
                      <Link href={`tel:${data?.phone_number}`}>
                        {data?.phone_number}
                      </Link>{" "}
                    </p>
                  </div>

                  <div className="col-md-12 col-lg-6 contact_add">
                    <i
                      className="fa fa-envelope-o contact_wrap"
                      aria-hidden="true"
                    ></i>
                    <h6> EMAIL </h6>
                    <p>
                      <Link href={`mailto:${data?.corp_email}`}>
                        {data?.corp_email}
                      </Link>
                    </p>
                  </div>

                  <div className="col-md-12 col-lg-6 contact_add">
                    <i
                      className="fa fa-globe contact_wrap"
                      aria-hidden="true"
                    ></i>
                    <h6>SOCIAL NETWORKS </h6>

                    <ul>
                      <li>
                        {" "}
                        <Link
                          href="https://www.facebook.com/Show.Kindness.Everyday/ "
                          target="_blank"
                        >
                          Facebook
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://www.facebook.com/Show.Kindness.Everyday/ "
                          target="_blank"
                        >
                          LinkedIn
                        </Link>
                      </li>
                    </ul>

                    <ul>
                      <li>
                        <Link href="#">Instagram</Link>
                      </li>
                      <li>
                        <Link
                          href="https://www.youtube.com/c/TheKindnessCampaign "
                          target="_blank"
                        >
                          YouTube
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-12 col-lg-7 from_wrap">
                <div className="from_wrap_1">
                  <h2 className="input_wrap_1">{data?.contact_header}</h2>

                  <form>
                    <div className="row">
                      <div className="col-md-12">
                        <input
                          type="text"
                          id="fname"
                          name="firstname"
                          placeholder="Enter your name"
                          value={name}
                          onChange={(e) => setName(e?.target?.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <input
                          type="email"
                          id="lname"
                          name="lastname"
                          placeholder="Enter a valid email address"
                          value={email}
                          onChange={(e) => setEmail(e?.target?.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 av">
                        <label htmlFor="subject">Message:</label>
                      </div>
                      <div className="col-md-12">
                        <textarea
                          id="subject"
                          name="subject"
                          style={{ width: "100%", height: 110 }}
                          value={message}
                          onChange={(e) => setMessage(e?.target?.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      onClick={submitContactForm}
                      className="Contact_form_btn"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="map_padding">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2976.244922489502!2d-87.61223802342073!3d41.75837690938838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e28c6356e0a21%3A0xf579b73bfc3d7e3d!2s703%20E%2075th%20St%2C%20Chicago%2C%20IL%2060619%2C%20USA!5e0!3m2!1sen!2sin!4v1692376033274!5m2!1sen!2sin"
            width={"100%"}
            height={450}
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>

        <section className="vission">
          <div className="container aos-init aos-animate" data-aos="fade-up">
            <div className="row gy-12">
              <div className="col-lg-12">
                <h4 className="home-main-heading-3">
                  We have a VISSION of a strong, thriving community without
                  institutional barriers that stands in the way of equitable
                  participation.
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

        <ImageSlider />
      </Layout>
    </>
  );
};

export default Events;
