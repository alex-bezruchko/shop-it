import React from 'react';

const ProductList = ({ products }) => {
  console.log("Products array:", products.products);

  // Check if products exist and is an array before rendering
  if (!Array.isArray(products.products) || products.products.length === 0) {
    return <div>No products</div>;
  }

  return (
    <div className="w-full">
      <h2>Product List</h2>
      <ul>
        {products.products.map(product => (
          <div key={product._id} className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center w-full justify-between">
              <div className="mr-4">
                <h3 className="text-left text-lg font-semibold">{product.name}</h3>
                <p className="text-left text-sm">{product.description}</p>
                <p className="text-left text-sm">{product.price}</p>
              </div>
              <img src={product.photo} alt="Product Photo" className="w-24 h-auto pr-4"/>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
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
