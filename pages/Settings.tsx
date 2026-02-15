import React from 'react';
import { ChevronRight, Settings as SettingsIcon, Lock, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
    const { user } = useAuth();
    // Default fallback if user is null (shouldn't happen on protected route)
    const displayName = user?.name || 'User';
    const displayEmail = user?.email || 'user@example.com';
    const displayInitials = user?.initials || 'U';

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted mb-6">
                <SettingsIcon className="w-4 h-4" />
                <ChevronRight className="w-4 h-4" />
                <span>Settings</span>
                <ChevronRight className="w-4 h-4" />
                <span className="bg-background border border-border px-2 py-0.5 rounded text-foreground font-medium shadow-sm">General</span>
                <ChevronRight className="w-4 h-4" />
            </div>

            <div className="mb-8">
                <h1 className="text-xl font-semibold text-foreground">General</h1>
                <p className="text-sm text-muted">Manage your workspace settings.</p>
            </div>

            {/* Workspace Section */}
            <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50">
                    <h2 className="text-sm font-semibold text-foreground">Workspace</h2>
                    <p className="text-xs text-muted mt-1">Manage your workspace name.</p>

                    <div className="mt-4">
                        <label className="block text-xs font-medium text-foreground mb-1.5">Name</label>
                        <input type="text" className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-gray-400" defaultValue="My Workspace" />
                    </div>
                </div>
                <div className="px-6 py-3 bg-secondary/30 flex justify-end">
                    <button className="bg-foreground text-background px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90">
                        Submit
                    </button>
                </div>
            </div>

            {/* Slug Section */}
            <div className="bg-background border border-border rounded-xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-foreground">Slug</h2>
                <p className="text-xs text-muted mt-1">The unique slug for your workspace.</p>

                <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center border border-border rounded-xl px-3.5 py-2.5 bg-secondary/20 text-sm font-medium">
                        my-workspace
                        <span className="ml-2 cursor-pointer text-muted hover:text-foreground">❐</span>
                    </div>
                </div>
                <p className="text-xs text-muted mt-4">
                    Used when interacting with the API or for help on Discord. <span className="text-foreground font-medium">Let us know</span> if you'd like to change it.
                </p>
            </div>

            {/* Team Section */}
            <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                    <h2 className="text-sm font-semibold text-foreground">Team</h2>
                    <p className="text-xs text-muted mt-1 mb-4">Manage your team members.</p>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 mb-6 border-b border-border">
                        <button className="px-3 py-1.5 text-xs font-medium text-foreground border-b-2 border-border mb-[-1px]">Members</button>
                        <button className="px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground mb-[-1px]">Pending</button>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground mb-4 px-2">
                        <div className="col-span-1">Name</div>
                        <div className="col-span-1">Email</div>
                        <div className="col-span-1">Role</div>
                        <div className="col-span-1">Created</div>
                    </div>

                    {/* Team Member Row */}
                    <div className="grid grid-cols-4 text-sm items-center py-2 px-2 hover:bg-secondary/30 rounded-md">
                        <div className="col-span-1 font-medium text-foreground">{displayName}</div>
                        <div className="col-span-1 text-muted text-xs">{displayEmail}</div>
                        <div className="col-span-1 text-muted">owner</div>
                        <div className="col-span-1 flex items-center justify-between">
                            <span className="text-muted text-xs">February 15, 2026</span>
                            <MoreHorizontal className="w-4 h-4 text-muted cursor-pointer" />
                        </div>
                    </div>

                    {/* Add Member Input */}
                    <div className="mt-6 pt-4 border-t border-border border-dashed">
                        <label className="block text-xs font-medium text-foreground mb-1.5">Add member</label>
                        <input type="email" placeholder="Email" className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-gray-400" />
                        <p className="text-xs text-muted mt-2">Send an invitation to join the team.</p>
                    </div>
                </div>

                <div className="px-6 py-3 bg-secondary/30 flex items-center justify-between border-t border-border">
                    <span className="text-xs text-foreground font-medium">This feature is available on the Pro plan.</span>
                    <button className="bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
};
