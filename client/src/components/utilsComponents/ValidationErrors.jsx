import React, { useEffect, useRef } from 'react';

const ValidationErrorDisplay = ({ errors }) => {
  const topErrorRef = useRef(null);

  useEffect(() => {
    // Scroll to the top error div when new errors are added
    if (topErrorRef.current) {
      topErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [errors]);

  return (
    <div className="flex flex-col w-full mb-3">
      {errors.map((error, index) => (
        <div
          key={error.field}
          ref={index === 0 ? topErrorRef : null}
          className={`text-left flex justify-start mt-0 ${index === errors.length - 1 ? 'mb-0' : 'mb-6'} mx-0 p-2 py-1.5 sm:p-3 rounded border border-[1.5px] border-primaryRed bg-lightRed text-black`}
        >
          <span className="self-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </span>
          <p className="px-4 nunito text-sm self-center">{error.message}</p>
        </div>
      ))}
    </div>
  );
};

export default ValidationErrorDisplay;
