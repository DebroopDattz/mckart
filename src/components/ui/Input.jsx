import React from 'react';

const Input = ({ label, error, className = "", ...props }) => {
    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-gray-200 ml-1">{label}</label>}
            <input
                className={`glass-input ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
        </div>
    );
};

export default Input;
