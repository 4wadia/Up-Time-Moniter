import { useState, useEffect } from 'react';

export interface DashboardData {
    monitors: { total: number; up: number; down: number; paused: number };
    statusPages: { total: number; active: number };
    incidents: any[];
    maintenance: any[];
}

export const useDashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                setData({
                    monitors: { total: 4, up: 3, down: 1, paused: 0 },
                    statusPages: { total: 1, active: 1 },
                    incidents: [],
                    maintenance: []
                });
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load dashboard data');
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return { data, isLoading, error };
};
