import React, { useState, useCallback } from "react";
import placeholderImg from "../../public/placeholder.png"; // Import the placeholder image

export default function ImageWithPlaceholder({ imageUrl }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    // Memoize the onLoad function using useCallback
    const onLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    const handleImageError = () => {
        // Update the state to indicate that the image failed to load
        setImageLoaded(false);
    };

    return (
        <>
            <img 
                src={imageUrl || placeholderImg} 
                alt="Actual Image" 
                onLoad={onLoad} 
                onError={handleImageError}
                className={imageLoaded ? "cursor-pointer mr-0 max-h-[95px] min-h-[95px] min-w-[95px] max-w-[95px] sm:max-h-[250px] sm:min-h-[250px] sm:min-w-[250px] sm:max-w-[250px] pr-0 rounded-r-md" : ''}
            />
            {!imageLoaded && <img src={placeholderImg} alt="Placeholder Image" className="cursor-pointer mr-0 max-h-[95px] min-h-[95px] min-w-[95px] max-w-[95px] sm:max-h-[250px] sm:min-h-[250px] sm:min-w-[250px] sm:max-w-[250px] pr-0 rounded-r-md" />}
        </>
    );
}

<img src={placeholderImg} alt="Placeholder Image" />
