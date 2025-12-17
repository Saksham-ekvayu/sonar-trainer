import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ambientNoiseSpectrum } from '@/data/mockSimulationData';

export function NoiseSpectrumChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={ambientNoiseSpectrum}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 20%)" />
        <XAxis
          dataKey="frequency"
          scale="log"
          domain={[10, 10000]}
          stroke="hsl(215 20% 55%)"
          fontSize={11}
          tickFormatter={(value) =>
            value >= 1000 ? `${value / 1000}k` : `${value}`
          }
          label={{
            value: 'Frequency (Hz)',
            position: 'bottom',
            fill: 'hsl(215 20% 55%)',
            fontSize: 11,
          }}
        />
        <YAxis
          domain={[20, 80]}
          stroke="hsl(215 20% 55%)"
          fontSize={11}
          label={{
            value: 'Level (dB)',
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
          formatter={(value: number) => [`${value.toFixed(1)} dB`]}
          labelFormatter={(value) => `${value.toFixed(0)} Hz`}
        />
        <Legend
          wrapperStyle={{ fontSize: '11px' }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey="shipping"
          name="Shipping"
          stroke="hsl(0 72% 51%)"
          strokeWidth={1.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="wind"
          name="Wind"
          stroke="hsl(38 92% 50%)"
          strokeWidth={1.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="thermal"
          name="Thermal"
          stroke="hsl(270 60% 60%)"
          strokeWidth={1.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="total"
          name="Total"
          stroke="hsl(187 100% 42%)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
