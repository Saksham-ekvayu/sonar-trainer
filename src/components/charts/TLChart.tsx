import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { transmissionLossData } from '@/data/mockSimulationData';

export function TLChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={transmissionLossData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 35% 22%)" />
        <XAxis
          dataKey="range"
          stroke="hsl(230 20% 60%)"
          fontSize={12}
          tickFormatter={(value) => `${value / 1000}km`}
          label={{
            value: 'Range',
            position: 'bottom',
            fill: 'hsl(230 20% 60%)',
            fontSize: 11,
          }}
        />
        <YAxis
          stroke="hsl(230 20% 60%)"
          fontSize={12}
          label={{
            value: 'TL (dB)',
            angle: -90,
            position: 'insideLeft',
            fill: 'hsl(230 20% 60%)',
            fontSize: 11,
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(230 50% 10%)',
            border: '1px solid hsl(43 85% 55%)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'hsl(45 30% 95%)',
          }}
          labelFormatter={(value) => `Range: ${value}m`}
          formatter={(value: number) => [`${value.toFixed(1)} dB`, 'TL']}
        />
        <ReferenceLine
          y={80}
          stroke="hsl(43 85% 55%)"
          strokeDasharray="5 5"
          label={{
            value: 'Detection Threshold',
            fill: 'hsl(43 85% 55%)',
            fontSize: 10,
          }}
        />
        <Line
          type="monotone"
          dataKey="tl"
          stroke="hsl(43 85% 55%)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: 'hsl(43 90% 65%)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
