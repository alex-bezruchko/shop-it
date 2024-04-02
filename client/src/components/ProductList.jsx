import React from 'react';
import ProductForm from './ProductForm';

const ProductList = ({ products, addToList, noHeader, handleUpdateProducts, deleteProduct }) => {

  const handleAddToList = (product) => {
    addToList(product);
  }

  async function updateProduct(product) {
    handleUpdateProducts(product)
  }

  const handleDeleteProduct = (product) => {
    deleteProduct(product)
  }
  // Check if products exist and is an array before rendering
  if (!Array.isArray(products.products) || products.products.length === 0) {
    return <div></div>;
  }
  return (
    <div className="w-full mt-3">
      {noHeader === false && (<h2>Product List</h2>)}
      <ul>
        {products.products.map(product => (
            <div key={product._id} className="flex w-full justify-between">
              <div className="flex items-center w-full justify-between bg-white rounded-lg shadow-md p-2 md:p-3 mb-4 border-2 border-primaryBlue">
                <div className="w-full flex justify-between mt-0">
                  <div className="flex items-center w-full justify-between">
                      <div className="mr-4 flex flex-col justify-between">
                      
                          <h3 className="text-left text-lg font-medium lora self-start">{product.name}</h3>
                          <div className="pt-3">
                              <p className="text-left text-sm nunito">{product.description}</p>
                              <p className="text-left text-sm nunito">${product.price}</p>
                          </div>
                      </div>
                  </div>
                  <div className="flex">
                    <ProductForm 
                      className="self-center" 
                      product={product} 
                      handleDeleteProduct={deleteProduct} 
                      updateProduct={updateProduct}
                    />
                    </div>
                </div>
                
                {product.photo && (
                    <img src={product.photo} alt="Product Photo" className="listProduct mr-1"/>)
                }

                {product.photo == ''  && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"  className="min-w-32 min-h-32 w-32 h-32 pr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                )}
              </div>
              <div onClick={() => handleAddToList(product)} className='text-primaryGreen ml-4 mb-4 p-1 self-center'>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
            </div>
         
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
