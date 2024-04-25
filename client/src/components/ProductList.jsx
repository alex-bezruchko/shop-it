import ProductsDialog from './ProductsDialog';
import placeholderImg from "../../public/placeholder.png"; // Import the placeholder image
import React, { useEffect, useCallback, useState } from 'react';

const ProductList = ({ products, addToList, currentList, noHeader, handleUpdateProducts, deleteProduct }) => {
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    // Access the image elements by their IDs and update the src attribute if loadedImages state is true
    for (const photoUrl in loadedImages) {
        if (loadedImages[photoUrl] && photoUrl !== placeholderImg) {
            const imgElement = document.getElementById(photoUrl);
            if (imgElement && imgElement.src !== photoUrl) {
                imgElement.src = `${photoUrl}?fit=crop&h=125&w=125&crop=entropy&q=80`;
            }
        }
    }
}, [loadedImages]);

 // Memoized onLoad handler
 const handleImageLoad = useCallback((photoUrl) => {
  return () => {
      // Set the flag to true when the image is loaded
      setLoadedImages(prevState => ({
          ...prevState,
          [photoUrl]: true
      }));
  };
}, [setLoadedImages]);

  const handleAddToList = (product) => {
    if (!currentList.products || !Array.isArray(currentList.products) || currentList.products.length === 0) {
        addToList(product);
        return;
    }

    const firstProduct = currentList.products[0];
    if (firstProduct._id !== undefined && firstProduct.product === undefined) {
        // If products property contains objects with _id property directly
        const isDuplicateWithDirectId = currentList.products.some(item => item._id === product._id);
        if (isDuplicateWithDirectId) {
            deleteProduct(product._id);
        } else {
            // Assuming addToList function adds the product to the list
            addToList(product);
        }
    } else if (firstProduct.product && firstProduct.product._id !== undefined) {
        // If products property contains objects with _id property nested within another object
        const isDuplicateWithNestedId = currentList.products.some(item => item.product._id === product._id);
        if (isDuplicateWithNestedId) {
            deleteProduct(product._id);
        } else {
            // Assuming addToList function adds the product to the list
            addToList(product);
        }
    } else {
      console.log('')
    }
  }

  async function updateProduct(product) {
    handleUpdateProducts(product)
  }

  // Check if products exist and is an array before rendering
  if (!Array.isArray(products.products) || products.products.length === 0) {
    return <div></div>;
  }
  const isProductAdded = (product) => {

    if (!currentList.products || !Array.isArray(currentList.products) || currentList.products.length === 0) {
        // If no products are found in the current list, return false
        return false;
    }

    const firstProduct = currentList.products[0];
    if (firstProduct._id !== undefined && firstProduct.product === undefined) {
        return currentList.products.some(item => item._id === product._id);
    } else if (firstProduct.product && firstProduct.product._id !== undefined) {
        return currentList.products.some(item => item.product._id === product._id);
    } else {
        return false;
    }
  }

  return (
    <div className='flex w-full mt-3'>
      {noHeader === false && (<h2>Product List</h2>)}

      {products.products.length === 0 ? (
        <div></div>
      ) : (
        <ul className='w-full'>
          {products.products.map(product => (
              <li key={product._id} className="flex w-full justify-between">
                <div className={`flex items-center w-full justify-between bg-white rounded-lg shadow-lg p-0 md:p-0 mb-4 border border-2 ${isProductAdded(product) ? 'border-primaryGray' : 'border-primaryGreen'}`}>
                  <div className="w-full flex justify-between mt-0 h-full">
                    <div className="flex items-center w-full justify-between">
                      <div className="mr-4 flex flex-col justify-between h-full">
                          <h3 className="pl-2 pt-2 text-left text-lg font-medium lora self-start">{product.name}</h3>
                          <div className="pl-2 pb-2 pt-0">
                              <p className="text-left text-md lora">${product.price}</p>
                          </div>
                      </div>
                    </div>
                    <div className="flex items-end pb-3">
                      <ProductsDialog 
                        className="h-full flex items-center" 
                        product={product} 
                        handleDeleteProduct={deleteProduct} 
                        handleUpdateProducts={updateProduct}
                      />
                      </div>
                  </div>
                  
                  {product.photo !== '' && product.photo !== 'placeholder.png' ? (
                      <img
                          src={loadedImages[product.photo] ? `${product.photo}?fit=crop&h=125&w=125&crop=entropy&q=80` : placeholderImg}
                          onLoad={handleImageLoad(product.photo)}
                          id={product.photo}
                          alt={`Photo for ${product.name}`}
                          className="cursor-pointer mr-0 max-h-[95px] min-h-[95px] min-w-[95px] max-w-[95px] sm:max-h-[250px] sm:min-h-[250px] sm:min-w-[250px] sm:max-w-[250px] rounded-r-md"
                          width="95"
                          height="95"
                      />
                      ) : (
                        <img 
                            src={placeholderImg}
                            alt="Placeholder Image"
                            className="cursor-pointer mr-0 max-h-[95px] min-h-[95px] min-w-[95px] max-w-[95px] sm:max-h-[250px] sm:min-h-[250px] sm:min-w-[250px] sm:max-w-[250px] pr-0 rounded-r-md"
                            width="95"
                            height="95"
                        />
                    )}
                </div>
                <button aria-label="Add to List button" onClick={() => handleAddToList(product)} className={`text-primaryGreen ml-2 focus:outline-none ${isProductAdded(product) ? 'text-primaryGray' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={`${isProductAdded(product) ? '#C7C8CC' : '#6CB462'}`} className="w-7 h-7">
                      <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                    </svg>
                  </button>
              </li>
          ))}
        </ul>
      )}
      
    </div>
  );
};

export default ProductList;