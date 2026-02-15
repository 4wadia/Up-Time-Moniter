import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [id, onClose]);

    const bgColors = {
        success: 'bg-white border-green-200',
        error: 'bg-white border-red-200',
    };

    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
    };

    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg border-border animate-in slide-in-from-top-2 fade-in duration-300 w-full max-w-sm pointer-events-auto ${bgColors[type]}`}>
            <div className={`shrink-0 ${iconColors[type]}`}>
                {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-sm font-medium text-foreground">
                {message}
            </div>
            <button onClick={() => onClose(id)} className="text-muted hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
