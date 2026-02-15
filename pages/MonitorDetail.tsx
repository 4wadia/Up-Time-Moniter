import React from 'react';
import { ChevronRight, MoreHorizontal, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

export const MonitorDetail = () => {
    // Mock Data for Charts
    const uptimeData = Array.from({ length: 48 }, (_, i) => ({
        time: i,
        status: 1, // 1 for success
    }));

    const latencyData = Array.from({ length: 48 }, (_, i) => ({
        time: i,
        p50: 30 + Math.random() * 20,
        p90: 50 + Math.random() * 40,
        p99: 80 + Math.random() * 100,
    }));

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted">
                <LayoutGrid className="w-4 h-4" />
                <ChevronRight className="w-4 h-4" />
                <span>Monitors</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">Harsh Website</span>
                <ChevronRight className="w-4 h-4" />
                <span className="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded text-foreground">
                    <LayoutGrid className="w-3 h-3" /> Overview
                </span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Harsh Website</h1>
                    <a href="https://www.harzh.xyz/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:underline flex items-center gap-1">
                        https://www.harzh.xyz/
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-background border border-border rounded-md px-1 p-1">
                        <button className="px-3 py-1 text-xs font-medium bg-secondary rounded text-foreground">Last day</button>
                        <span className="px-2 text-xs text-muted">including</span>
                        <button className="px-3 py-1 text-xs font-medium hover:bg-secondary rounded text-foreground">All Regions</button>
                    </div>
                    <button className="p-2 hover:bg-secondary rounded"><MoreHorizontal className="w-4 h-4 text-muted" /></button>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard label="UPTIME" value="100.00%" subValue="0%" color="green" />
                <StatCard label="DEGRADED" value="0" subValue="0%" color="yellow" />
                <StatCard label="FAILING" value="0" subValue="0%" color="red" />
                <div className="bg-background border border-border rounded-lg p-4 flex flex-col justify-between shadow-sm">
                    <span className="text-xs text-muted uppercase tracking-wider font-semibold">REQUESTS</span>
                    <span className="text-xl font-bold text-foreground">192</span>
                </div>
                <div className="bg-background border border-border rounded-lg p-4 flex flex-col justify-between shadow-sm">
                    <span className="text-xs text-muted uppercase tracking-wider font-semibold">LAST CHECKED</span>
                    <span className="text-lg font-medium text-foreground">12 minutes ago</span>
                </div>
            </div>

            {/* Latency Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <LatencyCard label="P50" value="46 ms" change="2.1%" />
                <LatencyCard label="P75" value="61 ms" change="4.7%" />
                <LatencyCard label="P90" value="72 ms" change="12.2%" />
                <LatencyCard label="P95" value="94 ms" change="11.3%" />
                <LatencyCard label="P99" value="287 ms" change="12.8%" />
            </div>

            {/* Uptime Chart */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Uptime</h3>
                    <p className="text-sm text-muted">Uptime accross all the selected regions</p>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={uptimeData} barGap={2}>
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="status" fill="#22c55e" radius={[2, 2, 2, 2]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1 text-foreground"><div className="w-2 h-2 bg-green-500 rounded-sm"></div> Success</span>
                    <span className="flex items-center gap-1 text-muted"><div className="w-2 h-2 bg-red-500 rounded-sm"></div> Error</span>
                    <span className="flex items-center gap-1 text-muted"><div className="w-2 h-2 bg-yellow-500 rounded-sm"></div> Degraded</span>
                </div>
            </div>

            {/* Latency Chart */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Latency</h3>
                    <p className="text-sm text-muted">Response time accross all the regions</p>
                    {/* Toggle Controls */}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-muted">The</span>
                        <span className="px-2 py-0.5 bg-background border border-border rounded text-xs font-medium shadow-sm">P50</span>
                        <span className="text-sm text-muted">quantile within a</span>
                        <span className="px-2 py-0.5 bg-background border border-border rounded text-xs font-medium shadow-sm">30 minutes</span>
                        <span className="text-sm text-muted">resolution</span>
                    </div>
                </div>

                <div className="h-64 w-full bg-background border border-border rounded-xl p-4 shadow-sm">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={latencyData}>
                            <defs>
                                <linearGradient id="colorP99" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="time" hide />
                            <YAxis orientation="right" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="p99" stroke="#f59e0b" fillOpacity={1} fill="url(#colorP99)" strokeWidth={2} />
                            <Area type="monotone" dataKey="p50" stroke="#3b82f6" fillOpacity={1} fill="url(#colorP50)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1 text-muted"><div className="w-2 h-2 bg-red-400 rounded-sm"></div> DNS</span>
                    <span className="flex items-center gap-1 text-muted"><div className="w-2 h-2 bg-green-500 rounded-sm"></div> Connect</span>
                    <span className="flex items-center gap-1 text-muted"><div className="w-2 h-2 bg-blue-500 rounded-sm"></div> TLS</span>
                    <span className="flex items-center gap-1 text-muted"><div className="w-2 h-2 bg-yellow-500 rounded-sm"></div> TTFB</span>
                    <span className="flex items-center gap-1 text-muted"><div className="w-2 h-2 bg-orange-400 rounded-sm"></div> Transfer</span>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, subValue, color }: { label: string, value: string, subValue: string, color: 'green' | 'yellow' | 'red' }) => {
    const bgColors = {
        green: 'bg-green-50/50',
        yellow: 'bg-yellow-50/50',
        red: 'bg-red-50/50'
    };
    const textColors = {
        green: 'text-green-700',
        yellow: 'text-yellow-700',
        red: 'text-red-700'
    };
    const borderColors = {
        green: 'border-green-200',
        yellow: 'border-yellow-200',
        red: 'border-red-200'
    };

    return (
        <div className={`border rounded-lg p-4 flex flex-col justify-between shadow-sm ${bgColors[color]} ${borderColors[color]}`}>
            <span className={`text-xs uppercase tracking-wider font-semibold ${textColors[color]}`}>{label}</span>
            <div className="flex items-end gap-2">
                <span className={`text-xl font-bold ${textColors[color]}`}>{value}</span>
                <span className="text-xs opacity-70 mb-1 bg-background/50 px-1 rounded">{subValue}</span>
            </div>
        </div>
    );
};

const LatencyCard = ({ label, value, change }: { label: string, value: string, change: string }) => (
    <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
        <span className="text-xs text-muted uppercase tracking-wider font-semibold">{label}</span>
        <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-foreground">{value}</span>
            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">-{change}</span>
        </div>
    </div>
);
