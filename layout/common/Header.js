import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";

export default function Header(props) {
  return (
    <>
      <Head>
        <meta name="description" content="Kindness Campaign" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props?.title}</title>
      </Head>

      <section id="topbar" className="topbar d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-md-12">
              <p className="top-header-heading">
                Every dollar counts! Support our critical work by making a
                tax-deductible contribution today - - &gt;
              </p>
            </div>
            <div className="col-lg-2 col-md-12">
              <h4 className="donate-button">
                <a href="/get-involved">
                  <strong>
                    <u>DONATE NOW</u>
                  </strong>
                </a>{" "}
              </h4>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
