import { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from "./CustomSelect";
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
        axios.get(`${import.meta.env.VITE_SERVER_URL}/categories`).then(({ data }) => {
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
            const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/products/${product._id}`, body);
            // Update local state with the updated name
            console.log(response)
            let newItem = { formData };
            newItem._id = product._id;
            updateProduct(newItem)

            setOpen(false)
        } catch (error) {
            console.error('Error updating shopping list name:', error);
        }
    }

    async function deleteProduct() {
        console.log(product._id)

        try {
            const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/products/${product._id}`);
            console.log('response', response)
            // Update local state with the updated name
            handleDeleteProduct(product._id);
            setOpenDelete(false)
            setOpen(false)

        } catch (error) {
            setOpenDelete(false)
            setOpen(false)
            console.error('Error updating shopping list name:', error);
        }
    }

    return (
        <>
            {/* Render the modal only if isModalOpen is true */}
            <button onClick={() => handleOpen(product)} className="text-primaryBlue p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 self-center ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </button>
            <Dialog open={open} handler={handleOpen}>
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
                                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                                <div className="mt-2">
                                    <input 
                                    type="text"
                                    name="photo"
                                    value={formData.photo}
                                    onChange={e => setFormData({...formData, photo: e.target.value})}
                                    id="photo"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"/>
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
                        <button className="primaryRed mt-5 nunito font-medium text-xl flex-grow" onClick={handleOpenDelete}>Delete</button>
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
                        <button className="primaryRed mt-5 nunito font-medium text-xl flex-grow flex-shrink-0 ml-2" onClick={deleteProduct}>Delete</button>
                    </div>
                </DialogFooter>
            </Dialog>
        </>
    )
}
