import React from 'react';

const Card = ({ children, className = "", onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`glass rounded-3xl p-6 ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
