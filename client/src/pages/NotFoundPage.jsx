import { Link } from "react-router-dom";

export default function NotFoundPage() {

    return (
        <div className="w-full flex flex-col justify-center mt-5 px-2">
            <h2 className="text-3xl lora text-center pb-4">Page not found</h2>
            <img src="https://img.freepik.com/free-vector/illustration-magnifying-glass_53876-28516.jpg?t=st=1713581827~exp=1713585427~hmac=75c39ecf6c6d2c6153f65b32af0c733aa42dd2451674fca02bdaefc680bf4b64&w=2000" className="min-h-[223px]"/>
            <Link to={'/account'} className="mt-5 text-black nunito text-lg text-center ">Go to <span className="text-primaryBlue">account</span> page.</Link>
        </div>
    )
}