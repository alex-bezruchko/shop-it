import { useEffect, useContext, useState } from "react";
import { UserContext } from "../components/UserContext";
import { Navigate, Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsSuccess } from '../actions/productActions'; // Import the action creator
import ShoppingList from "../components/ShoppingList";
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
    const [listLoading, setListLoading] = useState(false);
    
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`/products/all`).then(({ data }) => {
            dispatch(fetchProductsSuccess(data)); // Dispatch the action with fetched products
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    }, [user]);
    
    let {subpage} = useParams();

    if (subpage === undefined) {
        subpage = 'profile';
    }

    if (!ready) {
        let htmlString = '<div><img src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif" class="size-10 mx-auto mb-6"></div>'
        return (
            <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        )
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

    function updateLoading(boolean) {
        setListLoading(boolean)
    }

    return (
        <div>
             <div className="flex justify-center">
                <nav className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3 flex justify-evenly sm:justify-between mt-8 mb-8 text-md">
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
                </nav>
            </div>
            {listLoading && (
                <div>
                    <img src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif" className='size-10 mx-auto mb-6'/>
                </div>
            )}
            
            <div className="flex flex-col w-full md:w-2/3 lg:w-2/3 xl:w-2/3 flex justify-center sm:justify-center mt-0 mb-1 mx-auto">
                <div className="w-full">
                    {subpage === 'profile' && (
                    <div className="flex flex-col text-center">
                        {!loading && (
                            <UsersLists sendTo={handleRoute} currentLink={updateCurrentLink} listLoading={updateLoading} />
                        )}
                    </div>
                    )}
                    {subpage === 'new' && (
                        <div className="flex flex-col text-center">
                            <ShoppingList isLoading={listLoading} listLoading={updateLoading}/>
                        </div>
                    )}
                    {subpage === 'current' && (
                        <div className="flex flex-col text-center">
                            <CurrentList isLoading={listLoading} listLoading={updateLoading}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}