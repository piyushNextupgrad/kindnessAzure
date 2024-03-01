import Link from "next/link"
import foterlogo from "../../styles/assets/img/footer_logo.png"


export default function AdminFooter() {
    return (
        <>
            <footer id="footer" className="footer">
                admin Footer
            </footer>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <p className="bottom_wrap align-middle">© 2023 by The Kindess Campaign.  &nbsp;&nbsp; <b>The Kindness Campaign is a 501©3 organization.</b> </p>
                    </div>
                </div>
            </div>

        </>
    )
}