import React, { useState, useContext } from 'react';
import { UserContext } from "./UserContext";
import { useDispatch } from 'react-redux';

import axios from 'axios';

function FriendList() {
    const {user} = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    async function searchUsers(e) {
        const value = e.target.value;
        setSearchTerm(value);
        try {
            const response = await axios.get(`/users/all/${value ? `?search=${value}` : ''}`);
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleAddFriend(friend) {
        console.log('logged in id', user._id)
        console.log('friend user id', friend)
        try {
            const response = await axios.post(`/users/send-request/${friend}`, {
                userId: user._id // Pass userId in the request body
            });
            dispatch({ type: 'SET_ALERT', payload: {message: 'Friend request successfull', alertType: 'primaryGreen'} });

            console.log(response.data); // "Friend request sent successfully."
            // Optionally, you can update the UI to indicate that the request was sent
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <div className="friend-list">
            <h2 className='text-center nunito text-3xl'>Find friends</h2>
            <div className="search-form mt-6">
                <div className="flex">
                    <input 
                        type="text"
                        name="search"
                        value={searchTerm}
                        onChange={searchUsers}
                        placeholder="Search"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"
                    />
                    <button style={{marginLeft: '-35px'}} className="text-primaryBlue font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="user-list">
                {users.map(user => (
                    <div key={user._id} className="flex items-center justify-between bg-white rounded-lg shadow-md px-3 py-4 mb-4 border border-2 border-primaryBlue">
                       <div className="h-full flex flex-col text-left justify-between">
                            <h3 className="text-left text-lg font-medium lora self-start pb-3">{user.name}</h3>
                            <p className="text-left text-sm nunito">{user.email}</p>
                        </div>
                        <div onClick={() => handleAddFriend(user._id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FriendList;
