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
import { beamPatternData } from '@/data/mockSimulationData';

export function BeamPatternChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={beamPatternData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 20%)" />
        <XAxis
          dataKey="angle"
          domain={[-90, 90]}
          stroke="hsl(215 20% 55%)"
          fontSize={11}
          tickFormatter={(value) => `${value}°`}
          label={{
            value: 'Angle (degrees)',
            position: 'bottom',
            fill: 'hsl(215 20% 55%)',
            fontSize: 11,
          }}
        />
        <YAxis
          domain={[-40, 0]}
          stroke="hsl(215 20% 55%)"
          fontSize={11}
          label={{
            value: 'Gain (dB)',
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
          formatter={(value: number) => [`${value.toFixed(1)} dB`, 'Gain']}
          labelFormatter={(value) => `Angle: ${value}°`}
        />
        <ReferenceLine
          y={-3}
          stroke="hsl(38 92% 50%)"
          strokeDasharray="5 5"
          label={{
            value: '-3dB',
            fill: 'hsl(38 92% 50%)',
            fontSize: 10,
            position: 'right',
          }}
        />
        <ReferenceLine
          x={0}
          stroke="hsl(222 30% 30%)"
          strokeDasharray="3 3"
        />
        <Line
          type="monotone"
          dataKey="gain"
          stroke="hsl(187 100% 42%)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
