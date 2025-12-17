import { useRef, useEffect } from 'react';
import { waterfallData } from '@/data/mockSimulationData';

interface WaterfallDisplayProps {
  showNoise: boolean;
}

export function WaterfallDisplay({ showNoise }: WaterfallDisplayProps) {
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

    const numTimes = waterfallData.length;
    const numBearings = 360;
    const cellWidth = (width - 50) / numBearings;
    const cellHeight = (height - 30) / numTimes;

    // Color map function
    const getColor = (value: number) => {
      const normalized = (value - 30) / 50;
      if (normalized < 0.3) {
        return `hsl(240, 80%, ${20 + normalized * 50}%)`;
      } else if (normalized < 0.6) {
        const t = (normalized - 0.3) / 0.3;
        return `hsl(${240 - t * 180}, 80%, ${35 + t * 20}%)`;
      } else {
        const t = (normalized - 0.6) / 0.4;
        return `hsl(${60 - t * 60}, 80%, ${55 + t * 15}%)`;
      }
    };

    // Draw waterfall data
    for (let t = 0; t < numTimes; t++) {
      for (let b = 0; b < numBearings; b++) {
        const value = showNoise
          ? waterfallData[t][b]
          : waterfallData[t][b] > 60
          ? waterfallData[t][b]
          : 30;

        ctx.fillStyle = getColor(value);
        ctx.fillRect(50 + b * cellWidth, t * cellHeight, cellWidth + 1, cellHeight + 1);
      }
    }

    // Draw target track highlight
    const targetBearing = 45;
    ctx.strokeStyle = 'hsl(160, 84%, 39%)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50 + targetBearing * cellWidth, 0);
    ctx.lineTo(50 + targetBearing * cellWidth, height - 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Axis labels
    ctx.fillStyle = 'hsl(215, 20%, 55%)';
    ctx.font = '11px Inter';
    ctx.fillText('Bearing (degrees)', width / 2 - 40, height - 5);

    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Time (s)', -height / 2 - 20, 15);
    ctx.restore();

    // Tick marks
    ctx.font = '9px JetBrains Mono';
    ctx.fillStyle = 'hsl(215, 20%, 45%)';

    for (let b = 0; b <= 360; b += 45) {
      const x = 50 + (b / 360) * (width - 50);
      ctx.fillText(`${b}°`, x - 10, height - 18);
    }

    for (let t = 0; t <= numTimes; t += 20) {
      const y = (t / numTimes) * (height - 30);
      ctx.fillText(`${t}`, 25, y + 12);
    }

    // Color scale
    const scaleX = width - 25;
    for (let i = 0; i < height - 30; i++) {
      const value = 30 + (i / (height - 30)) * 50;
      ctx.fillStyle = getColor(value);
      ctx.fillRect(scaleX, i, 15, 2);
    }

    ctx.fillStyle = 'hsl(215, 20%, 55%)';
    ctx.font = '9px JetBrains Mono';
    ctx.fillText('30dB', scaleX - 5, 10);
    ctx.fillText('55dB', scaleX - 5, (height - 30) / 2);
    ctx.fillText('80dB', scaleX - 5, height - 35);
  }, [showNoise]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[400px] rounded-lg"
      style={{ imageRendering: 'auto' }}
    />
  );
}
