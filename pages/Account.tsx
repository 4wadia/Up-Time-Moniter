import React from 'react';
import { User, Mail, Shield } from 'lucide-react';

export const AccountPage = () => {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-xl font-semibold text-foreground">Account</h1>
                <p className="text-sm text-muted">Manage your personal account settings.</p>
            </div>

            <div className="bg-background border border-border rounded-xl shadow-sm p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-2xl font-bold border border-purple-200">
                        PW
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Parth Wadia</h3>
                        <p className="text-sm text-muted">parthwgamer123@gmail.com</p>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                    <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
                            <input
                                type="text"
                                defaultValue="Parth Wadia"
                                className="w-full pl-9 pr-3 py-2 border border-border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
                            <input
                                type="email"
                                defaultValue="parthwgamer123@gmail.com"
                                className="w-full pl-9 pr-3 py-2 border border-border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
