import React, { useEffect } from 'react';
import { LogOut } from 'lucide-react';

export const LogoutPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-2">
                <LogOut className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">You have been logged out</h1>
            <p className="text-muted text-sm max-w-xs mx-auto">
                Thank you for using Sentinel. You can safely close this window or sign in again.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-foreground text-background px-6 py-2 rounded-md text-sm font-medium hover:opacity-90"
            >
                Sign In Again
            </button>
        </div>
    );
};
