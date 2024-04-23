import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react"; // Importing useState
import { useDispatch } from 'react-redux';
import { UserContext } from "./UserContext";
import { RequestContext } from './RequestContext';
import ProductsDialog from "./ProductsDialog";
import axios from "axios";

const RedDot = ({ w, h, cx, cy, r, className }) => {
    
    return (
        <svg width={w} height={h} viewBox="0 0 8 8" className={className} fill="#F12802" stroke="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx={cx} cy={cy} r={r} />
        </svg>
    );
};

export default function Header() {
    const { user, setUser } = useContext(UserContext);
    const requests = useContext(RequestContext);
    const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
    const [showDot, setShowDot] =useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (requests.requests.friendRequests) {
            let friendRequests = requests.requests.friendRequests;
            if (friendRequests.length > 0) {
                setShowDot(true)
            } else {
                setShowDot(false)
            }
        } else {
            setShowDot(false)
        }
        
    }, [user, requests.requests])
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLinkClick = () => {
        setShowDropdown(false);
    };

    async function logOut() {
        axios.post(`/users/logout`)
            .then(res => {
                dispatch({ type: 'SET_ALERT', payload: {message: 'Logged out successfully', alertType: 'primaryGreen'} });
                // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                setShowDropdown(false);
                setUser({ email: '', name: '', _id: '' });
                navigate('/login');
            }).catch(err => {
                setUser({ email: '', name: '', _id: '' });
                navigate('/login');
            }); 
    }

    return (
        <header className="flex justify-between">
            <Link to={'/'} className="flex items-center gap-1" onClick={handleLinkClick}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0fa3b1" className="w-[35px] h-[35px] text-primaryBlue">
                    <path stroke="white" fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-md">Shop-it</span>
            </Link>

            {user && user._id ? (
                <div className="flex gap-2 border border-2 border-primaryBlue rounded-full p-0">
                    <ProductsDialog />
                </div>
            ): (<></>)}

            {user && user._id && (
                <div className="relative">
                    <button aria-label="User menu toggle button" className="relative flex items-center justify-between gap-2 border border-2 border-primaryBlue rounded-full px-2 py-1 focus:outline-none" onClick={toggleDropdown}>
                        <div className="flex justify-between">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="self-center flex inset-0 w-6 h-6 pointer-events-none 1"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" className="h-full" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            {showDot && (
                                <RedDot className="ml-[-11px] mt-[2px]" cx="4" cy="4" r="3.5" w="9" h="9" />
                            )}
                        </div>
                        

                        <div className="relative">
                            

                            <div className="flex bg-primaryBlue text-center rounded-full text-white border border-primaryBlue overflow-hidden pl-1.5 pr-1.5 py-[0.175rem] leading-none h-full self-center">
                                {!user.name ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <div className="self-center">{user.name.charAt(0).toUpperCase()}</div>
                                )}
                            </div>
                        </div>
                    </button>
                    {showDropdown && (
                        <div className="flex flex-col absolute right-0 my-2 p-2 pt-3 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                            {!!user && (
                                <Link to="/account" className="flex justify-between px-1 py-2 sm:py-3 text-black lora text-xl hover:bg-gray-100" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleLinkClick}>
                                    <h2>Lists</h2>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                    </svg>
                                    
                                </Link>
                            )}

                            {/* <Link to="/friends" className="flex justify-between px-1 py-2 sm:py-3 text-black lora text-xl hover:bg-gray-100" onClick={handleLinkClick}>
                                <h2>Friends</h2>
                                {showDot && <circle cx="17.5" cy="6" r="4" fill="red" stroke="none"/>}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </Link> */}
                            <Link to="/friends" className="flex justify-between px-1 py-2 sm:py-3 text-black lora text-xl hover:bg-gray-100" onClick={handleLinkClick}>
                                <h2 className="flex ">
                                    <span className="pr-2">Friends</span> 
                                    {showDropdown && showDot && <div className="self-center"><RedDot className="ml-[0px]"  mt="5px" cx="4" cy="4" r="4" w="9" h="9"/></div>}
                                </h2>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </Link>

                                
                            <Link to="/places" className="flex justify-between  px-1 py-2 sm:py-3 text-black lora text-xl hover:bg-gray-100" onClick={handleLinkClick}>
                                <h2>Places</h2>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                                </svg>
                            </Link>
                            {/* <Link to="/stores" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={handleLinkClick}>Find Places</Link> */}
                            <div className="flex justify-end mt-1">
                                <button aria-label="Logout button" className="bg-primaryBlue nunito px-2 py-1 sm:py-3  text-white rounded tracking-wide" onClick={logOut}>Logout</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
