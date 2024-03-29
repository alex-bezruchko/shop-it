import { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from "./CustomSelect";
import ImageSearch from "./ImageSearch";
import FileUpload from './FileUpload';

import {
    Dialog,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";
   

export default function ProductForm({product, updateProduct, handleDeleteProduct}) {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false)
    const [categories, setCategories] = useState([]);
    const [photo, setPhoto] = useState([]);
    // const [fileName, setfileName] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        photo: '',
        price: ''
    });
      
    const handleOpen = (product) => {
        if (!open) {
            if (product) {
                setFormData({
                  name: product.name || '',
                  category: product.category || '',
                  description: product.description || '',
                  photo: product.photo || '',
                  price: product.price || ''
                });
                setPhoto(product.photo || null)
            }
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const handleOpenDelete = () => {
        if (!openDelete) {
            setOpenDelete(true);
        } else {
            setOpenDelete(false);
        }
        setOpen(true)
    };

    useEffect(() => {
        axios.get(`/categories`).then(({ data }) => {
            let options = data.map(item => ({
                _id: item._id,
                name: item.name
            }))
            setCategories(options);

        }).catch(error => {
            console.log(error);
        });
    }, []);

    async function editProduct(e) {
        e.preventDefault();
        let body = { formData };

        try {
            const response = await axios.put(`/products/${product._id}`, body);
            // Update local state with the updated name
            let newItem = { formData };
            newItem._id = product._id;
            updateProduct(newItem);
            dispatch({ type: 'SET_ALERT', payload: {message: 'Product updated successfully', alertType: 'primaryGreen'} });

            setOpen(false)
        } catch (error) {
            console.error('Error updating shopping list name:', error);
        }
    }

    async function deleteProduct() {

        try {
            const response = await axios.delete(`products/${product._id}`);
            handleDeleteProduct(product._id);
            setOpenDelete(false)
            setOpen(false)
            dispatch({ type: 'SET_ALERT', payload: {message: 'Product deleted successfully', alertType: 'primaryGreen'} });


        } catch (error) {
            setOpenDelete(false)
            setOpen(false)
        }
    }

    function handleImageSelect(selectedPhoto) {
        setPhoto(selectedPhoto);
        setFormData(prevFormData => ({
            ...prevFormData,
            photo: selectedPhoto || ''
        }));
    }
    function removePhoto() {
        setPhoto('');
        setFormData(prevFormData => ({
            ...prevFormData,
            photo: ''
        }));
    }


    return (
        <>
            {/* Render the modal only if isModalOpen is true */}
            <button onClick={() => handleOpen(product)} className="text-primaryOrange p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 self-center mx-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </button>
            <Dialog open={open} handler={handleOpen}  className="flex flex-col overflow-x-auto">
                <h2 className="nunito text-3xl pb-5 text-black text-center pt-5">Edit Product</h2>
                <DialogBody className="pt-0">
                    <form>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-1">
                            <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                                <div className="mt-2">
                                    <input 
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    id="name"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"/>
                                </div>
                            </div>
                            
                            <div className="sm:col-span-3">
                                <CustomSelect 
                                    selectedOption={formData.category} 
                                    handleSelect={(selectedCategory) => setFormData({ ...formData, category: selectedCategory })} 
                                    options={categories}
                                />
                            </div>
                            
                            <div className="sm:col-span-3">
                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                                <div className="mt-2">
                                    <input 
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    id="description"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"/>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <ImageSearch addPhoto={handleImageSelect} />
                            </div>
                            <div className="sm:col-span-3 flex justify-between">
                                                            
                                <div className="flex items-center justify-between w-full">
                                    {photo && (        
                                    
                                        <div className="flex items-center border-r w-full">
                                            <img src={photo} alt="Selected" className="w-40 h-40" />
                                            <button onClick={() => removePhoto()} className="text-primaryRed mt-2 mx-auto text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 ml-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className="w-1/2 flex flex-col w-1/2 h-full justify-left">
                                        <FileUpload setFile={handleImageSelect}/>
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
                                <div className="mt-2">
                                    <input 
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                    id="price"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"/>
                                </div>
                            </div>    
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                <div className="w-full flex justify-between">
                    <div>
                        <button className="primaryRed mt-5 nunito font-medium text-xl flex-grow p-2" onClick={handleOpenDelete}>Delete</button>
                    </div>
                    <div className="flex justify-end">
                        <button className="primaryOrange mt-5 nunito font-medium text-xl flex-grow" onClick={handleOpen}>Cancel</button>
                        <button className="primaryBlue mt-5 nunito font-medium text-xl flex-grow flex-shrink-0 ml-2" onClick={editProduct}>Update</button>
                    </div>
                    
                </div>
                </DialogFooter>
            </Dialog>
            <Dialog open={openDelete} handler={handleOpenDelete}>
                <h2 className="nunito text-3xl pb-5 text-black text-center pt-5">Confirm Delete</h2>
                
                <DialogFooter>
                    <div className="flex justify-end">
                        <button className="primaryOrange mt-5 nunito font-medium text-xl flex-grow" onClick={handleOpenDelete}>Cancel</button>
                        <button className="primaryRed mt-5 nunito font-medium text-xl flex-grow flex-shrink-0 ml-2 p-2" onClick={deleteProduct}>Delete</button>
                    </div>
                </DialogFooter>
            </Dialog>
        </>
    )
}
