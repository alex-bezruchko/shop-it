import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from 'axios';
import { useParams } from "react-router-dom";

// import { useDispatch, useSelector } from 'react-redux';

export default function CurrentList() {
    // const dispatch = useDispatch();

    const {user} = useContext(UserContext);
    const [ifNotEditing, setIfNotEditing] = useState(false);
    const [newName, setNewName] = useState('');
    let { listId } = useParams();
    const [currentList, setCurrentList] = useState({});
    const [selectedListId, setSelectedListId] = useState('');
    
    useEffect(() => {
        let url = '';
        if (listId === 'recent' || listId === '' || listId === undefined) {
            url = `${import.meta.env.VITE_SERVER_URL}/shoppinglists/recent`;
        } else {
            url = `${import.meta.env.VITE_SERVER_URL}/shoppinglists/${listId}`
        }

        axios.get(url).then(({ data }) => {
            if (data.data) {
                setSelectedListId(data.data._id);
                setNewName(data.data.name);
                setCurrentList(data.data);
            }
        }).catch(error => {
            console.log(error);
        });
    }, []);

    async function checkItemFromList(itemId) {
 
        const itemIndex = currentList.products.findIndex(item => item._id === itemId);
        
        if (itemIndex !== -1) { 

            currentList.products[itemIndex].completed = !currentList.products[itemIndex].completed;

            try {
                const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/shoppinglists/${selectedListId}`, { name: currentList.name, products: currentList.products });
                // Update local state with the updated list
                setCurrentList({ ...currentList }); // Trigger re-render by creating a new object reference
            } catch (error) {
                console.error('Error updating shopping list:', error);
            }
        } else {
            console.log('Product not found in the list.');
        }
    }

    async function toggleEditing() {
        setIfNotEditing(!ifNotEditing);
        if (ifNotEditing) {
            try {
                const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/shoppinglists/${selectedListId}`, { name: newName, products: currentList.products });
                // Update local state with the updated name
                setCurrentList({ ...currentList, name: newName }); // Update the name in the current list state
            } catch (error) {
                console.error('Error updating shopping list name:', error);
            }
        }
    }

    return (
        <div className="flex flex-col">
          
        {currentList.products?.length < 1 && (
            <h2 className="flex text-center justify-center mt-2">
                No lists found...let's make one...
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="primaryBlue text-primaryBlue w-6 h-6 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            </h2>
        )
        } <div className="flex flex-col text-center justify-center">
                <div className="w-full">
                    <div className="flex justify-center items-center  pb-5">
                        {!ifNotEditing && (<><h2 className="nunito text-3xl">
                            {currentList.name}
                        </h2>
                        <svg onClick={toggleEditing} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 self-center ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg></>)}
                        {ifNotEditing && (
                            <div className="sm:col-span-3">
                                {/* <label htmlFor="name" className="block nunito text-3xl pb-5">Name</label> */}
                                <div className="mt-0 flex justify-center items-center">
                                    <input 
                                    type="text"
                                    name="name"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    id="name"
                                    className="editInline block w-full nunito text-3xl rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue text-center"
                                    />
                                    <svg onClick={toggleEditing} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 ml-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                                    </svg>

                                </div>
                            </div>
                        )}
                        
                    </div>
                    <ul>
                        {currentList.products?.map(product => (
                        <div key={product._id} className={`flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-4 border-2 ${product.completed ? 'border-primaryBlue' : 'border-primaryOrange'}`}>
                            <div className="flex items-center w-full justify-between">
                            <div className="mr-4">
                                <h3 className="text-left text-lg font-medium lora">{product.product.name}</h3>
                                <p className="text-left text-sm lora">{product.product.description}</p>
                                <p className="text-left text-sm lora">{product.product.price}</p>
                            </div>
                            <img src={product.product.photo} alt="Product Photo" className="w-24 h-auto pr-4"/>
                            </div>
                            <div>
                                {product.completed === true && (<svg className="primaryBlue text-primaryBlue w-10 h-10" onClick={() => checkItemFromList(product._id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path stroke="0fa3b1" fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                </svg>
                                )}
                                {product.completed === false && (
                                <svg xmlns="http://www.w3.org/2000/svg"  onClick={() => checkItemFromList(product._id)} fill="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="primaryOrange text-primaryOrange w-10 h-10">
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