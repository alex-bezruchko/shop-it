import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from 'axios';
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import ValidationErrorDisplay from "./ValidationErrors";
import { Validation } from "./Validation";

export default function CurrentList({listLoading, isLoading}) {

    const {user} = useContext(UserContext);
    const [ifNotEditing, setIfNotEditing] = useState(false);
    const [newName, setNewName] = useState('');
    let { listId } = useParams();
    const [currentList, setCurrentList] = useState({products: []});
    const [selectedListId, setSelectedListId] = useState('');
    const [selectedProducts, setSelectedProducts] = useState({products: []});
    const [errors, setErrors] = useState([]);
    const [updateLoading, setUpdateLoading] = useState(false)
    const [idLoaded, setIdLoaded] = useState(false);
    const [products, setProducts] = useState({});

    
    useEffect(() => {
        listLoading(true);
        let url = '';
        if (listId === 'recent' || listId === '' || listId === undefined) {
            url = `shoppinglists/recent`;
        } else {
            url = `shoppinglists/${listId}`
        }

        axios.get(url).then(({ data }) => {
            if (data.data) {
                setSelectedListId(data.data._id);
                setNewName(data.data.name);
                setCurrentList(data.data);
                listLoading(false);
            }
        }).catch(error => {
            listLoading(false);
            console.log(error);
        });
    }, []);


    async function updateShoppingList(updatedList) {
        let body = {
            name: newName,
            // products: updatedList.products,
        }
        const validationErrors = Validation(body);
        if (validationErrors.length > 0) {
            // Handle validation errors here
            setErrors(validationErrors)
        } else {
            setUpdateLoading(true);
            console.log(`setUpdateLoading`, updateLoading)
            body.owner = user._id;
            try {
                const response = await axios.put(`shoppinglists/${selectedListId}`, updatedList);
                if (response) {
                    setCurrentList(updatedList);
                    setUpdateLoading(false);
                }
            } catch (error) {
                setUpdateLoading(false);
                console.error('Error updating shopping list:', error);
            }
        }
    }
    
    async function addToList(product) {
        console.log('ADD TOOOOO')
    
        const isDuplicate = currentList.products.some(p => p.product._id === product._id);
    
        // if (!isDuplicate) {
            const updatedProducts = [...currentList.products, { product, completed: false }];
            const updatedList = { ...currentList, products: updatedProducts };
            console.log('updatedList AAAAAA', updatedList);
            updateShoppingList(updatedList);
        // }
    }
    
    // async function checkItemFromList(itemId) {
    //     setIdLoaded(itemId);
    //     setUpdateLoading(true);
    //     const itemIndex = currentList.products.findIndex(item => item._id === itemId);
    
    //     if (itemIndex !== -1) { 

    //         currentList.products[itemIndex].completed = !currentList.products[itemIndex].completed;
    //         updateShoppingList(updatedList);
    //         setUpdateLoading(false);
    //     } else {
    //         setUpdateLoading(false);
    //         console.log('Product not found in the list.');
    //     }
    // }
    
    async function checkItemFromList(itemId) {
        setIdLoaded(itemId);
        setUpdateLoading(true);
 
        const itemIndex = currentList.products.findIndex(item => item._id === itemId);
        
        if (itemIndex !== -1) { 

            currentList.products[itemIndex].completed = !currentList.products[itemIndex].completed;
            try {
                console.log('maaad')
                const response = await axios.put(`shoppinglists/${selectedListId}`, { name: currentList.name, products: currentList.products });
                if (response) {
                    setCurrentList({ ...currentList });
                }
                setUpdateLoading(false);

            } catch (error) {
                setUpdateLoading(false);
                console.error('Error updating shopping list:', error);
            }
        } else {
            console.log('Product not found in the list.');
        }
    }

    async function toggleEditing() {
        if (ifNotEditing) {
            // Check if the new name is empty
            if (!newName.trim()) {
                setErrors([{ field: 'name', message: 'Name is required' }]);
                return; // Stop further execution
            }
    
            // If the new name is not empty, clear any previous errors
            setErrors([]);
    
            // Continue with editing
            setIfNotEditing(!ifNotEditing);
            setUpdateLoading(true)
            console.log('maaaad')
            try {
                const response = await axios.put(`shoppinglists/${selectedListId}`, { name: newName, products: currentList.products });
                // Update local state with the updated name
                setCurrentList({ ...currentList, name: newName }); // Update the name in the current list state
                setUpdateLoading(false);
            } catch (error) {
                setUpdateLoading(false);
                console.error('Error updating shopping list name:', error);
            }
        } else {
            setErrors([]);
            setIfNotEditing(!ifNotEditing);
        }
    }
    

    async function searchProducts(e) {
        e.preventDefault();
        let body = e.target.value;
        try {
            await axios.get(`/products/search?query=${body}`).then(({ data }) => {
                setProducts(data); // Assuming data is in the format { products: [...] }
            }).catch(error => {
                if (error) {
                    setProducts([]);
                }
            });
        } catch(e) {
            console.log(e);
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

    async function deleteProduct(product) {
        console.log('current list deleteProduc(product)', product)
    }

    async function updateProduct(formData) {
        let product = formData.formData;
        product._id = '';
        product._id = formData._id;
        let newList = [...currentList.products];
        const productIndex = newList.findIndex(item => item.product._id === product._id);

        newList[productIndex] = {
            ...newList[productIndex],
            product: {
                ...newList[productIndex].product,
                ...product
            }
        };
    
        setCurrentList({...currentList, products: newList});
    }
    
    async function deleteProductFromList(id) {
        console.log('deleteProductFromList', id)
        let updatedProducts = [...products.products];
        let newList = updatedProducts.filter(item => item._id !== id);
        setProducts({ ...products, products: newList });
    }

    async function deleteProductFromShoppingList(id) {
        console.log('deleteProductFromShoppingList', id)
        let updatedProducts = [...currentList.products];
        let newList = updatedProducts.filter(item => item.product._id !== id);
        const updatedList = { ...currentList, products: newList };
        console.log('updatedList', updatedList)
        updateShoppingList(updatedList);
    }
    // console.log('updateLoading', updateLoading)
        
    return (
        <div className="flex flex-col">
            {isLoading ? (
                <></>
            ) : (
                <div>
                    {currentList.products?.length < 1 && (
                        <h2 className="flex text-center nunito text-lg justify-center mt-2">
                            No lists found...let's make one...
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="primaryBlue text-primaryBlue w-6 h-6 ml-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                        </h2>
                    )} 
                    <div className="flex flex-col text-center justify-center">
                        <div className="w-full">
                            {errors.length > 0 && (
                                <div className="mx-0">
                                    <ValidationErrorDisplay errors={errors}/>
                                </div>
                            )} 
                            <div className="flex justify-center items-center lora pb-5">
                                {!ifNotEditing && (<><h2 className="nunito text-3xl">
                                    {currentList.name}
                                </h2>
                                <svg onClick={toggleEditing} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 self-center ml-2 text-primaryOrange">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg></>)}
                                {ifNotEditing && (
                                    <div className="sm:col-span-3">
                                        {/* <label htmlFor="name" className="block lora text-3xl pb-5">Name</label> */}
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
                                        <div className={`flex items-center w-full justify-between bg-white rounded-lg shadow-lg p-0 md:p-3 mb-4 border border-2 ${product.completed ? 'border-primaryBlue' : 'border-primaryOrange'}`}>
                                            <div className="flex items-center w-full h-full justify-between">
                                                <div className="mr-0 flex flex-col w-full justify-between h-full">
                                                    <h3 className="pl-2 pr-0 pt-2 text-left text-lg font-medium lora self-start">{product.product.name}</h3>
                                                    <div className="pl-2 pr-0 pb-2">
                                                        {/* <p className="text-left text-sm nunito">{product.product.description}</p> */}
                                                        <p className="text-left text-md lora">${product.product.price}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between h-full">
                                                    <div className="flex flex-col justify-between h-full pr-2">
                                                        <button 
                                                            onClick={() => checkItemFromList(product._id)} 
                                                            className="ml-0 mb-0 p-0 pr-2self-center h-full"
                                                                >
                                                            {updateLoading && product._id === idLoaded ? (
                                                                <div>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="primaryGreen text-primaryGreen w-[38px] h-[38px] sm:w-10 sm:h-10">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                                    </svg>
                                                                </div> 
                                                            ) : (
                                                                <div>
                                                                    {product.completed ? (
                                                                        // <svg className="primaryBlue text-primaryBlue w-7 h-7 sm:w-10 sm:h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                                        //     <path stroke="0fa3b1" fillRule="evenodd" d="m4.5 12.75 6 6 9-13.5" clipRule="evenodd" />
                                                                        // </svg>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[38px] h-[38px] text-primaryBlue ">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                                        </svg>

                                                                    ) : (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[35px] h-[35px] text-primaryOrange">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                                                        </svg>

                                                                    )}
                                                                </div>
                                                            )}
                                                        </button>

                                                        <div className="flex items-end pb-3 pr-1">
                                                            <ProductForm 
                                                                className="h-full flex items-end" 
                                                                product={product.product} 
                                                                handleDeleteProduct={deleteProduct} 
                                                                updateProduct={updateProduct}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <img 
                                                    src={product.product.photo || 'placeholder.svg'} 
                                                    alt="Product Photo" 
                                                    className="cursor-pointer mr-0 max-h-[120px] min-h-[120px] min-w-[120px] max-w-[120px] rounded-r-md"
                                                    onClick={() => checkItemFromList(product._id)}
                                                />
                                            </div>
                                        </div>
                                        <button onClick={() => deleteProductFromShoppingList(product.product._id)} className="text-primaryRed ml-2 mb-4 p-0 self-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8 ">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <h2 className="nunito text-3xl my-8 mt-4">Add more</h2>

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

                    <ProductList currentList={currentList} handleUpdateProducts={handleUpdateProducts} deleteProduct={deleteProductFromShoppingList} noHeader={true} products={products} addToList={addToList}/>

                </div>
            )}
        </div>
    )
}
