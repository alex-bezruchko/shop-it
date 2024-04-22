import { Link } from "react-router-dom";

export default function NotFoundPage() {

    return (
        <div className="w-full flex flex-col justify-center mt-5 px-2">
            <h2 className="text-3xl lora text-center pb-4">Page not found</h2>
            <img src="/search.jpg" className="min-h-[223px]"/>
            <Link to={'/account'} className="mt-5 text-black nunito text-lg text-center ">Go to <span className="text-primaryBlue">account</span> page.</Link>
        </div>
    )
}