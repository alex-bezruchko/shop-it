import { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import axios from 'axios';
import ProductList from "../components/ProductList";
import { useNavigate } from "react-router-dom";

import { useDispatch } from 'react-redux';

export default function ShoppingList() {
    const dispatch = useDispatch();

    const {user} = useContext(UserContext);
    const [list, setList] = useState('');
    const [products, setProducts] = useState({});
    const [selectedProducts, setSelectedProducts] = useState({products: []});
    const navigate = useNavigate();

    async function createShoppingList(e) {
        e.preventDefault();
        let body = {
            name: list,
            products: selectedProducts.products,
            owner: user._id,
            completed: false
        }
        
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
        let product = formData.formData;
        product._id = '';
        product._id = formData._id;

        let updatedProducts = [...products.products];
        let selProducts = [...products.products];

        let findIndex = updatedProducts.findIndex(item => item._id === product._id);
        let findSelected = selProducts.findIndex(item => item._id === product._id);
        
        if (findIndex !== -1) {
            updatedProducts[findIndex] = product;
            setProducts({ ...products, products: updatedProducts });
        } 
        if (findSelected !== -1) {
            selProducts[findSelected] = product;
            setSelectedProducts({ ...products, products: selProducts });
        } 
    }

    async function deleteProductFromList(id) {
        console.log(id)
        let updatedProducts = [...products.products];
        let newList = updatedProducts.filter(item => item._id !== id);
        setProducts({ ...products, products: newList });
    }
    return (
        <div className="flex flex-col">
            <div className="sm:col-span-3">
                <label htmlFor="name" className="block nunito text-3xl pb-5">Name</label>
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
            {selectedProducts.products.length < 1 && (<></>)} 
            
            <div className="flex flex-col text-center justify-center">
                <label htmlFor="name" className="block nunito text-3xl pt-5">Products</label>
                <div className="w-full">
                    <ul>
                        {selectedProducts.products.map(product => (
                        <div key={product._id} className="flex items-center justify-between bg-white rounded-lg shadow-md p-3 mb-4">
                            <div className="flex items-center w-full justify-between">
                                <div className="mr-4 flex flex-col justify-between">
                                
                                    <h3 className="text-left text-lg font-medium lora self-start">{product.name}</h3>
                                    <div className="pt-3">
                                        <p className="text-left text-sm nunito">{product.description}</p>
                                        <p className="text-left text-sm nunito">${product.price}</p>
                                    </div>
                                </div>
                                {product.photo && (
                                    <img src={product.photo} alt="Product Photo" className="min-w-32 min-h-32 w-32 h-32 mr-4"/>)
                                }

                                {product.photo == ''  && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"  className="min-w-32 min-h-32 w-32 h-32 pr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                )}
                            </div>
                            <div onClick={() => removeFromList(product)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                        </div>
                        ))}
                    </ul>
                </div>
            </div>

            <button className="primaryBlue mt-5 nunito text-xl" onClick={createShoppingList}>Create List</button>

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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
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
