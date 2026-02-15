import React from 'react';
import { Terminal, Search, Menu, List } from 'lucide-react';

export const OverviewPage = () => {
    return (
        <div className="space-y-8 max-w-6xl">
            {/* Banner */}
            <div className="bg-background border border-border rounded-lg p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-foreground" />
                    <span className="text-sm font-medium text-foreground">Use Monitoring as Code to manage your monitors with our CLI.</span>
                </div>
                <button className="bg-foreground text-background px-3 py-1.5 rounded-md text-xs font-medium hover:opacity-90 transition-opacity">
                    Learn more
                </button>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold text-foreground">Overview</h1>
                <p className="text-sm text-muted">Welcome to your OpenStatus dashboard.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <SummaryCard label="Monitors" value="1" icon={<List className="w-3 h-3" />} />
                <SummaryCard label="Status Pages" value="0" icon={<List className="w-3 h-3" />} />
                <SummaryCard label="Recent Incidents" value="None" searchIcon />
                <SummaryCard label="Last Report" value="None" searchIcon />
                <SummaryCard label="Last Maintenance" value="None" searchIcon />
            </div>

            {/* Sections */}
            <Section title="Incidents" subtitle="Incidents over the last 7 days." emptyText="No incidents found" />
            <Section title="Reports" subtitle="Reports over the last 7 days." emptyText="No reports found" />
            <Section title="Maintenance" subtitle="Maintenance over the last 7 days." emptyText="No maintenances found" />
        </div>
    );
};

const SummaryCard = ({ label, value, icon, searchIcon = false }: { label: string, value: string, icon?: React.ReactNode, searchIcon?: boolean }) => (
    <div className="bg-background border border-border rounded-lg p-3 flex flex-col gap-1 shadow-sm">
        <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium trunc">{label}</span>
            {searchIcon ? <Search className="w-3 h-3 text-muted" /> : icon}
        </div>
        <span className="text-lg font-semibold text-foreground">{value}</span>
    </div>
);

const Section = ({ title, subtitle, emptyText }: { title: string, subtitle: string, emptyText: string }) => (
    <div className="space-y-3">
        <div>
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            <p className="text-xs text-muted">{subtitle}</p>
        </div>
        <div className="border border-dashed border-border rounded-lg p-8 flex items-center justify-center">
            <span className="text-sm text-foreground font-medium">{emptyText}</span>
        </div>
    </div>
);
