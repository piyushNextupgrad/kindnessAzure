import Head from "next/head";
import Header from "./common/Header";
import Footer from "./common/footer";
import Navbar from "./common/Navbar";


const Layout = ({ children, title = "Kindness Campaign" }) => {
    return (
        <>
            <Header title={title} />

            <Navbar />

            <div className="content">
                {children}
            </div>
            <Footer />

        </>
    )
}

export default Layout;