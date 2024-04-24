import { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from 'axios';
import ProductList from "../components/ProductList";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import ValidationErrorDisplay from "./ValidationErrors";
import { Validation } from "./Validation";

export default function ShoppingList() {
    const dispatch = useDispatch();

    const {user} = useContext(UserContext);
    const [list, setList] = useState('');
    const [products, setProducts] = useState({products: []});
    const [selectedProducts, setSelectedProducts] = useState({products: []});
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    async function createShoppingList(e) {
        e.preventDefault();
        let body = {
            name: list,
            products: selectedProducts.products,
        }
        const validationErrors = Validation(body);
        if (validationErrors.length > 0) {
            // Handle validation errors here
            setErrors(validationErrors)
        } else {
            body.owner = user._id;
            body.completed = false;
            try {
                await axios.post(`/shoppinglists/${body.owner}`, body).then(({data})=> {
                    navigate(`/account/current/${data.shoppingList._id}`)
                    setList({name: '', products: []})
                    dispatch({ type: 'SET_ALERT', payload: {message: 'Shopping list created successfully', alertType: 'primaryGreen'} });
                });
            } catch(e) {
                console.log(e)
            }
        }
    }
    function removeFromList(selectedProduct) {
        const updatedProducts = selectedProducts.products.filter(product => product._id !== selectedProduct._id);

        setSelectedProducts(prevState => ({
            ...prevState,
            products: updatedProducts
        }));
    }
    function addToList(product) {

        const isDuplicate = selectedProducts.products.some(p => p._id === product._id);

        if (!isDuplicate) {
            setSelectedProducts(prevState => ({
                ...prevState,
                products: [...prevState.products, product]
            }));
        }
    }
    async function searchProducts(e) {
        e.preventDefault();
        let body = e.target.value;
        try {
            await axios.get(`/products/search/?query=${body}`).then(({ data }) => {
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
        const _id = formData.id;
        const body = formData;
        delete body.id
        const updatedProduct = body;
        
        if (!updatedProduct || !_id) {
            console.error('Invalid form data');
            return;
        }

        // Update the products state
        setProducts(prevProducts => {
            const updatedProducts = prevProducts.products.map(product => {
                if (product._id === _id) {
                    return { ...product, ...updatedProduct };
                }
                return product;
            });
            return { ...prevProducts, products: updatedProducts };
        });
        
        setSelectedProducts(prevSelectedProducts => {
            const updatedSelectedProducts = prevSelectedProducts.products.map(product => {
                if (product._id === _id) {
                    return { ...product, ...updatedProduct };
                }
                return product;
            });
            return { ...prevSelectedProducts, products: updatedSelectedProducts };
        });
        
    }
    

    async function deleteProductFromList(id) {
        console.log('deleteProductFromList', id)
        let updatedProducts = [...selectedProducts.products];
        let newList = updatedProducts.filter(item => item._id !== id);
        setSelectedProducts({ ...selectedProducts, products: newList });
    }
    return (
        <div className="flex flex-col">
            {errors.length > 0 && (
                <div className="mx-0">
                    <ValidationErrorDisplay errors={errors}/>
                </div>
            )}  
            <div className="sm:col-span-3">
                <label htmlFor="name" className="block lora text-3xl pb-3 mt-0">Name</label>
                <div className="mt-2">
                    <input 
                    type="text"
                    name="name"
                    value={list}
                    onChange={e => setList(e.target.value)}
                    id="name"
                    placeholder="Memorial Day List"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"/>
                </div>
            </div>
            
            
            <div className="flex flex-col text-center justify-center">
                <label htmlFor="name" className="block lora text-3xl pt-6 pb-3">Products</label>
                {selectedProducts.products.length < 1 && (
                    <div className="flex flex-col nunito text-center justify-center mt-1">
                        <h2 className="text-lg nunito">No products added yet.</h2>
                    </div>
                )} 
                <div className="w-full mt-3">
                    <ul>
                        {selectedProducts.products.map(product => (
                            <li key={product._id} className="flex w-full justify-between">
                                <div className="flex items-center w-full justify-between bg-white rounded-lg shadow-lg p-0 md:p-0 mb-4 border border-2 border-primaryBlue">
                                    <div className="mr-4 flex flex-col justify-between h-full">
                                        <h3 className="pl-2 pt-2 text-left text-lg font-medium lora self-start">{product.name}</h3>
                                        <div className="pl-2 pb-2 pt-0">
                                            <p className="text-left text-md nunito">{product.description}</p>
                                            <p className="text-left text-md lora">${product.price}</p>
                                        </div>
                                    </div>
                                    {product.photo !== '' && (
                                        <img
                                            data-src={product.photo} // Change src to data-src
                                            src={`${product.photo}?fit=crop&w=175&h=175&crop=entropy` || placeholderImg}
                                            alt={`Photo for ${product.name}`}
                                            className="cursor-pointer mr-0 max-h-[95px] min-h-[95px] min-w-[95px] max-w-[95px] sm:max-h-[100%] sm:min-h-[100%] sm:min-w-[100%] sm:max-w-[100%] rounded-r-md"
                                        />
                                    )}
                                    {product.photo == ''  && (
                                        <img
                                            src={placeholderImg}
                                            alt={`Photo for ${product.name}`}
                                            className="cursor-pointer mr-0 max-h-[95px] min-h-[95px] min-w-[95px] max-w-[95px] sm:max-h-[100%] sm:min-h-[100%] sm:min-w-[100%] sm:max-w-[100%] rounded-r-md"
                                        />
                                    )}
                                </div>
                                <div onClick={() => removeFromList(product)} className="text-primaryRed ml-2 mb-4 p-0 self-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button aria-label="Ceate Shopping List button" className="primaryBlue mt-2 nunito text-xl" onClick={createShoppingList}>Create List</button>

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
                        <button aria-label="Search icon button" style={{marginLeft: '-35px'}} className="text-primaryBlue font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>
                    
                </div>
            </div>

            <ProductList currentList={selectedProducts}  handleUpdateProducts={handleUpdateProducts} deleteProduct={deleteProductFromList} noHeader={true} products={products} addToList={addToList}/>
            
        </div>
    )
}
