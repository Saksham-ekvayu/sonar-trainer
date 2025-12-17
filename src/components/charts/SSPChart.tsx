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
import { soundSpeedProfileData } from '@/data/mockSimulationData';

export function SSPChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={soundSpeedProfileData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 20%)" />
        <XAxis
          type="number"
          dataKey="speed"
          domain={[1475, 1525]}
          stroke="hsl(215 20% 55%)"
          fontSize={12}
          label={{
            value: 'Sound Speed (m/s)',
            position: 'bottom',
            fill: 'hsl(215 20% 55%)',
            fontSize: 11,
          }}
        />
        <YAxis
          type="number"
          dataKey="depth"
          reversed
          stroke="hsl(215 20% 55%)"
          fontSize={12}
          label={{
            value: 'Depth (m)',
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
          formatter={(value: number, name: string) => [
            name === 'speed' ? `${value} m/s` : `${value}m`,
            name === 'speed' ? 'Sound Speed' : 'Depth',
          ]}
        />
        <ReferenceLine
          x={1500}
          stroke="hsl(38 92% 50%)"
          strokeDasharray="5 5"
          label={{
            value: 'Channel Axis',
            fill: 'hsl(38 92% 50%)',
            fontSize: 10,
            position: 'top',
          }}
        />
        <Line
          type="monotone"
          dataKey="speed"
          stroke="hsl(187 100% 42%)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'hsl(187 100% 42%)' }}
          activeDot={{ r: 5, fill: 'hsl(187 100% 60%)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
