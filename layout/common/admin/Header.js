import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import store from "store";
import { GiHamburgerMenu } from "react-icons/gi";
import AdminSidebar from "./Sidebar";
import showNotification from "@/helpers/show_notification";
import { useRouter } from "next/router";
import { APPCONST } from "@/store/constant/globalVar";
import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

export default function AdminHeader(props) {
  const [menu, setmenu] = useState(false);
  const userInfo = useSelector((state) => state.userData.userDetails);

  const router = useRouter();

  function logout() {
    localStorage.removeItem(APPCONST.AccessToken);
    showNotification("Logout successfully", "Success");
    router.push("/admin");
  }

  function menuToggle() {
    menu ? setmenu(false) : setmenu(true);
  }

  return (
    <>
      <Head>
        <meta name="description" content="Kindness Campaign" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props?.title}</title>
      </Head>

      <header role="banner">
        <div className="admin_heading">Admin Dashboard</div>

        <ul
          className="utilities"
          style={{
            display: "block ruby",
            listStyle: "none",
            justifyContent: "center",
          }}
        >
          <li className="users hideHeaderDetails">
            <Link className="hideHeaderDetails" href="#">
              {userInfo ? userInfo?.name : ""}
            </Link>
          </li>
          <li onClick={logout} className="logout warn hideHeaderDetails">
            <Link className="hideHeaderDetails" href="#">
              Log Out
            </Link>
          </li>
          <li className="menuHam">
            <GiHamburgerMenu className="hamburger" onClick={menuToggle} />
          </li>
        </ul>
        {menu ? (
          <div className="Mobilemenu">
            <ul className="main">
              <li className="home">
                <Link href="/admin/home">Home Page</Link>
              </li>

              <li className="edit">
                <Link href="/admin/campaign-admin">Campaign Page</Link>
              </li>

              <li className="write">
                <Link href="/admin/event">Event Page</Link>
              </li>

              <li className="comments">
                <Link href="/admin/donate-page">Donate</Link>
              </li>

              <li className="">
                <Link href="/admin/involved">Get Involved</Link>
              </li>

              <li className="contact_us">
                <Link href="/admin/contactus-admin">Contact Us</Link>
              </li>
              <li>
                <Link href="#">
                  <div className="menuButtons">
                    {userInfo ? userInfo?.name : ""}
                  </div>
                </Link>
              </li>
              <li onClick={logout}>
                <Link href="#">
                  <div className="menuButtons">Log Out</div>
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </header>

      <AdminSidebar />
    </>
  );
}
