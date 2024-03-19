import Alert from "../components/Alert.jsx";
import Header from "./../components/Header.jsx";
import {Outlet} from "react-router-dom";

export default function Layout() {
    return (
        <div className="p-6 sm:p-6 flex flex-col min-h-screen">
            <Header/>
            <Alert/>
            <Outlet/>
        </div>
    )
}