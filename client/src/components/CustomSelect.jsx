import React, { useState } from 'react';

function CustomSelect({ options, handleSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    handleSelect(option)
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        type="button"
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left flex items-center justify-between"
      >
        <span className="block truncate">{selectedOption ? selectedOption.name : 'Select an option'}</span>
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
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
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
