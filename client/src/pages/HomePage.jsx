import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import placeholderImg from "../../public/placeholder.png"; // Import the placeholder image

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    // Fetch products from the API
    axios.get('https://shop-api.alex-bezruchko.com/products/all')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Memoized onLoad handler for images
  const handleImageLoad = useCallback((photoUrl) => {
    return () => {
      setLoadedImages(prevState => ({
        ...prevState,
        [photoUrl]: true
      }));
    };
  }, [setLoadedImages]);

  return (
    <div className="container flex flex-col w-full md:w-2/3 mx-auto items-center">
      <div className="flex justify-between items-center mt-10 mb-3">
      <h1 className="text-xl lora font-medium mb-0 flex flex-col items-center">
        <span className="flex items-center">
          Shopit app 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0fa3b1" className="w-8 h-8 text-primaryBlue ml-2">
            <path stroke="white" fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd"></path>
          </svg>
        </span>
        <span className='font-light mt-1'>Your one-stop social shopping list app</span>
      </h1>
      </div>
      {/* <div>
        <h1 className="text-lg nunito font-medium mb-4"></h1>
      </div> */}
      <h1 className="text-lg sm:text-3xl lora font-medium my-4">Latest products from other users</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {products.map(product => (
          product.name !== '' && (
            <div key={product._id} className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-end mb-1">
                <h2 className="text-sm sm:text-lg lora font-md mb-0 sm:mb-2">{product.name}</h2>
                <p className="text-xs sm:text-lg nunito font-semibold text-black">${product.price}</p>
              </div>
              {product.photo ? (
                <img
                  src={loadedImages[product.photo] ? `${product.photo}?fit=crop&h=150&w=150&crop=entropy&q=80` : placeholderImg}
                  alt={product.name}
                  onLoad={handleImageLoad(product.photo)}
                  className="cursor-pointer mr-0 max-h-[95px] min-h-[95px] min-w-[100%] max-w-[100%] sm:max-h-[200px] sm:min-h-[200px] sm:min-w-[200px] sm:max-w-[200px] rounded-r-md"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 mt-2 rounded-md"></div>
              )}
            </div>
          )
        ))}
      </div>
    </div>



  );
};

export default HomePage;
