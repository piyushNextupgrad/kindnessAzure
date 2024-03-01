import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  
  const [showNavBar, setShowNavBar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


  const resizeFun = () => {
    return setIsMobile(window.innerWidth <= 768);
  }
  window.addEventListener("resize", resizeFun);

  return (
    <>
      <section id="hero" className="hero">
        <header id="header" className="header d-flex align-items-center">
          <div className="container d-flex justify-content-between">
            <a href="/" className="logo d-flex align-items-center">
              <Image src="/images/logo.png" alt="kindness-logo" height={125} width={185} />
            </a>

            <nav id="navbar" className="navbar" style={showNavBar ? { right: '0' } : {}}>
              {showNavBar && (
                <i className="mobile-nav-toggle mobile-nav-hide bi bi-x" style={{ position: 'absolute', right: '88%', top: '10px' }} onClick={() => setShowNavBar(false)}><i class="fa fa-times-circle" aria-hidden="true"></i></i>
              )}
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/about">The Campaign</Link>
                </li>
                <li>
                  <Link href="/events">Events</Link>
                </li>
                <li>
                  <Link href="/get-involved">Support</Link>
                </li>
                <li>
                  <Link href="/contact-us">Contact</Link>
                </li>


                {isMobile && <div className="search11">
                  <input
                    type="text"
                    className="searchTerm11"
                    placeholder="Search..."
                    style={{ border: "0px solid #b3b0b0", borderRadius: 40, padding: 7 }}
                  />
                  <button type="submit" className="searchButton11">
                    <i className="fa fa-search" />
                  </button>
                </div>
                }

              </ul>

              {!isMobile &&
                <div className="search11">
                  <input
                    type="text"
                    className="searchTerm11"
                    placeholder="Search..."
                    style={{ border: "0px solid #b3b0b0", borderRadius: 40, padding: 7 }}
                  />
                  <button type="button" className="searchButton11">
                    <i className="fa fa-search" />
                  </button>
                </div>
              }

            </nav>


            {!showNavBar && isMobile && (

              <i className="mobile-nav-toggle mobile-nav-show bi bi-list" onClick={() => setShowNavBar(true)}><i className="fa fa-bars" aria-hidden="true"></i></i>
            )}

          </div>
        </header>
      </section>

    </>
  )
}