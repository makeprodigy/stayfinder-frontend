import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  focusColor?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  icon,
  className = "",
  focusColor = "blue"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const getFocusClasses = () => {
    switch (focusColor) {
      case 'yellow':
        return 'focus-within:ring-yellow-500/20 focus-within:border-yellow-500 group-focus-within:text-yellow-500';
      case 'blue':
        return 'focus-within:ring-blue-500/20 focus-within:border-blue-500 group-focus-within:text-blue-500';
      case 'green':
        return 'focus-within:ring-green-500/20 focus-within:border-green-500 group-focus-within:text-green-500';
      default:
        return 'focus-within:ring-blue-500/20 focus-within:border-blue-500 group-focus-within:text-blue-500';
    }
  };

  return (
    <div ref={dropdownRef} className={`relative group ${className}`}>
      {/* Icon */}
      {icon && (
        <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400">
          {icon}
        </div>
      )}
      
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${icon ? 'pl-8 sm:pl-10' : 'pl-3 sm:pl-4'} pr-8 sm:pr-10 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-sm sm:text-base text-gray-700 placeholder-gray-400 appearance-none cursor-pointer text-left`}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </button>

      {/* Dropdown Arrow */}
      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 sm:pr-3 text-gray-400 ${isOpen ? 'rotate-180' : ''} transition-transform duration-200`}>
        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-gray-700 text-sm sm:text-base ${
                option.value === value ? 'bg-gray-50 font-medium' : ''
              } ${
                index === 0 ? 'rounded-t-md' : ''
              } ${
                index === options.length - 1 ? 'rounded-b-md' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown; 