import { useEffect, useState } from "react";
import Link from "next/link";
import { contactPageSevices } from "@/store/services";
import { FacebookShareButton } from "next-share";
export default function Footer() {
  const shareUrl = "https://www.facebook.com/Show.Kindness.Everyday/";
  useEffect(() => {
    contactPageData();
  }, []);

  const [data, setData] = useState();
  const contactPageData = async () => {
    try {
      const resp = await contactPageSevices.contactUsGet();
      setData(resp?.data?.data);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  return (
    <>
      <footer id="footer" className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-3 footer-info">
              <a href="/">
                <img className="footerLogo" src="/footer_logo.png" />
              </a>
            </div>
            <div className="col-md-12 col-lg-6 footer-info">
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <p className="footer_btn">
                    <a target="_blank" href="/get-involved/">
                      {" "}
                      <i
                        className="fa fa-arrow-right"
                        aria-hidden="true"
                      />{" "}
                      <span> SUPPORT US </span>
                    </a>
                  </p>
                </div>
                <div className="col-md-6 col-lg-6">
                  <p className="footer_btn">
                    <a target="_blank" href="/contact-us">
                      <i className="fa fa-arrow-right" aria-hidden="true" />{" "}
                      <span> CONTACT US </span>
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-3">
              <h4>The Kindness Campaign</h4>
              <p className="footer_p">
                {data?.address}
                <br />
                {data?.phone_number}
                <br />
                <a href={`mailto:${data?.corp_email}`} className="mail_color">
                  {" "}
                  {data?.corp_email}
                </a>
                <br />
              </p>
            </div>
          </div>
          <div className="mt-10">
            <div className="row">
              <div className="col-md-6 footer-info  border-right">
                <h4 className="footer_wrap">
                  Get exclusive updates on our work <br />
                  and how you can help.
                </h4>

                <Link href="/#signuptoday">
                  <button type="butto1" className="footer_sign social_1">
                    {" "}
                    SIGN UP TODAY
                  </button>
                </Link>
              </div>
              <div className="col-md-6 footer-info">
                <h4 className="footer_wrap">
                  Think people should hear about this? <br />
                  Share it.
                </h4>
                <div className="social-links d-flex mt-4 social_1">
                  <a
                    href="https://www.youtube.com/c/TheKindnessCampaign"
                    className="youtube"
                    target="_blank"
                  >
                    <i className="fa fa-youtube-play" aria-hidden="true"></i>
                  </a>

                  <FacebookShareButton
                    url={
                      process.env.NEXT_PUBLIC_BASE_LIVE_URL + "shareUs/meta/"
                    }
                    hashtag={`#kindnesscampaign `}
                  >
                    <i
                      className="fa fa-facebook footer_fbicon"
                      aria-hidden="true"
                    ></i>
                  </FacebookShareButton>

                  <a
                    href="https://www.instagram.com/showkindnesseveryday/"
                    className="instagram"
                    target="_blank"
                  >
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                  </a>
                  <a href="#" className="linkedin">
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* End Footer */}
      {/* Bottom Footer */}

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <p className="bottom_wrap align-middle">
              © 2023 by The Kindness Campaign. &nbsp;&nbsp; The Kindness
              Campaign is a 501©3 organization.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
