import React from 'react';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { PageView } from '../types';

interface MonitorsListProps {
    onNavigate?: (page: PageView) => void;
}

export const MonitorsList: React.FC<MonitorsListProps> = ({ onNavigate }) => {
    return (
        <div className="space-y-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Monitors</h1>
                    <p className="text-sm text-muted">Create and manage your monitors.</p>
                </div>
                <button className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 flex items-center gap-2">
                    Create Monitor
                </button>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatusCard label="Normal" value="1" color="green" />
                <StatusCard label="Degraded" value="0" color="yellow" />
                <StatusCard label="Failing" value="0" color="red" />
                <StatusCard label="Inactive" value="0" color="gray" />
                <div className="border border-border rounded-lg p-3 flex flex-col justify-between shadow-sm bg-background">
                    <span className="text-xs text-muted font-medium">Slowest P95</span>
                    <div className="h-6 w-12 bg-secondary rounded mt-1"></div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <input
                        type="text"
                        placeholder="Filter by name, url, type..."
                        className="w-full pl-3 pr-4 py-1.5 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                </div>
                <button className="px-3 py-1.5 border border-border rounded-md text-sm font-medium flex items-center gap-1 bg-background hover:bg-secondary">
                    <Plus className="w-3 h-3" /> Tags
                </button>
            </div>

            {/* Table */}
            <div className="border border-border rounded-lg overflow-hidden bg-background shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-background text-foreground font-medium border-b border-border">
                        <tr>
                            <th className="py-3 px-4 w-10">
                                <input type="checkbox" className="rounded border-gray-300" />
                            </th>
                            <th className="py-3 px-4 font-medium">Name</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Tags</th>
                            <th className="py-3 px-4 font-medium">Last Incident</th>
                            <th className="py-3 px-4 font-medium">Last Checked</th>
                            <th className="py-3 px-4 font-medium">P50</th>
                            <th className="py-3 px-4 font-medium">P90</th>
                            <th className="py-3 px-4 font-medium">P95</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <tr className="hover:bg-secondary/30 group cursor-pointer" onClick={() => onNavigate?.('monitor-detail')}>
                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" className="rounded border-gray-300" />
                            </td>
                            <td className="py-3 px-4 font-medium text-foreground">Harsh Website</td>
                            <td className="py-3 px-4">
                                <span className="text-success font-semibold text-xs uppercase tracking-wide">active</span>
                            </td>
                            <td className="py-3 px-4 text-muted">-</td>
                            <td className="py-3 px-4 text-muted">-</td>
                            <td className="py-3 px-4">
                                <div className="h-2 w-16 bg-secondary rounded"></div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="h-2 w-8 bg-secondary rounded"></div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="h-2 w-8 bg-secondary rounded"></div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="h-2 w-8 bg-secondary rounded"></div>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <MoreHorizontal className="w-4 h-4 text-muted cursor-pointer hover:text-foreground" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted">
                    <span>1 of 1 row(s) filtered.</span>
                    <div className="flex gap-1">
                        <button className="p-1 border border-border rounded hover:bg-secondary disabled:opacity-50" disabled>&lt;&lt;</button>
                        <button className="p-1 border border-border rounded hover:bg-secondary disabled:opacity-50" disabled>&lt;</button>
                        <button className="p-1 border border-border rounded hover:bg-secondary disabled:opacity-50" disabled>&gt;</button>
                        <button className="p-1 border border-border rounded hover:bg-secondary disabled:opacity-50" disabled>&gt;&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ label, value, color }: { label: string, value: string, color: 'green' | 'yellow' | 'red' | 'gray' }) => {
    const colorClasses = {
        green: 'bg-green-50 border-green-200 text-green-700',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        red: 'bg-red-50 border-red-200 text-red-700',
        gray: 'bg-gray-50 border-gray-200 text-gray-700'
    };

    return (
        <div className={`border rounded-lg p-3 flex flex-col justify-between shadow-sm h-20 ${colorClasses[color]}`}>
            <div className="flex justify-between items-start">
                <span className="text-xs font-medium opacity-80">{label}</span>
                <span className="text-xs opacity-50"><MoreHorizontal className="w-3 h-3" /></span>
                {/* using MoreHorizontal as placeholder for the filter icon in screenshot */}
            </div>
            <span className="text-lg font-bold">{value}</span>
        </div>
    );
};
