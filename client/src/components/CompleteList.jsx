import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

export default function CompleteList({sendTo}) {
    const dispatch = useDispatch();

    const {user} = useContext(UserContext);
    const [currentLists, setCurrentLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState('');
    // let navigate = useNavigate();
    let url = `/shoppinglists/owner/${user._id}?completed=true`;
    useEffect(() => {
        axios.get(url).then(({ data }) => {
            // dispatch(fetchProductsSuccess(data)); // Dispatch the action with fetched products
            // setLoading(false)
            if (data.shoppingLists) {
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
            <div className="flex justify-center items-center">
                <h2 className="flex text-center nunito text-2xl justify-center mt-2">Nothing completed...let's complete some</h2>
                
                <Link to={'/account'}>
                    <svg className="primaryBlue text-primaryBlue w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path stroke="0fa3b1" fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                </Link>
            </div>
        )
        } <div className="flex flex-col text-center justify-center">
                <div className="w-full">
                    {currentLists.length !== 0 && (<h2 className="nunito text-3xl pb-5">Completed</h2>) }
                    <ul>
                        {currentLists.map(list => (
                             <div key={list._id} className="flex w-full justify-between mb-4 items-center">
                                <div onClick={() => viewList(list._id)} className="flex w-full items-center justify-between bg-white rounded-lg shadow-lg px-4 py-6 border border-1 border-primaryBlue">
                                    <div className="flex items-center w-full justify-between">
                                        <div className="mr-4">
                                            <h2 className="text-left text-xl lora font-medium">{list.name}</h2>
                                        </div>
                                    </div>
                                    {list.completed == true && (
                                        <svg className="primaryBlue text-primaryBlue w-10 h-10 self-center ml-4" onClick={() => checkItemFromList(product._id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path stroke="0fa3b1" fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    
                                </div>
                                <button onClick={() => deleteList(list._id)} className="text-primaryRed ml-4 mb-0 p-1 self-center">
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
