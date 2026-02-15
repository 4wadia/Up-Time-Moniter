import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full">
            <label className="block text-xs font-medium text-foreground mb-2">
                {label}
            </label>
            <input
                className={`w-full px-3.5 py-3 border rounded-xl text-sm bg-background focus:ring-2 focus:ring-offset-0 focus:outline-none placeholder:text-muted/50 transition-all duration-200
                    ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                        : 'border-border focus:ring-primary/10 focus:border-primary'
                    }
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-xs text-red-500 animate-in slide-in-from-top-1 fade-in duration-200 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
};
