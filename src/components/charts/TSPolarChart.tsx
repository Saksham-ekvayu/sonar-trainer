import { useRef, useEffect } from 'react';
import { targetStrengthData } from '@/data/mockSimulationData';

interface TSPolarChartProps {
  targetType: 'submarine' | 'ship' | 'torpedo';
}

export function TSPolarChart({ targetType }: TSPolarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const size = 400;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);

    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size / 2 - 50;

    // Clear canvas
    ctx.fillStyle = 'hsl(222, 47%, 6%)';
    ctx.fillRect(0, 0, size, size);

    // Draw concentric circles (TS levels)
    ctx.strokeStyle = 'hsl(222, 30%, 20%)';
    ctx.lineWidth = 0.5;

    const tsLevels = [0, 10, 20, 30, 40];
    tsLevels.forEach((ts) => {
      const radius = (ts / 40) * maxRadius;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = 'hsl(215, 20%, 45%)';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(`${ts}dB`, centerX + 5, centerY - radius + 12);
    });

    // Draw radial lines (angles)
    for (let angle = 0; angle < 360; angle += 30) {
      const rad = (angle * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + maxRadius * Math.cos(rad),
        centerY - maxRadius * Math.sin(rad)
      );
      ctx.stroke();

      // Angle labels
      const labelRadius = maxRadius + 20;
      ctx.fillStyle = 'hsl(215, 20%, 55%)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${angle}°`,
        centerX + labelRadius * Math.cos(rad),
        centerY - labelRadius * Math.sin(rad)
      );
    }

    // Get data for target type
    const data = targetStrengthData[targetType];

    // Draw TS pattern
    ctx.beginPath();
    ctx.strokeStyle = 'hsl(187, 100%, 42%)';
    ctx.lineWidth = 2;

    data.forEach((point, i) => {
      const rad = (point.angle * Math.PI) / 180;
      const ts = Math.max(0, point.ts);
      const radius = (ts / 40) * maxRadius;

      if (i === 0) {
        ctx.moveTo(
          centerX + radius * Math.cos(rad),
          centerY - radius * Math.sin(rad)
        );
      } else {
        ctx.lineTo(
          centerX + radius * Math.cos(rad),
          centerY - radius * Math.sin(rad)
        );
      }
    });
    ctx.closePath();
    ctx.stroke();

    // Fill with gradient
    ctx.fillStyle = 'hsla(187, 100%, 42%, 0.1)';
    ctx.fill();

    // Draw ship outline at center
    ctx.save();
    ctx.translate(centerX, centerY);

    // Simple ship shape
    ctx.fillStyle = 'hsl(222, 30%, 25%)';
    ctx.strokeStyle = 'hsl(215, 20%, 55%)';
    ctx.lineWidth = 1;

    if (targetType === 'submarine') {
      // Submarine shape
      ctx.beginPath();
      ctx.ellipse(0, 0, 25, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Sail
      ctx.fillRect(-5, -12, 10, 5);
    } else if (targetType === 'ship') {
      // Ship shape
      ctx.beginPath();
      ctx.moveTo(-20, 8);
      ctx.lineTo(-25, 0);
      ctx.lineTo(-20, -8);
      ctx.lineTo(25, -8);
      ctx.lineTo(30, 0);
      ctx.lineTo(25, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Torpedo shape
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();

    // Labels
    ctx.fillStyle = 'hsl(215, 20%, 55%)';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('BOW', centerX, 30);
    ctx.fillText('STERN', centerX, size - 20);
    ctx.fillText('PORT', 25, centerY);
    ctx.fillText('STBD', size - 25, centerY);
  }, [targetType]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-[400px] h-[400px] mx-auto"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}
