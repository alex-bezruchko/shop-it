import Alert from "../components/pageComponents/Alert.jsx";
import Header from "./../components/pageComponents/Header.jsx";
import Footer from "./../components/pageComponents/Footer.jsx";
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