import { useEffect, useContext, useState } from "react";
import { UserContext } from "../components/contextComponents/UserContext";
import { Navigate, Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import FriendsSearch from "../components/FriendsSearch";
import PendingRequests from "../components/contextComponents/PendingRequests";
import CurrentFriendsList from "../components/listsComponents/CurrentFriendsList";
import FriendDetailPage from "./FriendDetailsPage";
import { useRequestContext } from '../components/contextComponents/RequestContext'; // Correct import

export default function FriendsPage() {
    const navigate = useNavigate();
    const { ready, user } = useContext(UserContext);
    let { subpage } = useParams();
    
    const [friendId, setFriendId] = useState(null);
    const [listLoading, setListLoading] = useState(false);
    const [friends, setFriends] = useState([]);

    const requests = useRequestContext();
    const friendRequests = requests.requests.friendRequests;
    const outgoingRequests = requests.requests.outgoingRequests;

    const fetchFriends = async () => {
        if (user && user._id) {

            try {
                setListLoading(true);
                const response = await axios.get(`/users/friends/${user._id}`);
                setFriends(response.data);
            } catch (error) {
                console.error("Error fetching friends: ", error);
            } finally {
                setListLoading(false);
            }
        }
    };

    useEffect(() => {
        if (user && user._id) {
            fetchFriends();
        }
    }, [user]);
    
    useEffect(() => {
        fetchFriends();
    }, [friendRequests, outgoingRequests])

    if (subpage === undefined) {
        subpage = 'find';
    }
    if (!ready) {
        let htmlString = '<div><img src="/loading.gif" class="size-10 mx-auto mb-6"></div>'
        return (
            <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        )
    }
    if (ready && !user) {
        return <Navigate to={'/login'}/>
    }
  
    function linkClasses(type=null) {
        let classes = 'w-full nunito text-md sm:text-lg items-center flex justify-around sm:justify-evenly py-2 px-1 sm:px-2';
        if (type === subpage) {
            classes += ' bg-secondaryBlue rounded';
        }
        return classes
    }
    
    const handleFriendClick = (id) => {
        setFriendId(id);
        navigate(`/friends/friend/${id}`);

    };
    
    function updateLoading(boolean) {
        setListLoading(boolean)
    }

    return (
        <div>
            {/* <nav className="w-medium flex justify-around mt-16 mb-12">
             */}
             <div className="flex justify-center">
                <nav className="w-full md:w-2/3  flex justify-evenly sm:justify-between mt-6 mb-6">
                    <Link 
                        className={linkClasses('find')}
                        to={'/friends/find'}
                        style={{ width: 'fit-content', paddingLeft: '.5rem', paddingRight: '.5rem' }}>
                            Add
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>

                    </Link>
                    <Link 
                        className={linkClasses('current')}
                        to={'/friends/current'}>
                            Friends
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>

                    </Link>
                    <Link 
                        className={linkClasses('friend')}
                        to={`/friends/friend/${friendId}`}>
                            Friend
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                    </Link>
                    <Link 
                        className={linkClasses('pending')}
                        to={'/friends/pending'}>
                            Requests
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>

                    </Link>
                </nav>
             </div>
             {listLoading && (
                <div>
                    <img src="/loading.gif" className='size-10 mx-auto mb-6'/>
                </div>
            )}
             <div className="flex flex-col w-full md:w-2/3  flex justify-center mt-0 mb-1 mx-auto">
                 <div className="w-full">
                     {subpage === 'find' && (
                        <div className="flex flex-col text-center">
                            <FriendsSearch friends={friends} friendRequests={friendRequests} outgoingRequests={outgoingRequests} />
                        </div>
                     )}
                    {subpage === 'current' && (
                        <div className="flex flex-col text-center">
                            <CurrentFriendsList friends={friends} handleFriendClick={handleFriendClick}  isLoading={listLoading}/>
                        </div>
                     )}
                     {subpage === 'friend' && (
                        <div className="flex flex-col text-center">
                            <FriendDetailPage  isLoading={listLoading} listLoading={updateLoading}/>
                        </div>
                    )}
                    {subpage === 'pending' && (
                         <div className="flex flex-col text-center">
                            <PendingRequests updateFriends={setFriends} isLoading={listLoading} listLoading={updateLoading}/>
                         </div>
                     )}
                 </div>
             </div>
         </div>
    )

}