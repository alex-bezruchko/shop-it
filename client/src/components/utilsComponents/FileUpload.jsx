import axios from "axios";
import React, { useEffect, useState } from "react";

export default function FileUpload({ setFile, photo }) {
    const preset_key = "te8akgdc";
    const [image, setImage] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (photo) {
            setImage(photo);
            const fileInput = document.getElementById('hello123');
            if (!fileInput.files || fileInput.files.length === 0) {
                setIsDisabled(true);
            } else {
                setIsDisabled(false);
            }
        } else {
            const fileInput = document.getElementById('hello123');

            if (!fileInput.files || fileInput.files.length === 0) {
                setIsDisabled(true);
                setImage('');
            } else {
                setIsDisabled(false);
            }
        }
    }, [photo]);

    function handleFile(e) {
        e.preventDefault();
        setIsDisabled(true);
        setLoading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', preset_key);
        axios.post(`${import.meta.env.VITE_CLOUDINARY_API}/${import.meta.env.VITE_CLOUDINARY_CLOUD}/image/upload`, formData, {withCredentials: false})
            .then(res => {
                setImage(res.data.secure_url);
                setUploadedImageUrl(res.data.secure_url)
                setLoading(false);
                setIsDisabled(false);
            })
            .catch(err => {
                console.log(err)
                setIsDisabled(true);
                setLoading(false);
            })
    }

    function chooseFile(e) {
        e.preventDefault();
        const fileInput = document.getElementById('hello123');
            if (!fileInput.files || fileInput.files.length === 0) {
                setIsDisabled(true);
            } else {
                setFile(uploadedImageUrl)
                setIsDisabled(false);
            }
    }

    function clearFile(e) {
        e.preventDefault();
        const fileInput = document.getElementById('hello123');
        fileInput.type = '';
        fileInput.type = 'file';
        setUploadedImageUrl('');
        setIsDisabled(true);
    }

    return (
        <div className="h-full">
            <div className="flex items-left mt-2 justify-left h-full">

                {image === '' || photo === '' ? (
                    <div className="flex flex justify-around w-full items-start">
                        <input id="hello123" type="file" className="items-center mr-0 py-1 pl-0 text-xs w-1/2" onChange={handleFile}/>
                        
                        <div className="flex justify-between items-center">
                            <button aria-label="Choose File with text and loading gif display" disabled={isDisabled} onClick={chooseFile} className={`flex items-center text-white font-md py-1 px-1.5 ml-0 rounded ${isDisabled ? 'bg-primaryGray' : 'bg-primaryBlue'}`}>
                                <p className="nunito px-1 py-0 text-sm">Select</p>
                                {loading ? (
                                    <div className="flex mt-0">
                                        <img src="/loading.gif" className='w-4 mx-auto '/>
                                    </div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 pl-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>
                                )}
                            </button>
                           
                        </div>
                        <button aria-label="Clear File button" onClick={clearFile} disabled={isDisabled} className="flex text-primaryRed mx-0 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"  className="w-6 h-6 sm:w-10 sm:h-10 ml-1 mt-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                </svg>
                            </button>
                    </div>
                ) : (
                    <div className="flex flex-col justify-around w-full">
                        <input id="hello123" type="file" className="mr-2 py-2 pl-3 text-xs" onChange={handleFile}/>
                        <div className="flex">
                            <button aria-label="Select image button with loading gif" disabled={isDisabled} onClick={chooseFile} className={`flex mt-4 text-white font-md py-1 px-1.5 ml-3 rounded items-center ${isDisabled ? 'bg-primaryGray' : 'bg-primaryBlue'}`}>
                                <p className="nunito px-1 py-0 text-sm">Select</p>
                                {loading ? (
                                    <div className="flex mt-0">
                                        <img src="/loading.gif" className='w-4 mx-auto '/>
                                    </div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 pl-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>
                                )}
                            </button>
                            <button aria-label="Clear File button" onClick={clearFile} disabled={isDisabled} className="flex text-primaryRed ml-0 text-center items-end mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"  className="w-6 h-6 sm:w-10 sm:h-10 ml-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                        </div>
                    </div>
                )}
               
            </div>
        </div>
    )
}
