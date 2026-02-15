import React, { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { PageView } from '../../types';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
    currentPage: PageView;
    onNavigate: (page: PageView) => void;
    user?: any; // kept for legacy if needed, but we use context now
    monitors?: any[];
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, monitors = [] }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavigate = (page: PageView) => {
        onNavigate(page);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden h-14 border-b border-border flex items-center justify-between px-4 bg-background sticky top-0 z-30">
                <div className="font-semibold text-foreground">Sentinel</div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-foreground">
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar - Mobile Overlay & Desktop Fixed */}
            <div className={`fixed inset-0 z-20 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 md:relative md:translate-x-0 md:block md:w-64 md:inset-auto`}>
                <Sidebar currentPage={currentPage} onNavigate={handleNavigate} monitors={monitors} />
            </div>

            {/* Overlay Backdrop for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-10 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-auto h-[calc(100vh-56px)] md:h-screen">
                <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
