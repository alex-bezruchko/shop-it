import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { UserContext } from "../contextComponents/UserContext";
import axios from 'axios';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { removeAlert } from '../../actions/alertActions';

export default function UsersLists({ sendTo, listLoading, isLoading }) {
    const dispatch = useDispatch();
    const { user } = useContext(UserContext);
    const [lists, setLists] = useState([]);
    const [activeTab, setActiveTab] = useState('current');
    removeAlert();

    useEffect(() => {
        if (user && user._id && !lists.length) {
            listLoading(true);
            axios.get(`/shoppinglists/owner/${user._id}`)
                .then(response => {
                    if (response.data.shoppingLists) {
                        setLists(response.data.shoppingLists);
                    }
                })
                .catch(error => {
                    console.error(error);
                    // Handle error here
                })
                .finally(() => {
                    listLoading(false);
                });
        }
    }, [user, lists, listLoading]);

    const handleTab = (tab) => {
        setActiveTab(tab);
    };

    const filteredLists = useMemo(() => {
        if (activeTab === 'current') {
            return lists.filter(list => !list.completed);
        } else if (activeTab === 'completed') {
            return lists.filter(list => list.completed);
        }
        return [];
    }, [lists, activeTab]);

    const deleteList = async (id) => {
        try {
            await axios.delete(`/shoppinglists/${id}`);
            setLists(lists.filter(list => list._id !== id));
            dispatch({ type: 'SET_ALERT', payload: { message: 'Shopping list deleted successfully', alertType: 'primaryGreen' } });
        } catch (error) {
            dispatch({ type: 'SET_ALERT', payload: { message: 'Unable to delete list', alertType: 'primaryRed' } });
            console.error('Error deleting shopping list:', error);
        }
    };

    return (
        <>
            {isLoading ? (
                <div>
                    <img src="/loading.gif" className='w-8 mx-auto mb-6'/>
                </div>
            ) : (
                <>
                    <h2 className="lora text-3xl pb-5">Your Lists</h2>
                    {/* <div className="flex flex-col"> */}
                    <div className="w-full flex flex-col">
                        <div className="tabs flex justify-around">
                            <button aria-label="Current Tab button" onClick={() => handleTab('current')} className={activeTab === 'current' ? 'text-center nunito text-xl p-2 w-1/2 rounded sm:text-3xl lists bg-primaryOrange flex justify-around items-center text-white' : 'text-center text-black nunito text-xl p-2 w-1/2 rounded sm:text-3xl lists flex justify-around items-center'}>
                                <span>Current</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={activeTab === 'current' ? ' w-[35px] h-[35px] text-white' : ' w-[35px] h-[35px] text-black'}>
                                    <path stroke={activeTab === 'current' ? 'currentColor' : '#FF6E4B'} strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                </svg>
                            </button>
                            <button aria-label="Completed Tab button" onClick={() => handleTab('completed')} className={activeTab === 'completed' ? 'text-center nunito text-xl p-2 w-1/2 rounded sm:text-3xl lists bg-primaryGreen flex justify-around items-center text-white' : 'text-center text-black nunito text-xl p-2 w-1/2 rounded sm:text-3xl lists flex justify-around items-center'}>
                                <span>Completed</span>
                                {activeTab === 'completed' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[35px] h-[35px]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                    </svg>
                                
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6CB462" className="w-[35px] h-[35px] text-primaryGreen">
                                        <path stroke="white" fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                    </svg>
                                )}

                            </button>
                        </div>
                        {filteredLists.length === 0 ? (
                            <h2 className="flex text-center text-xl nunito justify-center mt-6">
                                No lists found.
                            </h2>
                        ) : (
                            <ul className="mt-8">
                                {filteredLists.map(list => (
                                    <li key={list._id} className="flex w-full justify-between">
                                        <div onClick={() => sendTo(list._id)} className={`flex w-full items-center justify-between bg-white rounded-lg shadow-lg p-4 mb-4 border border-[1.5px] ${list.completed ? 'border-primaryGreen' : 'border-primaryOrange'}`}>
                                            <div className="flex w-full items-center w-full justify-between">
                                                <div className="mr-4">
                                                    <h2 className="text-left text-xl lora font-medium">{list.name}</h2>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div className="flex">
                                                <button aria-label="Delete List button" onClick={() => deleteList(list._id)} className="text-primaryRed ml-4 mb-4 p-1 self-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* </div> */}
                </>
            )}
        </>
    );
}
