import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react"; // Importing useState
import { useDispatch } from 'react-redux';
import { UserContext } from "./UserContext";
import ProductsDialog from "./ProductsDialog";
import axios from "axios";


export default function Header() {
    const { user, setUser } = useContext(UserContext);

    const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
    const dispatch = useDispatch();

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    
    async function logOut() {
        axios.post(`/users/logout`)
        .then(res => {
            console.log(res)
            dispatch({ type: 'SET_ALERT', payload: {message: 'Logged out successfully', alertType: 'primaryGreen'} });
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setShowDropdown(false)
            setUser(null);
        }).catch(err => {
            setUser(null);
        }); 
    }

    return (
        <header className="flex justify-between">
            <Link to={'/'} className="flex items-center gap-1">
                <svg className="primaryBlue text-primaryBlue w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path stroke="0fa3b1" fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397a4.491 4.491 0 0 1-1.307 3.497a4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549a4.49 4.49 0 0 1-3.498-1.306a4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497a4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-xl">Shop-it</span>
            </Link>

            {user && (
                <div className="flex gap-2 border border-blue-200 rounded-full p-2 px-3 shadow-md shadow-gray-300">
                    <ProductsDialog/>
                </div>
            )}
            
            {user && (
                <div className="relative">
                    <button className="flex items-center gap-2 border border-blue-200 rounded-full p-0 px-3 shadow-md shadow-gray-300 focus:outline-none">
                        <svg onClick={toggleDropdown} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <div className="bg-primaryBlue rounded-full text-white border border-primaryBlue overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        {!!user && (
                            <Link to="/account" className="px-2 py-2 text-gray-800 hover:bg-transparent" style={{ textDecoration: 'none', color: 'inherit' }}>{user.name}</Link>

                        )}
                    </button>
                    {showDropdown && (
                        <div className="flex flex-col absolute right-0 my-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                            <Link to="/friends" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Friends</Link>
                            <Link to="/stores" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Find Stores</Link>
                            <button className="bg-primaryBlue mt-5 py-2 mt-2 mr-11 mb-4 ml-3 text-white rounded" onClick={logOut}>Logout</button>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}
