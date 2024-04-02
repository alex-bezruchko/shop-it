import React, { useState } from 'react';
import axios from 'axios';

function ImageSearch({ addPhoto }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [emptyResult, setEmptyResult] = useState('');
    const handleChange = (event) => {
        setQuery(event.target.value);
        setPage(1);
        setResults([])
    };

    const handleSubmit = async (e, pageNumber) => {
        e.preventDefault();
        setEmptyResult('');
        try {
            const response = await axios.get('/search/photos', {
                params: {
                    query: query,
                    page: pageNumber
                }
            });
            console.log(response)
            setResults(prevResults => [...prevResults, ...response.data.results]);
            if (response.data.results.length === 0) {
                setEmptyResult('No results')
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const handleImageClick = (imageUrl) => {
        addPhoto(imageUrl);
        setResults([]);
    };

    const changePage = (e) => {
        e.preventDefault();
        const nextPage = page + 1; // Calculate the next page locally
        setPage(nextPage); // Update the page state
        handleSubmit(e, nextPage); // Pass the calculated next page to handleSubmit
    };
    
    return (
        <div className="flex flex-col">
            <label htmlFor="search" className="block text-sm font-medium leading-6 text-gray-900">Searched Photo</label>
            <div className="flex items-center mb-3">

                <input 
                    type="text"
                    onChange={handleChange}
                    value={query}
                    name="Search"
                    id="search"
                    placeholder="Search"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"
                />
                <button onClick={handleSubmit} className="text-primaryBlue font-bold ml-2" style={{marginLeft: '-35px'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>
            <div className="flex overflow-x-auto">
                {results.map((result) => (
                    <div key={result.id} className="flex-none">
                        <img
                            src={result.urls.small}
                            alt={result.alt_description}
                            className="cursor-pointer min-w-32 min-h-32 w-32 h-32 object-cover pb-2 pr-2"
                            onClick={() => handleImageClick(result.urls.small)}
                        />
                    </div>
                    
                ))}
                {results && results.length > 0 && (
                    <button onClick={changePage} className="text-primaryGreen ml-4 mb-4 p-1 mt-2 self-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                )}
            </div>
            {emptyResult === 'No results' && (
                <div className='flex'>
                    <p className="nunito 2xl">No results were found</p>
                </div>
            )}
            
        </div>
    );
}

export default ImageSearch;
