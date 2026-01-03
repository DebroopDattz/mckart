import React from 'react';

const Button = ({ children, variant = "primary", className = "", isLoading, ...props }) => {
    const baseStyles = "relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border border-white/10",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
        danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30",
        success: "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : children}
        </button>
    );
};

export default Button;
