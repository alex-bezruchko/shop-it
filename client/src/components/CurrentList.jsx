import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from 'axios';
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";


// import { useDispatch, useSelector } from 'react-redux';

export default function CurrentList() {
    // const dispatch = useDispatch();

    const {user} = useContext(UserContext);
    const [ifNotEditing, setIfNotEditing] = useState(false);
    const [newName, setNewName] = useState('');
    let { listId } = useParams();
    const [currentList, setCurrentList] = useState({products: []});
    const [selectedListId, setSelectedListId] = useState('');
    const [selectedProducts, setSelectedProducts] = useState({products: []});

    const [products, setProducts] = useState({});

    
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


    async function updateShoppingList(updatedList) {
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/shoppinglists/${selectedListId}`, updatedList);
            // Update local state with the updated list
            setCurrentList(updatedList); // Trigger re-render by passing the updated list directly
        } catch (error) {
            console.error('Error updating shopping list:', error);
        }
    }
    
    async function addToList(product) {
        console.log('product', product);
        console.log('currentList', currentList);
    
        const isDuplicate = currentList.products.some(p => p.product._id === product._id);
        console.log('isDupe', isDuplicate);
    
        if (!isDuplicate) {
            const updatedProducts = [...currentList.products, { product, completed: false }];
            const updatedList = { ...currentList, products: updatedProducts };
            updateShoppingList(updatedList);
        }
    }
    
    async function checkItemFromList(itemId) {
        
            const itemIndex = currentList.products.findIndex(item => item._id === itemId);
        
            if (itemIndex !== -1) { 
    
                currentList.products[itemIndex].completed = !currentList.products[itemIndex].completed;
                updateShoppingList(updatedList);
    
                
            } else {
                console.log('Product not found in the list.');
            }
    }
    

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
    // async function addToList(product) {
    //     console.log('product', product)
    //     console.log('currentList', currentList)

    //     const isDuplicate = currentList.products.some(p => p.product._id === product._id);
    //     console.log('isDupe', isDuplicate);

    //     if (!isDuplicate) {
    //         const updatedProducts = [...currentList.products, { product, completed: false }];
    //         setCurrentList(prevState => ({
    //             ...prevState,
    //             products: updatedProducts
    //         }));
    //     }
    // }
    async function searchProducts(e) {
        e.preventDefault();
        let body = e.target.value;
        try {
            await axios.get(`${import.meta.env.VITE_SERVER_URL}/products/search/?query=${body}`).then(({ data }) => {
                setProducts(data)
            }).catch(error => {
                if (error) {
                    setProducts([])
                }
            });
        } catch(e) {
            console.log(e)
        }
    }
    async function handleUpdateProducts(formData) {
        let product = formData.formData;
        product._id = '';
        product._id = formData._id;

        let updatedProducts = [...products.products];
        let findIndex = updatedProducts.findIndex(item => item._id === product._id);
        
        // If the product is found, update it in the copy of the products array
        if (findIndex !== -1) {
            updatedProducts[findIndex] = product;
            // Update the state with the new products array
            setProducts({ ...products, products: updatedProducts });
        } 
    }

    
    async function deleteProductFromList(id) {
        console.log(id)
        let updatedProducts = [...products.products];
        let newList = updatedProducts.filter(item => item._id !== id);
        setProducts({ ...products, products: newList });
    }

    async function deleteProductFromShoppingList(id) {
        let updatedProducts = [...currentList.products];
        let newList = updatedProducts.filter(item => item.product._id !== id);
        const updatedList = { ...currentList, products: newList };
        updateShoppingList(updatedList);
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
                        <svg onClick={toggleEditing} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 self-center ml-2 text-primaryOrange">
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
                                    <svg onClick={toggleEditing} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 ml-1 text-primaryBlue">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                                    </svg>
                                </div>
                            </div>
                        )}
                        
                    </div>
                    <ul className="flex flex-col justify-between">
                        {currentList.products?.map(product => (
                        <div key={product.product._id} className="flex w-full justify-between">
                            <div className={`flex items-center w-full justify-between bg-white rounded-lg shadow-md p-3 mb-4 border-2 ${product.completed ? 'border-primaryBlue' : 'border-primaryOrange'}`}>
                                <div className="flex items-center w-full justify-between">
                                    <div className="mr-4 flex flex-col w-full justify-between">
                                    
                                        <h3 className="text-left text-lg font-medium lora self-start">{product.product.name}</h3>
                                        <div className="pt-3">
                                            <p className="text-left text-sm nunito">{product.product.description}</p>
                                            <p className="text-left text-sm nunito">${product.product.price}</p>
                                        </div>
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
                            <button onClick={() => deleteProductFromShoppingList(product.product._id)} className="primaryRed ml-4 mb-4 p-1 self-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 grid-cols-1">
                <div className="sm:col-span-3">
                    <div className="flex">
                        <input 
                        type="text"
                        name="name"
                        onChange={searchProducts}
                        id="name"
                        placeholder="Search"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"/>
                        <button style={{marginLeft: '-35px'}} className="text-primaryBlue font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>
                    
                </div>
            </div>

            <ProductList handleUpdateProducts={handleUpdateProducts} deleteProduct={deleteProductFromList} noHeader={true} products={products} addToList={addToList}/>

        </div>
    )
}
