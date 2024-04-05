import { useEffect, useContext, useState } from "react";
import { UserContext } from "../components/UserContext";
import { Navigate, Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsSuccess } from '../actions/productActions'; // Import the action creator
import ShoppingList from "../components/ShoppingList";
import CompleteList from "../components/CompleteList";
import CurrentList from "../components/CurrentList";
import UsersLists from "../components/UsersLists";
// import { connect } from 'react-redux';
// import { setAlert } from '../../src/actions/alertActions';

export default function AccountPage() {
    const dispatch = useDispatch();
    const { ready, user, setUser } = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const [currentListLink, setCurrentListLink] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    let {subpage} = useParams();

    useEffect(() => {
        axios.get(`/products/all`).then(({ data }) => {
            dispatch(fetchProductsSuccess(data)); // Dispatch the action with fetched products
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    }, []);

    if (subpage === undefined) {
        subpage = 'profile';
    }
    if (!ready) {
        return 'Loading...';
    }
    if (ready && !user) {
        return <Navigate to={'/login'}/>
    }
    
    function linkClasses(type=null) {
        let classes = 'w-full nunito text-md items-center flex justify-around sm:justify-evenly py-2 px-2';
        if (type === subpage) {
            classes += ' bg-secondaryBlue rounded';
        }
        return classes
    }
    
    async function logOut() {
        axios.post(`/users/logout`)
        .then(res => {
            console.log(res)
            dispatch({ type: 'SET_ALERT', payload: {message: 'Logged out successfully', alertType: 'primaryGreen'} });
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            setUser(null);
            setRedirect('/');
        }).catch(err => {
            setUser(null);
            setRedirect('/');
        });
        
    }

    async function handleRoute(id) {
        subpage = 'current';
        navigate(`/account/current/${id}`);
    }
    async function updateCurrentLink(id) {
        setCurrentListLink(id);
    }
    if (redirect) {
        return <Navigate to={redirect}/>
    }
    return (
        <div>
            {/* <nav className="w-medium flex justify-around mt-16 mb-12">
             */}
             <div className="flex justify-center">

             {/* <nav className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 flex justify-around mt-16 mb-12"> */}
                <nav className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3 flex justify-evenly sm:justify-between mt-10 mb-12 text-md">
                    <Link 
                        className={linkClasses('profile')}
                        to={'/account'}>
                            All
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                    </Link>
                    <Link 
                        className={linkClasses('new')}
                        to={'/account/new'}>
                            New
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>

                    </Link>
                    <Link 
                        className={linkClasses('current')}
                        to={`/account/current/${currentListLink}`}>
                            Current
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                    </Link>
                    <Link 
                        className={linkClasses('completed')}
                        to={'/account/completed'}>
                            Complete
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                            </svg>
                    </Link>
                </nav>

            </div>
            <div className="flex flex-col w-full md:w-2/3 lg:w-2/3 xl:w-2/3 flex justify-center sm:justify-center mt-0 mb-1 mx-auto">
                <div className="w-full">
                    {subpage === 'profile' && (
                    <div className="flex flex-col text-center">
                        {!loading && (
                            <UsersLists sendTo={handleRoute} currentLink={updateCurrentLink}/>
                        )}
                        
                        <div className="text-center nunito max-w-lg mx-auto mt-10">
                            Logged in as {user.name}, {user.email}
                            <button className="primaryBlue mt-5 ml-5" onClick={logOut}>Logout</button>
                        </div>
                    </div>
                    )}
                    {subpage === 'new' && (
                        <div className="flex flex-col text-center">
                            <ShoppingList />
                        </div>
                    )}
                    {subpage === 'current' && (
                        <div className="flex flex-col text-center">
                            <CurrentList />
                        </div>
                    )}
                    {subpage === 'completed' && (
                        <div className="flex flex-col text-center">
                            <CompleteList sendTo={handleRoute}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}