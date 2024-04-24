import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeholderImg from "../../public/placeholder.png"; // Import the placeholder image

export default function MyImage ({ image, updateImageCount, classStyle }) {

  function handleOnLoad() {
    console.log('image', image);
    updateImageCount(image.index)
  }
  function handleError() {
    console.log('image', image);
    updateImageCount(image.index)
  }

  if (image.src === '') {
    // If image.src is empty, render a placeholder or any fallback content
    return (
      <div>
        {/* You can render any fallback content here */}
        <img 
          src={placeholderImg} 
          onLoad={handleOnLoad}
          alt="Placeholder Image" 
          className={classStyle} 
          style={{ height: image.height, width: image.width }}
        />
      </div>
    );
  }

  return (
    <div>
      <LazyLoadImage
        onLoad={handleOnLoad}
        onError={handleError}
        index={image.index}
        className={classStyle}
        alt={`${image}image.alt`}
        height={image.height}
        src={image.src}
        width={image.width}
        placeholder={image.placeholderImg}
        />
      
    </div>
  )
}