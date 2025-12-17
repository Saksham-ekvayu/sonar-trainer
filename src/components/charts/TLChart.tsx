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
            value: 'TL (dB)',
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
          formatter={(value: number) => [`${value.toFixed(1)} dB`, 'TL']}
        />
        <ReferenceLine
          y={80}
          stroke="hsl(38 92% 50%)"
          strokeDasharray="5 5"
          label={{
            value: 'Detection Threshold',
            fill: 'hsl(38 92% 50%)',
            fontSize: 10,
          }}
        />
        <Line
          type="monotone"
          dataKey="tl"
          stroke="hsl(187 100% 42%)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: 'hsl(187 100% 60%)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
