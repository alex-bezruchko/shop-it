import Header from "./../components/Header.jsx";
import {Outlet} from "react-router-dom";

export default function Layout() {
    return (
        <div className="p-6 sm:p-8 flex flex-col min-h-screen">
            <Header/>
            <Outlet/>
        </div>
    )
}