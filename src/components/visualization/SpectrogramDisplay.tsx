import { useRef, useEffect } from 'react';
import { spectrogramData } from '@/data/mockSimulationData';

interface SpectrogramDisplayProps {
  showNoise: boolean;
}

export function SpectrogramDisplay({ showNoise }: SpectrogramDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = 400 * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = 400;

    // Clear canvas
    ctx.fillStyle = 'hsl(222, 47%, 6%)';
    ctx.fillRect(0, 0, width, height);

    const numTimes = spectrogramData.length;
    const numFreqs = spectrogramData[0].length;
    const cellWidth = (width - 50) / numTimes;
    const cellHeight = (height - 30) / numFreqs;

    // Color map function (viridis-like)
    const getColor = (value: number) => {
      const normalized = Math.max(0, Math.min(1, (value - 20) / 50));

      if (normalized < 0.25) {
        const t = normalized / 0.25;
        return `hsl(${270 - t * 30}, ${60 + t * 20}%, ${15 + t * 15}%)`;
      } else if (normalized < 0.5) {
        const t = (normalized - 0.25) / 0.25;
        return `hsl(${240 - t * 120}, 80%, ${30 + t * 10}%)`;
      } else if (normalized < 0.75) {
        const t = (normalized - 0.5) / 0.25;
        return `hsl(${120 - t * 60}, 70%, ${40 + t * 15}%)`;
      } else {
        const t = (normalized - 0.75) / 0.25;
        return `hsl(${60 - t * 30}, ${70 - t * 20}%, ${55 + t * 30}%)`;
      }
    };

    // Draw spectrogram data
    for (let t = 0; t < numTimes; t++) {
      for (let f = 0; f < numFreqs; f++) {
        const value = showNoise
          ? spectrogramData[t][f]
          : spectrogramData[t][f] > 50
          ? spectrogramData[t][f]
          : 20;

        ctx.fillStyle = getColor(value);
        ctx.fillRect(
          50 + t * cellWidth,
          height - 30 - (f + 1) * cellHeight,
          cellWidth + 1,
          cellHeight + 1
        );
      }
    }

    // Draw tonal line markers
    ctx.strokeStyle = 'hsl(160, 84%, 39%)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    // Tonal at ~2.3 kHz (freq index ~46)
    const tonal1Y = height - 30 - (46 / numFreqs) * (height - 30);
    ctx.beginPath();
    ctx.moveTo(50, tonal1Y);
    ctx.lineTo(width - 30, tonal1Y);
    ctx.stroke();

    // Tonal at ~3.6 kHz (freq index ~72)
    const tonal2Y = height - 30 - (72 / numFreqs) * (height - 30);
    ctx.beginPath();
    ctx.moveTo(50, tonal2Y);
    ctx.lineTo(width - 30, tonal2Y);
    ctx.stroke();

    ctx.setLineDash([]);

    // Tonal labels
    ctx.fillStyle = 'hsl(160, 84%, 50%)';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText('2.3 kHz', width - 80, tonal1Y - 5);
    ctx.fillText('3.6 kHz', width - 80, tonal2Y - 5);

    // Axis labels
    ctx.fillStyle = 'hsl(215, 20%, 55%)';
    ctx.font = '11px Inter';
    ctx.fillText('Time (s)', width / 2 - 20, height - 5);

    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Frequency (kHz)', -height / 2 - 40, 15);
    ctx.restore();

    // Tick marks
    ctx.font = '9px JetBrains Mono';
    ctx.fillStyle = 'hsl(215, 20%, 45%)';

    for (let t = 0; t <= numTimes; t += 10) {
      const x = 50 + (t / numTimes) * (width - 80);
      ctx.fillText(`${t}`, x, height - 18);
    }

    for (let f = 0; f <= 5; f++) {
      const y = height - 30 - (f / 5) * (height - 30);
      ctx.fillText(`${f}`, 30, y + 4);
    }

    // Color scale
    const scaleX = width - 20;
    for (let i = 0; i < height - 30; i++) {
      const value = 20 + ((height - 30 - i) / (height - 30)) * 50;
      ctx.fillStyle = getColor(value);
      ctx.fillRect(scaleX, i, 12, 2);
    }

    ctx.fillStyle = 'hsl(215, 20%, 55%)';
    ctx.font = '8px JetBrains Mono';
    ctx.fillText('70', scaleX - 3, 10);
    ctx.fillText('45', scaleX - 3, (height - 30) / 2);
    ctx.fillText('20', scaleX - 3, height - 35);
  }, [showNoise]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[400px] rounded-lg"
      style={{ imageRendering: 'auto' }}
    />
  );
}
