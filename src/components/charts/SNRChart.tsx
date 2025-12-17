import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import { snrVsRangeData } from '@/data/mockSimulationData';

export function SNRChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={snrVsRangeData}>
        <defs>
          <linearGradient id="snrGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 20%)" />
        <XAxis
          dataKey="range"
          stroke="hsl(215 20% 55%)"
          fontSize={12}
          tickFormatter={(value) => `${value / 1000}km`}
          label={{
            value: 'Range',
            position: 'bottom',
            fill: 'hsl(215 20% 55%)',
            fontSize: 11,
          }}
        />
        <YAxis
          stroke="hsl(215 20% 55%)"
          fontSize={12}
          label={{
            value: 'SNR (dB)',
            angle: -90,
            position: 'insideLeft',
            fill: 'hsl(215 20% 55%)',
            fontSize: 11,
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(222 47% 8%)',
            border: '1px solid hsl(222 30% 18%)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelFormatter={(value) => `Range: ${value}m`}
          formatter={(value: number) => [`${value.toFixed(1)} dB`, 'SNR']}
        />
        <ReferenceLine
          y={10}
          stroke="hsl(0 72% 51%)"
          strokeDasharray="5 5"
          label={{
            value: 'Detection Threshold',
            fill: 'hsl(0 72% 51%)',
            fontSize: 10,
          }}
        />
        <Area
          type="monotone"
          dataKey="snr"
          fill="url(#snrGradient)"
          stroke="none"
        />
        <Line
          type="monotone"
          dataKey="snr"
          stroke="hsl(160 84% 39%)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: 'hsl(160 84% 50%)' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
