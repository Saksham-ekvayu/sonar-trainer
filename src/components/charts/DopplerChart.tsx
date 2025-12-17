import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { dopplerData } from '@/data/mockSimulationData';

export function DopplerChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={dopplerData}>
        <defs>
          <linearGradient id="dopplerGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(270 60% 60%)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(270 60% 60%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 20%)" />
        <XAxis
          dataKey="frequency"
          stroke="hsl(215 20% 55%)"
          fontSize={11}
          tickFormatter={(value) => `${value}`}
          label={{
            value: 'Doppler Shift (Hz)',
            position: 'bottom',
            fill: 'hsl(215 20% 55%)',
            fontSize: 11,
          }}
        />
        <YAxis
          domain={[0, 1]}
          stroke="hsl(215 20% 55%)"
          fontSize={11}
          label={{
            value: 'Power',
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
          formatter={(value: number) => [value.toFixed(3), 'Power']}
          labelFormatter={(value) => `${value} Hz`}
        />
        <ReferenceLine
          x={150}
          stroke="hsl(160 84% 39%)"
          strokeDasharray="5 5"
          label={{
            value: 'Target',
            fill: 'hsl(160 84% 39%)',
            fontSize: 10,
            position: 'top',
          }}
        />
        <Area
          type="monotone"
          dataKey="power"
          stroke="hsl(270 60% 60%)"
          strokeWidth={2}
          fill="url(#dopplerGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
