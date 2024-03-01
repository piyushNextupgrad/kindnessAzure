import Image from "next/image";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { contactPageSevices } from "@/store/services/contactUs.js";
import { homePageService } from "@/store/services/homepageServices";
import {
  getFormatedDate,
  getBase64,
  checkImageOrVideoFromUrl,
  getFileType,
} from "@/store/library/utils";
import { Spinner } from "react-bootstrap";

import showNotification from "@/helpers/show_notification";

import AdminLayout from "@/layout/adminLayout";
import { AiOutlineFieldString } from "react-icons/ai";
import { isURL } from "@/store/library/utils";
const ContactUs = () => {
  const [contactHeader, setcontactHeader] = useState("");
  const [contactImage, setcontactImage] = useState("");
  const [companyName, setcompanyName] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState("");
  const [zip, setzip] = useState("");
  const [email, setemail] = useState("");
  const [shareheader, setshareheader] = useState("");
  const [shareimage, setshareimage] = useState("");
  const [sharetext, setsharetext] = useState("");
  const [sharelink, setsharelink] = useState("");
  const [urlError, setUrlError] = useState("");
  const [middleImagePreview, setMiddleImagePreview] = useState("");
  const [contactStaticPageData, setContactStaticPageData] = useState([]);
  const [isSubmitingLoader, setIsSubmitingLoader] = useState(false);

  useEffect(() => {
    contactPageData();

    //////////////// Get share text //////////
    hearAboutUs();
  }, []);

  const updatecontactform1 = async () => {
    if (
      shareheader != "" &&
      shareimage != "" &&
      sharelink != "" &&
      sharetext != "" &&
      isURL(sharelink)
    ) {
      setIsSubmitingLoader(true);
      try {
        const formData = new FormData();
        formData.append("pageName", "contact_us");

        formData.append("headerText", shareheader);
        formData.append("leftImage", shareimage);
        formData.append("vissionText", sharetext);
        formData.append("impactLink", sharelink);

        const resp = await homePageService.addPageStaticContent(formData);
        if (resp?.data?.success) {
          setMiddleImagePreview("");
          showNotification(resp?.data?.message, "Success");
        } else {
          showNotification(resp?.data?.success, "Error");
        }
      } catch (err) {
        // Handle any other errors that may occur during the request
        console.log(err);
      }
      setIsSubmitingLoader(false);
    } else {
      showNotification("Please fill out all the fields", "Error");
    }
  };

  const updateContactus = async (e) => {
    if (
      contactHeader != "" &&
      companyName != "" &&
      address != "" &&
      phone != "" &&
      zip != "" &&
      email != ""
    ) {
      setIsSubmitingLoader(true);
      //e.preventDefault();
      const formData = new FormData();
      formData.append("contactHeader", contactHeader);
      formData.append("contactImage", contactImage);
      formData.append("companyName", companyName);
      formData.append("address", address);
      formData.append("phoneNumber", phone);
      formData.append("cityStateZip", zip);
      formData.append("corpEmail", email);

      try {
        const resp = await contactPageSevices.updateContactSection(formData);
        // console.log(resp);
        if (resp?.data?.success) {
          showNotification(resp?.data?.message, "Success");
        } else {
          showNotification(resp?.data?.success, "Error");
        }
      } catch (err) {
        console.log("err", err);
        showNotification(resp?.data?.success, "Error");
      }
      setIsSubmitingLoader(false);
    } else {
      showNotification("Please fill all the Fields", "Error");
    }
  };

  const hearAboutUs = async () => {
    setIsSubmitingLoader(true);
    try {
      let params = {};
      params.pageName = "contact_us";
      const resp = await homePageService?.pageStaticData(params);
      console.log("HearAboutUs", resp);
      if (resp?.data?.success) {
        setshareheader(resp?.data?.data[0]?.header_text);
        setsharetext(resp?.data?.data[0]?.page_text);
        setsharelink(resp?.data?.data[0]?.impact_link);
        setMiddleImagePreview(
          process.env.NEXT_PUBLIC_SITE_URL + resp?.data?.data[0]?.image
        );
      }
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
    setIsSubmitingLoader(false);
  };

  const contactPageData = async () => {
    setIsSubmitingLoader(true);
    try {
      const resp = await contactPageSevices.contactUsGet();

      if (resp.data.success) {
        setContactStaticPageData(resp?.data?.data);

        setcontactHeader(resp?.data?.data?.contact_header);
        setcompanyName(resp?.data?.data?.company_name);
        setaddress(resp?.data?.data?.address);
        setphone(resp?.data?.data?.phone_number);
        setzip(resp?.data?.data?.city_state_zip);
        setemail(resp?.data?.data?.corp_email);
      } else {
        setContactStaticPageData();

        setcontactHeader();
        setcompanyName();
        setaddress();
        setphone();
        setzip();
        setemail();
      }
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
    setIsSubmitingLoader(false);
  };

  const updateUrl = (urlString) => {
    console.log("urlString", urlString, isURL(urlString));
    if (!isURL(urlString)) {
      setUrlError("Please fill valid url");
    } else {
      setUrlError("");
    }
    setsharelink(urlString);
  };
  return (
    <>
      <AdminLayout title={"Contact us - Kindness Admin"}>
        <main role="main">
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
          <section className="panel important">
            <h2>
              {" "}
              <i className="fa fa-hand-o-right" aria-hidden="true"></i> Hear
              About Us (Share It)
            </h2>
            <div className="container">
              <label className="form-label-1" htmlFor="typeText">
                Share Header
              </label>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-outline">
                    <textarea
                      className="form-control reduceFont"
                      placeholder="Type here"
                      name="shareheader"
                      value={shareheader}
                      onChange={(e) => setshareheader(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <br /> <br />
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label-1" htmlFor="typeText">
                    Share Image
                  </label>
                  <br />
                  <Image
                    src={
                      middleImagePreview ? middleImagePreview : "/no-img.jpg"
                    }
                    width={80}
                    height={80}
                    alt="Picture of the author"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files[0]?.size < 6 * 1024 * 1024) {
                        const img = e?.target?.files[0];

                        const fileName = img.name.toLowerCase();
                        let fileData = await getBase64(img);
                        setMiddleImagePreview(fileData);
                        setshareimage(e.target.files[0]);
                      } else {
                        showNotification(
                          "File size exceeds 6MB. Please choose a smaller file",
                          "Error"
                        );

                        // Clear the file input
                        e.target.value = null;
                      }
                    }}
                  />
                  <span className="mbSpan">
                    Max file size for images is 6 MB
                  </span>
                </div>

                <hr />

                <div className="container">
                  <br />

                  <div className="row">
                    <div className="col-md-12">
                      <label className="form-label-1" htmlFor="typeText">
                        Share Text
                      </label>
                      <div className="form-outline">
                        <textarea
                          className="form-control reduceFont"
                          placeholder="Type here"
                          name="shareText"
                          value={sharetext}
                          onChange={(e) => setsharetext(e.target.value)}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <br />
                      <label className="form-label-1" htmlFor="typeText">
                        Website Link
                      </label>
                      <div className="form-outline">
                        <input
                          type="url"
                          className="form-control reduceFont"
                          name="websiteLink"
                          value={sharelink}
                          onChange={(e) => updateUrl(e.target.value)}
                        />
                      </div>
                      {!isURL(sharelink) ? (
                        <div className="error">Url is not valid</div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <br />
                  <div className="text-right">
                    <button
                      type="button"
                      className="btn btn align-bottom btn-success updateBtnSize"
                      onClick={updatecontactform1}
                    >
                      Update Site
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="panel important">
            <h2>
              <i className="fa fa-hand-o-right" aria-hidden="true"></i> Contact
              Us
            </h2>
            <div className="container">
              <label className="form-label-1" htmlFor="typeText">
                Contact Header
              </label>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-outline">
                    <textarea
                      className="form-control reduceFont"
                      placeholder="Type here"
                      name="headerText"
                      value={contactHeader}
                      onChange={(e) => setcontactHeader(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <br /> <br />
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label-1" htmlFor="typeText">
                    Share Image
                  </label>
                  <br />
                  <Image
                    src={
                      contactStaticPageData?.contact_image
                        ? process.env.NEXT_PUBLIC_SITE_URL +
                          contactStaticPageData?.contact_image
                        : "/no-img.jpg"
                    }
                    width={80}
                    height={80}
                    alt="Picture of the author"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e?.target?.files[0]?.size < 6 * 1024 * 1024) {
                        setcontactImage(e?.target?.files[0]);
                      } else {
                        showNotification(
                          "File size exceeds 6MB. Please choose a smaller file",
                          "Error"
                        );

                        // Clear the file input
                        e.target.value = null;
                      }
                    }}
                  />
                  <span className="mbSpan">
                    Max file size for images is 6 MB
                  </span>
                </div>

                <div className="col-md-4">
                  <br />
                </div>

                <div className="container">
                  <br />
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label-1" htmlFor="typeText">
                        Company Name
                      </label>
                      <div className="form-outline">
                        <input
                          type="text"
                          className="form-control reduceFont"
                          name="company_name"
                          value={companyName}
                          onChange={(e) => setcompanyName(e?.target?.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label-1" htmlFor="typeText">
                        Address
                      </label>
                      <div className="form-outline">
                        <input
                          type="text"
                          className="form-control reduceFont"
                          name="address"
                          value={address}
                          onChange={(e) => setaddress(e?.target?.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label-1" htmlFor="typeText">
                        City, State, Zip
                      </label>
                      <div className="form-outline">
                        <input
                          type="text"
                          className="form-control reduceFont"
                          name="city"
                          value={zip}
                          onChange={(e) => setzip(e?.target?.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label-1" htmlFor="typeText">
                        Phone Number
                      </label>
                      <div className="form-outline">
                        <input
                          type="phone"
                          className="form-control reduceFont"
                          name="phone"
                          value={phone}
                          onChange={(e) => setphone(e?.target?.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <label className="form-label-1" htmlFor="typeText">
                        Corporate Email
                      </label>
                      <div className="form-outline">
                        <input
                          type="email"
                          className="form-control reduceFont"
                          name="headerText"
                          value={email}
                          onChange={(e) => setemail(e?.target?.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <br />
                  <div className="text-right">
                    <button
                      type="button"
                      className="btn btn btn-outline-primary align-bottom updateBtnSize"
                      onClick={updateContactus}
                    >
                      Update Site
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </AdminLayout>
    </>
  );
};

export default ContactUs;
