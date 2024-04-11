import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from "./CustomSelect";
import ImageSearch from "./ImageSearch";
import FileUpload from './FileUpload';
import { Validation } from './Validation';
import ValidationErrorDisplay from "./../components/ValidationErrors";

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
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [height, setHeight] = useState('full');
    const validationDivRef = useRef(null);


    const handleOpen = () => setOpen(!open);

    useEffect(() => {
        axios.get(`/categories`)
            .then(({ data }) => {
                let options = data.map(item => ({ _id: item._id, name: item.name }));
                setCategories(options);
            })
            .catch(error => {
                console.log(error);
            });
        updateHeight(); // Initial height calculation

        const handleResize = () => {
        updateHeight(); // Recalculate height on screen resize
        };
        if (validationDivRef.current) {
            validationDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [errors, height]);

    async function createProduct(e) {
        e.preventDefault();
        setLoading(true);
        setErrors(false);
        
        let body = {
            name,
            category,
            description,
            price,
        }

        const validationErrors = Validation(body);
        if (validationErrors.length > 0) {
            // Handle validation errors here
            setErrors(validationErrors)
            setLoading(false);
            const errorHeight = validationDivRef.current.offsetHeight || '';
            let currentHeight = height + errorHeight;
            setHeight(currentHeight);
        } else {
            setErrors([])
            body.photo = photo;
                try  {
                const { data } = await axios.post(`/products`, body);
                dispatch({ type: 'ADD_PRODUCT', payload: data });
                clearForm();
                setLoading(false);
                setOpen(false);
                dispatch({ type: 'SET_ALERT', payload: {message: 'Product created successfully', alertType: 'primaryGreen'} });

            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
        setLoading(false);
    }

    function clearForm() {
        setName('');
        setDescription('');
        setCategory('');
        setPhoto('');
        setPrice('');
    }

    function handleImageSelect(selectedPhoto) {
        setPhoto(selectedPhoto);
    }
    
    function removePhoto() {
        setPhoto('');
    }

    const updateHeight = () => {
        if (validationDivRef) {
            // const errorHeight = validationDivRef.current ? validationDivRef.current.offsetHeight : 0;
            const screenHeight = window.innerHeight;
            setHeight(screenHeight);
        } else {
            setHeight('full')
        }
    };

    return (
        <>
            <button onClick={handleOpen} className="bg-primaryBlue text-white p-1 rounded-full px-3 flex h-full items-center justify-between">
                <p className="nunito text-lg pr-2">Add</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            </button>
            <Dialog open={open} handler={handleOpen} className={`pt-0 flex flex-col overflow-y-auto mx-5`}  style={{ height: `calc(100vh - 50px)` }}>
                <DialogBody className={`flex flex-col pt-0 overflow-y-auto justify-between`} style={{ maxHeight: `${height - 50}px`, marginTop: "0", marginBottom: "0" }}>
                    <div className="flex flex-col">
                        <h2 className="lora text-3xl pb-0 sm:pb-5 text-black text-center pt-5 font-normal mb-4">New Product</h2>
                            <div ref={validationDivRef} className="mx-0">
                            
                                {errors.length > 0 && (
                                    <ValidationErrorDisplay errors={errors}/>
                                )}
                            </div>
                    </div>
                        <div className="mt-0 grid grid-cols-1 gap-y-2 sm:gap-x-6 sm:gap-y-6 grid-cols-1 overflow-y-auto">
                            <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-sm nunito font-medium leading-6 text-gray-900">Name</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        id="name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <span className="block text-sm nunito font-medium leading-6 text-gray-900 pb-0">Category</span>

                                {categories.length > 0 && (
                                    <CustomSelect handleSelect={setCategory} options={categories}/>
                                )}
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="description" className="block text-sm nunito font-medium leading-6 text-gray-900">Description</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="description"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        id="description"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <ImageSearch addPhoto={handleImageSelect} />
                            </div>
                            <div className="sm:col-span-3 flex justify-between">
                                                            
                                <div className="flex items-center justify-between w-full">
                                    {photo && (        
                                    
                                        <div className="flex items-center border-r w-1/2">
                                            <img src={photo} alt="Selected" className="m-0 h-20 w-20 sm:w-40 sm:h-40" />
                                            <button onClick={removePhoto} className="text-primaryRed mt-2 mx-auto text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 ml-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className={`w-${photo ? '1/2' : 'full'} flex flex-col h-full justify-left`}>
                                        <FileUpload setFile={handleImageSelect} />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="price" className="block text-sm nunito font-medium leading-6 text-gray-900 mt-5">Price</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="price"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        id="price"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md nunito border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>

                </DialogBody>
                <DialogFooter>
                    <div className="flex justify-end">
                        <button className="primaryOrange mt-0 nunito font-medium text-sm md:text-xl flex-grow" onClick={handleOpen}>Cancel</button>
                        {loading ? (
                            <button className="primaryBlue mt-0 nunito font-medium text-sm  px-4 sm:text-lg  flex-grow flex-shrink-0 ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="white text-white w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                        ): (
                            <button className="primaryBlue mt-0 nunito font-medium text-sm md:text-xl flex-grow flex-shrink-0 ml-2" onClick={createProduct}>Create</button>
                        )}
                    </div>
                </DialogFooter>
            </Dialog>
        </>
    );
}
