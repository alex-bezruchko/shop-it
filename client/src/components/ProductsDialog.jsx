import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import CustomSelect from "./CustomSelect";
import ImageSearch from "./ImageSearch";
import FileUpload from './FileUpload';
import { Validation } from './Validation';
import ValidationErrorDisplay from "./../components/ValidationErrors";

  export default function ProductsDialog({product, handleUpdateProducts}) {
    
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formType, setFormType] = useState('create')

    const validationDivRef = useRef(null);

    const handleOpen = () => {
        if (!open) {
            if (product) {
                let {name, category, description, photo, price } = product;

                setId(product._id || '');
                setName(name || '');
                setCategory(category || '');
                setDescription(description || '');
                setPhoto(photo || '');
                setPrice(price || '');
                setFormType('edit')
                setPhoto(product.photo || null)
                setErrors([]);

            } else {
                setFormType('create')
            }
            setOpen(true);
        } else {
            setOpen(false);
            setErrors([]);
        }
    };

    useEffect(() => {
        axios.get(`/categories`)
            .then(({ data }) => {
                let options = data.map(item => ({ _id: item._id, name: item.name }));
                setCategories(options);
            })
            .catch(error => {
                console.log(error);
            });

        if (product) {
            setFormType('edit')            
        } else {
            setFormType('create')
        }
    }, [errors, product]);

    async function createProduct(e) {
        e.preventDefault();
        setLoading(true);
        setErrors(false);
        
        let body = {
            name,
            category,
            price,
        }

        const validationErrors = Validation(body);
        if (validationErrors.length > 0) {
            // Handle validation errors here
            setErrors(validationErrors)
            setLoading(false);
            if (validationDivRef.current) {
                validationDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

        } else {
            setErrors([])
            body.photo = photo;
            body.description = description;
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

    async function editProduct(e) {
        e.preventDefault();
        setLoading(true);
        setErrors(false);
        let body = {
            name,
            category,
            price,
        }

        const validationErrors = Validation(body);
        console.log(validationErrors)
        if (validationErrors.length > 0) {
            // Handle validation errors here
            setErrors(validationErrors)
            setLoading(false);
            if (validationDivRef.current) {
                validationDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

        } else {
            setErrors([]);
            body.description = description;
            body.photo = photo;
            try {
                const response = await axios.put(`/products/${id}`, body);
                dispatch({ type: 'SET_ALERT', payload: {message: 'Product updated successfully', alertType: 'primaryGreen'} });
                setLoading(false);
                body.id = id;
                body.photo = photo;
                handleUpdateProducts(body)
                setOpen(false);
            } catch (error) {
                setLoading(false);
                console.error('Error updating shopping list name:', error);
            }
        }
       
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

    function handleCategory (name) {
        setCategory(name);
        setFormData(prev => {
            return {...prev, category: name };
        })
    }

    return (
        <>
            {formType === 'create' && (
                <button aria-label="Open Create Product Form button" onClick={handleOpen} className="bg-white text-primaryBlue p-1 rounded-full px-3 flex h-full items-center justify-between">
                    <p className="nunito text-[#0f858f] text-md pr-2 self-center">Add</p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0fa3b1" className="w-6 h-6">
                        <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
            {formType === 'edit' && (
                <button aria-label="Open Edit Product Form button" onClick={() => handleOpen(product)} className="text-primaryOrange p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8 self-center">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </button>
            )}

            {open && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-sm overflow-y-auto p-0 flex justify-between" style={{ width: '90%', height: '100%', maxHeight: '95%' }}>

                        <div className="mx-auto overflow-y-scroll w-full">
                            <div className="flex flex-col mb-3">
                                <div className="mx-0">
                                
                                    {errors.length > 0 && (
                                        <ValidationErrorDisplay errors={errors}/>
                                    )}
                                </div>
                            </div>
                            <h2 className="text-center flex items-center justify-center w-full primaryBlue mt-0 lora text-3xl md:text-xl" onClick={formType === 'create' ? createProduct : editProduct}>{formType === 'create' ? 'New Product' : 'Edit Product'}</h2>
                            
                            <div className="mb-2 flex flex-col">
                                <label htmlFor="name" className="w-full text-left text-sm nunito font-medium leading-6 text-gray-900">Name</label>
                                <div className="w-full mt-1">
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
                            <div className="mb-2">
                                <span className="flex text-left text-sm nunito font-medium leading-6 text-gray-900 pb-0">Category</span>

                                {categories.length > 0 && (
                                    <CustomSelect 
                                        selectedOption={category} 
                                        handleSelect={setCategory} 
                                        options={categories}
                                    />
                                )}
                            </div>
                            <div className="mb-2">
                                <label htmlFor="description" className="flex text-left text-sm nunito font-medium leading-6 text-gray-900">Description</label>
                                <div className="mt-1">
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
                            <div className="mb-0">
                                <ImageSearch addPhoto={handleImageSelect} ifPhoto={photo} />
                            </div>
                            <div className="mt-1 mb-2 flex justify-between">
                                                            
                                <div className="flex items-center justify-between w-full mt-2">
                                    {photo && (        
                                    
                                        <div className="flex items-center justify-between border-r w-1/2">
                                            <img src={photo} alt="Selected" className="m-0 h-[7rem] w-[7rem] sm:w-40 sm:h-40" />
                                            <button aria-label="Remove photo button" onClick={removePhoto} className="text-primaryRed mt-2 mx-auto text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 sm:w-10 sm:h-10">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className={`w-${photo ? '1/2' : 'full'} flex flex-col h-full justify-left`}>
                                        <FileUpload setFile={handleImageSelect} photo={photo}/>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 pb-2">
                                <label htmlFor="price" className="flex text-left text-sm nunito font-medium leading-6 text-gray-900 mt-0">Price</label>
                                <div className="mt-1">
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
                            <div className="sm:col-span-3 pb-0">
                                <div className="flex justify-end">
                                    <button aria-label="Close Product Form button" className="primaryOrange mt-0 nunito font-medium text-sm md:text-xl" onClick={handleOpen}>Cancel</button>
                                    { loading ? (
                                        <button aria-label="Loadgin gif" className="primaryBlue mt-0 nunito font-medium text-sm  px-4 sm:text-lg  flex-shrink-0 ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="white text-white w-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button aria-label="Product Form Action button" className="bg-primaryBlue mt-0 nunito font-medium text-white px-4 rounded text-sm md:text-xl flex-shrink-0 ml-2 mr-0" onClick={formType === 'create' ? createProduct : editProduct}>{formType === 'create' ? 'Create' : 'Edit'}</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            )}
        </>
    );
}
