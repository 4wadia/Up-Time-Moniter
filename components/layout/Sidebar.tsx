import React, { useState } from 'react';
import {
    LayoutGrid,
    Activity,
    Files,
    Bell,
    Settings,
    Plus,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    User as UserIcon,
    LogOut
} from 'lucide-react';
import { PageView } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    currentPage: PageView;
    onNavigate: (page: PageView) => void;
    monitors?: any[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, monitors = [] }) => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutGrid, page: 'dashboard' as PageView },
        { id: 'monitors', label: 'Monitors', icon: Activity, page: 'monitors' as PageView },
        { id: 'status-pages', label: 'Status Pages', icon: Files, page: 'status-pages' as PageView },
        { id: 'notifications', label: 'Notifications', icon: Bell, page: 'notifications' as PageView },
        { id: 'settings', label: 'Settings', icon: Settings, page: 'settings' as PageView },
    ];

    return (
        <aside className="w-64 border-r border-border bg-background flex flex-col h-full md:h-screen overflow-y-auto md:sticky md:top-0 py-6 px-5">

            {/* Navigation */}
            <div className="flex-1 space-y-4 overflow-y-auto">
                <div className="text-xs font-semibold text-foreground px-3 mb-3 uppercase tracking-wider">
                    Workspace
                </div>

                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.page)}
                            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all duration-200 ${currentPage === item.page
                                ? 'bg-secondary text-foreground font-semibold shadow-sm'
                                : 'text-gray-600 hover:bg-secondary/50 hover:text-foreground font-medium'
                                }`}
                        >
                            <item.icon className={`w-[18px] h-[18px] ${currentPage === item.page ? 'text-foreground' : 'text-gray-500 group-hover:text-foreground'}`} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Status Pages List */}
                <div className="mt-8">
                    <div className="flex items-center justify-between px-3 mb-3">
                        <span className="text-xs font-medium text-gray-500">Status Pages (0)</span>
                        <Plus className="w-3 h-3 text-gray-400 cursor-pointer hover:text-foreground transition-colors" />
                    </div>
                    <div className="px-3.5 text-sm text-gray-500 font-normal">
                        No status pages found
                    </div>
                </div>

                {/* Monitors List */}
                <div className="mt-6">
                    <div className="flex items-center justify-between px-3 mb-3">
                        <span className="text-xs font-medium text-gray-500">Monitors ({monitors.length})</span>
                        <Plus className="w-3 h-3 text-gray-400 cursor-pointer hover:text-foreground transition-colors" />
                    </div>
                    {monitors.length > 0 ? (
                        <div className="space-y-1">
                            {monitors.map((monitor, index) => (
                                <button
                                    key={index}
                                    onClick={() => onNavigate('monitors')}
                                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-secondary/50 hover:text-foreground transition-all group"
                                >
                                    <div className="truncate">{monitor.name}</div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-3.5 text-sm text-gray-500 font-normal">
                            No monitors found
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 mt-auto border-t border-border/50 relative">
                <button className="flex items-center gap-3 px-3.5 py-2 text-sm text-gray-600 hover:text-foreground font-medium mb-2 transition-colors w-full rounded-xl hover:bg-secondary/50">
                    <HelpCircle className="w-[18px] h-[18px]" /> Get Help
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && user && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                        <div className="absolute bottom-20 left-0 w-60 bg-background border border-border rounded-2xl shadow-lg z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 mx-2">
                            <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold border border-purple-100 shrink-0">
                                    {user.initials}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                </div>
                            </div>
                            <div className="p-1">
                                <button
                                    onClick={() => { onNavigate('account'); setIsDropdownOpen(false); }}
                                    className="w-full text-left px-3 py-2.5 text-sm text-foreground hover:bg-secondary font-medium rounded-xl flex items-center gap-3 transition-colors"
                                >
                                    <UserIcon className="w-[18px] h-[18px] text-gray-500" /> Account
                                </button>
                                <button
                                    onClick={() => { logout(); setIsDropdownOpen(false); }}
                                    className="w-full text-left px-3 py-2.5 text-sm text-foreground hover:bg-secondary font-medium rounded-xl flex items-center gap-3 transition-colors"
                                >
                                    <LogOut className="w-[18px] h-[18px] text-gray-500" /> Log out
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {user ? (
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-3 w-full text-left hover:bg-secondary/50 px-3.5 py-3 rounded-xl transition-all duration-200 ${isDropdownOpen ? 'bg-secondary/50' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 font-bold border border-purple-100 shadow-sm">
                            {user.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                        {isDropdownOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                ) : (
                    <button
                        onClick={() => onNavigate('signin')}
                        className="flex items-center gap-3 w-full text-left hover:bg-secondary/50 px-3.5 py-3 rounded-xl transition-all duration-200"
                    >
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground font-bold border border-border">
                            <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-foreground">Sign In</div>
                        </div>
                    </button>
                )}
            </div>
        </aside>
    );
};
