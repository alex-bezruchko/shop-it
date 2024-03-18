import { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from "./CustomSelect";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";
   

export default function ProductsDialog() {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState('');
    const [price, setPrice] = useState('');
    const handleOpen = () => setOpen(!open);

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

    async function createProduct(e) {
        e.preventDefault();
        let body = { name, description, photo, price, category };
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/products`, body).then(({data})=> {
                dispatch({ type: 'ADD_PRODUCT', payload: data });
                setName('');
                setDescription('');
                setCategory('');
                setPhoto('');
                setPrice('');
                setOpen(false);
            });
        } catch(e) {
            console.log(e)
        }
    }
    async function categorySelect(option) {
        setCategory(option)
    }
    
    return (
        <>
            {/* Render the modal only if isModalOpen is true */}
            <div>Add products</div>
            <button onClick={handleOpen} className="bg-primaryBlue text-white p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
            <Dialog open={open} handler={handleOpen}>
                <h2 className="nunito text-3xl pb-5 text-black text-center pt-5">New Product</h2>
                <DialogBody className="pt-0">
                    <form>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-1">
                            <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                                <div className="mt-2">
                                    <input 
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    id="name"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"/>
                                </div>
                            </div>

                            <div className="sm: col-span-3">
                                {categories.length > 0 && (<CustomSelect handleSelect={categorySelect} options={categories}/>)}
                            </div>
                            
                            <div className="sm:col-span-3">
                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                                <div className="mt-2">
                                    <input 
                                    type="text"
                                    name="description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
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
                                    value={photo}
                                    onChange={e => setPhoto(e.target.value)}
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
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    id="price"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"/>
                                </div>
                            </div>    
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                <div className="flex justify-end">
                    <button className="primaryOrange mt-5 nunito font-medium text-xl flex-grow" onClick={handleOpen}>Cancel</button>
                    <button className="primaryBlue mt-5 nunito font-medium text-xl flex-grow flex-shrink-0 ml-2" onClick={createProduct}>Create</button>
                </div>
                </DialogFooter>
            </Dialog>
        </>
    )
}
