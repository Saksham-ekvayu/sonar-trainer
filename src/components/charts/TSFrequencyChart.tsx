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

interface TSFrequencyChartProps {
  targetType: 'submarine' | 'ship' | 'torpedo';
}

export function TSFrequencyChart({ targetType }: TSFrequencyChartProps) {
  // Generate frequency-dependent TS data
  const data = Array.from({ length: 50 }, (_, i) => {
    const freq = 500 + i * 200;
    const ka = (2 * Math.PI * freq * (targetType === 'submarine' ? 5 : targetType === 'ship' ? 7 : 0.25)) / 1500;

    const baseTS = targetType === 'submarine' ? 15 : targetType === 'ship' ? 25 : 5;
    const beamTS = baseTS + 10 * Math.sin(ka);
    const bowTS = baseTS - 5 + 5 * Math.cos(ka * 0.5);

    return {
      frequency: freq,
      beam: Math.max(0, beamTS + Math.random() * 2 - 1),
      bow: Math.max(0, bowTS + Math.random() * 2 - 1),
      stern: Math.max(0, bowTS - 2 + Math.random() * 2 - 1),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 20%)" />
        <XAxis
          dataKey="frequency"
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
          domain={[0, 40]}
          stroke="hsl(215 20% 55%)"
          fontSize={11}
          label={{
            value: 'TS (dB)',
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
          labelFormatter={(value) => `${value} Hz`}
        />
        <Legend wrapperStyle={{ fontSize: '11px' }} />
        <Line
          type="monotone"
          dataKey="beam"
          name="Beam Aspect (90°)"
          stroke="hsl(187 100% 42%)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="bow"
          name="Bow Aspect (0°)"
          stroke="hsl(160 84% 39%)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="stern"
          name="Stern Aspect (180°)"
          stroke="hsl(38 92% 50%)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
