import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from 'axios';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { removeAlert } from '../actions/alertActions';

export default function UsersLists({sendTo, currentLink}) {
    const dispatch = useDispatch();

    const {user} = useContext(UserContext);
    const [currentLists, setCurrentLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState('');
    let url = `/shoppinglists/owner/${user._id}`;
    removeAlert();
    useEffect(() => {
        axios.get(url).then(({ data }) => {
            if (data.shoppingLists) {
                currentLink(data.shoppingLists[0]._id)
                setCurrentLists(data.shoppingLists)
            }
        }).catch(error => {
            console.log(error);
        });
    }, []);

    async function viewList(id) {
        sendTo(id)
    }

    async function deleteList(id) {
        try {
            const response = await axios.delete(`/shoppinglists/${id}`);
            // Update local state with the updated name
            let newList = currentLists.filter(list => list._id !== id);
            setCurrentLists(newList);
            dispatch({ type: 'SET_ALERT', payload: {message: 'Shopping list deleted successfully', alertType: 'primaryGreen'} });

        } catch (error) {
            dispatch({ type: 'SET_ALERT', payload: {message: 'Unable to delete list', alertType: 'primaryRed'} });
            console.error('Error updating shopping list name:', error);
        }
    }
    return (
        <div className="flex flex-col">
          
        {currentLists.length < 1 && (
            <h2 className="flex text-center justify-center mt-2">
                No lists found...let's make one...
                
                <Link to={'/account/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                </Link>
            </h2>
        )
        } <div className="flex flex-col text-center justify-center">
            
                <div className="w-full">
                    <h2 className="nunito text-3xl pb-5">Your Lists</h2>
                    <ul>
                        {currentLists.map(list => (
                            <div key={list._id} className="flex w-full justify-between">
                                <div onClick={() => viewList(list._id)} className={`flex w-full items-center justify-between bg-white rounded-lg shadow-md p-4 mb-4 border border-2 ${list.completed ? 'border-primaryBlue' : 'border-primaryOrange'}`}>
                                    <div className="flex w-full items-center w-full justify-between">
                                        <div className="mr-4">
                                            <h2 className="text-left text-xl lora font-medium">{list.name}</h2>
                                        </div>
                                        
                                    </div>
                                    <div>
                                        {list.completed == true && (
                                            <svg className="primaryBlue text-primaryBlue w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path stroke="0fa3b1" fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    
                                        {list.completed == false && (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="primaryOrange text-primaryOrange w-10 h-10">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        )}
                                    </div>                    
                                </div>
                                <button onClick={() => deleteList(list._id)} className="text-primaryRed ml-4 mb-4 p-1 self-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    )
}
