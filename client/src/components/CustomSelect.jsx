import React, { useState, useEffect } from 'react';

function CustomSelect({ options, handleSelect, selectedOption: externalSelectedOption }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (externalSelectedOption && externalSelectedOption) {
      setSelectedOption(externalSelectedOption);
    }
  }, [externalSelectedOption]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option._id);
    setIsOpen(false);
    handleSelect(option._id);
  };

  return (
    <div className="relative mt-2 mb-1">
      <button
        onClick={toggleDropdown}
        type="button"
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left flex items-center justify-between"
      >
        <span className="text-left truncate text-black nunito text-sm">{selectedOption ? options.find(opt => opt._id === selectedOption)?.name : 'Select an option'}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 12l-3-3-2 2 5 5 5-5-2-2-3 3z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full py-1 mt-1 bg-white border border-gray-300 rounded-md shadow-sm">
          {options.map((option) => (
            <li key={option._id}>
              <button
                onClick={() => handleOptionClick(option)}
                className={`block w-full nunito px-4 py-2 text-left ${selectedOption === option._id ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
