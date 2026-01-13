import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { UptimePoint, THEME } from '../types';

interface UptimeChartProps {
  data: UptimePoint[];
  color?: string;
}

export const UptimeChart: React.FC<UptimeChartProps> = ({ data, color = THEME.almondSilk }) => {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.powderPetal} />
          <XAxis 
            dataKey="time" 
            tick={{ fill: THEME.foregroundMuted, fontSize: 10 }} 
            axisLine={false} 
            tickLine={false} 
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fill: THEME.foregroundMuted, fontSize: 10 }} 
            axisLine={false} 
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: THEME.linen, 
                border: `1px solid ${THEME.dustGrey}`,
                borderRadius: '8px',
                color: THEME.foreground
            }}
            itemStyle={{ color: THEME.foreground }}
            cursor={{ stroke: THEME.dustGrey, strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="latency"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorLatency)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};