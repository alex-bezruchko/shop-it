import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
// import { useDispatch, useSelector } from 'react-redux';

export default function UsersLists({sendTo, currentLink}) {
    // const dispatch = useDispatch();

    const {user} = useContext(UserContext);
    const [currentLists, setCurrentLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState('');
    let navigate = useNavigate();
    console.log(user._id)
    let url = `${import.meta.env.VITE_SERVER_URL}/shoppinglists/owner/${user._id}`;

    console.log(url)
    useEffect(() => {
        axios.get(url).then(({ data }) => {
            // dispatch(fetchProductsSuccess(data)); // Dispatch the action with fetched products
            // setLoading(false)
            console.log('data', data)
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
        // navigate(`/account/current/${id}`)
    }
    // async function checkItemFromList(itemId) {


    // async function checkItemFromList(itemId) {
    //     const listId = selectedListId;
    //     console.log('PRODUCT ID', itemId)
    //     console.log('SELECTED LIST ID', selectedListId)
    //     console.log('before updatedLists', currentLists)
    //     const updatedLists = currentLists[0].products.map(list => {
    //         if (list._id === listId) {
    //             const updatedItems = list.products.map(item => {
    //                 if (item.product._id === selectedListId) {
    //                     return {
    //                         ...item,
    //                         complete: !item.complete
    //                     };
    //                 }
    //                 return item;
    //             });
    //             return {
    //                 ...list,
    //                 products: updatedItems
    //             };
    //         }
    //         return list;
    //     });
    
    //     console.log('after updatedLists', updatedLists)

    //     try {
    //         // Update backend with the updated shopping list
    //         let response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/shoppinglists/${listId}`, { products: updatedLists });
    //         console.log('Shopping list updated successfully', response);
    //         // Update local state with the updated list
    //         setCurrentLists(updatedLists);
    //     } catch (error) {
    //         console.error('Error updating shopping list:', error);
    //     }
    // }

    console.log('currentLists', currentLists)
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
                            <div onClick={() => viewList(list._id)} key={list._id} className={`flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-4 border border-2 ${list.completed ? 'border-primaryBlue' : 'border-primaryOrange'}`}>
                                <div className="flex items-center w-full justify-between">
                                    <div className="mr-4">
                                        <h2 className="text-left text-xl lora font-medium">{list.name}</h2>
                                        {/* <p className="text-left text-sm">{product.product.description}</p> */}
                                        {/* <p className="text-left text-sm">{product.product.price}</p> */}
                                    </div>
                                    {/* <img src={product.product.photo} alt="Product Photo" className="w-24 h-auto pr-4"/> */}
                                    </div>
                                <div>
                                    {list.completed == true && (<svg className="primaryBlue text-primaryBlue w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path stroke="0fa3b1" fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                </svg>
                                ) }
                                

                                    {list.completed == false && (
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="primaryOrange text-primaryOrange w-10 h-10">
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                 </svg>
                                    )}
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
                {/* <button className="primaryBlue mt-5" onClick={createShoppingList}>Create List</button> */}
            </div>
            {/* <ProductList products={products} addToList={addToList}/> */}

            
            {/* <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-1">
                <div className="sm:col-span-3">
                    <div className="mt-2 flex">
                        <input 
                        type="text"
                        name="name"
                        onChange={searchProducts}
                        id="name"
                        placeholder="Search"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"/>
                        <button style={{marginLeft: '-35px'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>
                    
                </div>
            </div>
            <ProductList noHeader={true} products={products} addToList={addToList}/>
            {}
             */}
        </div>
    )
}
