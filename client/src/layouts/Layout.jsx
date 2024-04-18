import Alert from "../components/Alert.jsx";
import Header from "./../components/Header.jsx";
import Footer from "./../components/Footer.jsx";
import {Outlet} from "react-router-dom";

export default function Layout() {
    return (
        <div className="p-3 md:p-6 flex flex-col min-h-screen h-screen">
            <Header/>
            <Alert/>
            <Outlet/>
            <Footer/>     
        </div>
    )
}