import Link from "next/link";
export default function AdminSidebar() {
  return (
    <>
      <nav role="navigation">
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

          <li className="users">
            <Link href="/admin/involved">Get Involved</Link>
          </li>

          <li className="contact_us">
            <Link href="/admin/contactus-admin">Contact Us</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
