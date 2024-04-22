import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ImageSearch({ addPhoto, photo }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [emptyResult, setEmptyResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1); // Track total available pages
    const [showResults, setShowResults] = useState(false);
    const [queryChanged, setQueryChanged] = useState(false);
    useEffect(() => {
    }, [showResults, queryChanged]); // Log whenever showResults changes
    
    const handleChange = (event) => {
        setQuery(event.target.value);
        setPage(1);
        setQueryChanged(true);
    };

    const handleSubmit = async (e, pageNumber = 1) => {
        e.preventDefault();

        if (!showResults && results.length === 0 || queryChanged) {
            setLoading(true);
            setEmptyResult('');
            try {
                if (pageNumber <= totalPages) {
                    setResults([])
                    const response = await axios.get('/search/photos', {
                        params: {
                            query: query,
                            page: pageNumber
                        }
                    });
                    setShowResults(true)
                    setTotalPages(response.data.total_pages); // Set total pages
                    setResults(prevResults => [...prevResults, ...response.data.results]);
                    setLoading(false);
                    setQueryChanged(false);
                    if (response.data.results.length === 0) {
                        setEmptyResult('No results');
                    }
                } else {
                    setLoading(false);
                    setResults([]);
                    setEmptyResult('No more results');
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching images:', error);
            }
        } else {
            setShowResults(true);
            
            let current = results;
            setResults(current);
        }
            
    };

    const handleImageClick = (imageUrl) => {
        addPhoto(imageUrl);
        setShowResults(false)
        setQueryChanged(false)
    };

    const changePage = async (e) => {
        e.preventDefault();
        const nextPage = page + 1; // Calculate the next page locally
        try {
            const response = await axios.get('/search/photos', {
                params: {
                    query: query,
                    page: nextPage
                }
            });
            setResults(prevResults => [...prevResults, ...response.data.results]); // Append new results
            setPage(nextPage); // Update the page state
            setLoading(false);
            if (response.data.results.length === 0) {
                setEmptyResult('No more results');
            }
            // Scroll the page to show the next image
            window.scrollTo(0, window.scrollY + 100);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching images:', error);
        }
    };
    
    return (
        <div className="flex flex-col">
            <label htmlFor="search" className="flex text-left text-sm nunito font-medium leading-6 text-gray-900">Photo</label>
            <div className="flex items-center mb-1 mt-1">
                <input 
                    type="text"
                    onChange={handleChange}
                    value={query}
                    name="Search"
                    id="search"
                    placeholder="Search"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 nunito py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-secondaryBlue sm:text-sm sm:leading-6"
                />
                <button aria-label="Search icon button" onClick={handleSubmit} className="text-primaryBlue font-bold ml-2" style={{marginLeft: '-35px'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>
            <div className={`flex overflow-x-auto ${!showResults  ? 'h-0' : 'h-auto'}`}>
                {loading ? (
                    <div className='flex mx-auto mt-6 min-h-32 items-center'>
                        <img src="/loading.gif" className='size-10 mx-auto mb-6 self-center'/>
                    </div>
                ) : (
                    <div className='flex mt-4 mb-4'>
                        {showResults && results.map((result) => (
                            <div key={result.id} className="flex-none">
                                <img
                                    src={result.urls.small}
                                    alt={result.alt_description}
                                    className="cursor-pointer min-w-32 min-h-32 w-32 h-32 object-cover pb-0 pr-2"
                                    onClick={() => handleImageClick(result.urls.small)}
                                />
                            </div>     
                        ))}
                        {showResults&& results && results.length > 0 && (
                            <button aria-label="" onClick={changePage} className="text-primaryGreen ml-2 self-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                        )}
                        {emptyResult === 'No results' && (
                            <div className='flex'>
                                <p className="nunito 2xl">No results were found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            
        </div>
    );
}

export default ImageSearch;
