import React from 'react';
import { Link } from 'react-router-dom';

function CurrentFriendsList({handleFriendClick, friends, isLoading}) {

    return (
        <div className="friend-list">
            <h2 className='text-center lora text-3xl'>Friends</h2>

            {isLoading ? (
                <div></div>
            ) : (
                friends && friends.length !== 0 ? (
                    <div className="user-list  mt-5">
                        {friends.map(friend => (
                            <div key={friend._id} onClick={() => handleFriendClick(friend._id)}  className="flex items-center justify-between bg-white rounded-lg shadow-lg px-2 py-3 mb-4 border border-[1.5px] border-primaryBlue">
                                <div className="h-full flex flex-col text-left justify-between">
                                    <h3 className="text-left text-lg font-medium lora self-start pb-3">{friend.name}</h3>
                                    <p className="text-left text-sm nunito">{friend.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col text-center justify-cente mt-5">
                        <h2 className="flex text-center text-lg nunito justify-center mt-2 items-center">
                            No friends found...let's finds some
                            
                            <Link to={'/friends/find'}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="ml-3 w-6 h-6 text-primaryGreen">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </Link>
                        </h2>
                    </div>      
                )
            )}
        </div>
    );
}

export default CurrentFriendsList;
