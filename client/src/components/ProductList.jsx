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
    console.log('product', product)
    deleteProduct(product)
  }
  // Check if products exist and is an array before rendering
  if (!Array.isArray(products.products) || products.products.length === 0) {
    return <div></div>;
  }

  return (
    <div className="w-full">
      {noHeader === false && (<h2>Product List</h2>)}
      <ul>
        {products.products.map(product => (
          <div key={product._id} className="flex items-center justify-between bg-white rounded-lg shadow-md p-3 mb-4">
            <div className="flex items-center w-full justify-between">
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
                  <img src={product.photo} alt="Product Photo" className="min-w-32 min-h-32 w-32 h-32 mr-4"/>)
              }

              {product.photo == ''  && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"  className="min-w-32 min-h-32 w-32 h-32 pr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
              )}
            </div>
            
            <div onClick={() => handleAddToList(product)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
