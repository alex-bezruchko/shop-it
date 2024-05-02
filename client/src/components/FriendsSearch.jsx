import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "./UserContext";

import { useDispatch } from 'react-redux';

import axios from 'axios';

function FriendSearch({ friends, friendRequests, outgoingRequests }) {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useContext(UserContext);
    
    async function searchUsers(e) {
        let value;
        if (e?.target?.value || e?.target?.value === '') {
            value = e.target.value
        } else {
            value = e;
        }
        setSearchTerm(value);

        try {
            const response = await axios.get(`/users/all/${value ? `?search=${value}` : ''}`);
            let filteredData = response.data.filter(u => u._id !== user._id);
            setUsers(filteredData);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleAddFriend(friend) {
        try {
            const response = await axios.post(`/users/send-request/${friend}`, {
                userId: user._id,
            });
            dispatch({ type: 'SET_ALERT', payload: {message: 'Request initiated', alertType: 'primaryGreen'} });
            console.log(response)

        } catch (error) {
            console.error(error);
            dispatch({ type: 'SET_ALERT', payload: {message: 'Uanble to add friend', alertType: 'primaryRed'} });
        }
    }
    
    function isFriend(userId) {
        return friends.some(friend => friend._id === userId);
    }

    return (
        <div className="friend-list">
            <h2 className='text-center lora text-3xl'>Find friends</h2>
            <div className="search-form mt-6">
                <div className="flex">
                    <input 
                        type="text"
                        name="search"
                        value={searchTerm}
                        onChange={searchUsers}
                        placeholder="Search"
                        autoComplete="given-name"
                        className="input-style"
                    />
                    <button aria-label="Search icon button" style={{marginLeft: '-35px'}} className="text-primaryBlue font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="user-list mt-6">
                {users.map(searchedUser => (
                    <div key={searchedUser._id} className="flex items-center justify-between bg-white rounded-lg shadow-lg px-2 py-3 mb-4 border border-[1.5px] border-primaryBlue">
                        <div className="h-full flex flex-col text-left justify-between">
                            <h3 className="text-left text-lg font-medium lora self-start pb-3">{searchedUser.name}</h3>
                            <p className="text-left text-sm nunito">{searchedUser.email}</p>
                        </div>
                        {!isFriend(searchedUser._id) ? (
                            outgoingRequests?.some(request => request.receiver._id === searchedUser._id) || friendRequests?.some(request => request.sender._id === searchedUser._id) ? (
                                <div className='flex items-center'> 
                                    <span className="nunito text-sm mr-1">Request Pending</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#f7a072" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </div>
                            ) : (
                                <div onClick={() => handleAddFriend(searchedUser._id)}>
                                    <div className='flex items-center'> 
                                        <span className="nunito text-sm mr-1">Send Request</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#0fa3b1" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#0fa3b1" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                        </svg>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className='flex items-center'> 
                                <span className="nunito text-sm mr-1">Already friends</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#6CB462" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#6CB462" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FriendSearch;