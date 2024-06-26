import React, { useEffect, useContext, useState, lazy, Suspense, useMemo } from "react";
import { UserContext } from "../components/contextComponents/UserContext";
import { Navigate, Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchProductsSuccess } from '../actions/productActions'; // Import the action creator

const ShoppingList =  lazy(() => import("../components/listsComponents/ShoppingList"));
const CurrentList =  lazy(() => import("../components/listsComponents/CurrentList"));
const UsersLists =  lazy(() => import("../components/listsComponents/UsersLists"));

// Wrap lazy-loaded components with Suspense and specify a fallback UI
const SuspenseLoader = ({ children }) => (
    <Suspense fallback={<div><img src="/loading.gif" className='w-8 mx-auto mb-6'/></div>}>
      {children}
    </Suspense>
);
export default function AccountPage() {
    const dispatch = useDispatch();
    const { ready, user } = useContext(UserContext);
    const [currentListLink, setCurrentListLink] = useState('');
    const [listLoading, setListLoading] = useState(false);
    
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user && user._id) {
            setListLoading(true);
            axios.get(`/products/all`).then(({ data }) => {
                dispatch(fetchProductsSuccess(data)); // Dispatch the action with fetched products
                setListLoading(false);
            }).catch(error => {
                console.log(error);
                setListLoading(false);
            });
        }
    }, []);
    
    const { subpage: currentSubpage = 'profile' } = useParams(); // Destructure subpage directly and provide a default value

    // Memoize subpage to prevent unnecessary re-renders
    const subpage = useMemo(() => currentSubpage, [currentSubpage]);
    // Memoize derived values

   // Handle navigation based on user's authentication state
   if (!ready) {
    // User context not ready yet
        let htmlString = '<div><img src="/loading.gif" class="w-8 mx-auto my-6"></div>'
        return (
            <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        )
    } else if (!user) {
        // User not authenticated, navigate to login page
        return <Navigate to="/login" />;
    }

    function linkClasses(type=null) {
        let classes = 'w-full nunito text-md items-center flex justify-around sm:justify-evenly py-2 px-2';
        if (type === subpage) {
            classes += ' bg-secondaryBlue rounded';
        }
        return classes
    }

    async function handleRoute(id) {
        navigate(`/account/current/${id}`);
    }

    async function updateCurrentLink(id) {
        setCurrentListLink(id);
    }

    function updateLoading(boolean) {
        setListLoading(boolean)
    }

    return (
        <div>
             <div className="flex justify-center">
                <nav className="w-full md:w-2/3  flex justify-evenly sm:justify-between mt-6 mb-6 text-md">
                    <Link 
                        className={linkClasses('profile')}
                        to={'/account'}>
                            All
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            </svg>

                    </Link>
                    <Link 
                        className={linkClasses('new')}
                        to={'/account/new'}>
                            New
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                    </Link>
                    <Link 
                        className={linkClasses('current')}
                        to={`/account/current/${currentListLink}`}>
                            Current
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                            </svg>
                    </Link>
                </nav>
            </div>
            
            <div className="flex flex-col w-full md:w-2/3 flex justify-center mt-0 mb-1 mx-auto">
                {subpage === 'profile' && (
                    <div className="flex-col-center">
                        <SuspenseLoader>
                            <UsersLists sendTo={handleRoute} currentLink={updateCurrentLink} isLoading={listLoading} listLoading={updateLoading} />
                        </SuspenseLoader>
                    </div>
                )}
                {subpage === 'new' && (
                    <div className="flex-col-center">
                        <SuspenseLoader>
                            <ShoppingList />
                        </SuspenseLoader>
                    </div>
                )}
                {subpage === 'current' && (
                    <div className="flex-col-center">
                        <SuspenseLoader>
                            <CurrentList isLoading={listLoading} listLoading={updateLoading}/>
                        </SuspenseLoader>
                    </div>
                )}
            </div>
        </div>
    )
}