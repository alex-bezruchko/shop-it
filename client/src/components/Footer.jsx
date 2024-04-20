import React, { useState, useEffect } from 'react';

function Footer() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []); // This effect runs only once after the component mounts

    return (
        
        <div className="">
            <div className="flex justify-center items-center my-4">
                <p className="nunito text-md">Shopit &copy; {currentYear}</p> {/* Display current year */}
            </div>
        </div>
    );
}

export default Footer;
