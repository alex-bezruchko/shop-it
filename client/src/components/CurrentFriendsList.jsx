import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "./UserContext";
import axios from 'axios';

function CurrentFriendsList() {
    const { user } = useContext(UserContext);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        async function fetchFriends() {
            try {
                const response = await axios.get(`/users/friends/${user._id}`);
                setFriends(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchFriends();
    }, [user._id]); // Trigger the effect whenever user._id changes

    return (
        <div className="friend-list">
            <h2 className='text-center nunito text-3xl'>Friends List</h2>
            <div className="user-list  mt-5">
                {friends.map(friend => (
                    <div key={friend._id}  className="flex items-center justify-between bg-white rounded-lg shadow-md px-3 py-4 mb-4 border border-2 border-primaryBlue">
                        <div className="h-full flex flex-col text-left justify-between">
                            <h3 className="text-left text-lg font-medium lora self-start pb-3">{friend.name}</h3>
                            <p className="text-left text-sm nunito">{friend.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CurrentFriendsList;
