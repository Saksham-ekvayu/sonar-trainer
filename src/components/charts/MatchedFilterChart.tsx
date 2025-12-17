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
import { matchedFilterOutput } from '@/data/mockSimulationData';

export function MatchedFilterChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={matchedFilterOutput}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 20%)" />
        <XAxis
          dataKey="time"
          stroke="hsl(215 20% 55%)"
          fontSize={11}
          label={{
            value: 'Time (samples)',
            position: 'bottom',
            fill: 'hsl(215 20% 55%)',
            fontSize: 11,
          }}
        />
        <YAxis
          domain={[-0.3, 1.1]}
          stroke="hsl(215 20% 55%)"
          fontSize={11}
          label={{
            value: 'Amplitude',
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
          formatter={(value: number) => [value.toFixed(3), 'Amplitude']}
        />
        <ReferenceLine
          y={0}
          stroke="hsl(222 30% 25%)"
        />
        <ReferenceLine
          x={0}
          stroke="hsl(160 84% 39%)"
          strokeWidth={2}
          label={{
            value: 'Detection',
            fill: 'hsl(160 84% 39%)',
            fontSize: 10,
            position: 'top',
          }}
        />
        <Line
          type="monotone"
          dataKey="amplitude"
          stroke="hsl(187 100% 42%)"
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
