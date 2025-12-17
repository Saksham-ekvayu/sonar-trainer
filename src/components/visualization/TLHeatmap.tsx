import { useRef, useEffect } from 'react';
import { transmissionLossHeatmap } from '@/data/mockSimulationData';

export function TLHeatmap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = 300 * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = 300;

    // Clear canvas
    ctx.fillStyle = 'hsl(222, 47%, 6%)';
    ctx.fillRect(0, 0, width, height);

    const numDepths = transmissionLossHeatmap.length;
    const numRanges = transmissionLossHeatmap[0].length;

    const cellWidth = (width - 50) / numRanges;
    const cellHeight = (height - 30) / numDepths;

    // Color scale function (TL values typically 40-120 dB)
    const getColor = (tl: number) => {
      const normalized = Math.max(0, Math.min(1, (tl - 40) / 80));
      
      // Blue (low TL) -> Cyan -> Green -> Yellow -> Red (high TL)
      if (normalized < 0.25) {
        const t = normalized / 0.25;
        return `hsl(${240 - t * 60}, 80%, ${50 + t * 10}%)`;
      } else if (normalized < 0.5) {
        const t = (normalized - 0.25) / 0.25;
        return `hsl(${180 - t * 60}, 80%, ${60 - t * 10}%)`;
      } else if (normalized < 0.75) {
        const t = (normalized - 0.5) / 0.25;
        return `hsl(${120 - t * 60}, 80%, ${50}%)`;
      } else {
        const t = (normalized - 0.75) / 0.25;
        return `hsl(${60 - t * 60}, 80%, ${50 - t * 10}%)`;
      }
    };

    // Draw heatmap cells
    for (let d = 0; d < numDepths; d++) {
      for (let r = 0; r < numRanges; r++) {
        const tl = transmissionLossHeatmap[d][r];
        ctx.fillStyle = getColor(tl);
        ctx.fillRect(
          50 + r * cellWidth,
          d * cellHeight,
          cellWidth + 1,
          cellHeight + 1
        );
      }
    }

    // Draw color scale
    const scaleWidth = 15;
    const scaleX = width - 25;
    for (let i = 0; i < height - 30; i++) {
      const tl = 40 + (i / (height - 30)) * 80;
      ctx.fillStyle = getColor(tl);
      ctx.fillRect(scaleX, i, scaleWidth, 2);
    }

    // Scale labels
    ctx.fillStyle = 'hsl(215, 20%, 55%)';
    ctx.font = '9px JetBrains Mono';
    ctx.fillText('40dB', scaleX - 5, 10);
    ctx.fillText('80dB', scaleX - 5, (height - 30) / 2);
    ctx.fillText('120dB', scaleX - 10, height - 35);

    // Axis labels
    ctx.fillStyle = 'hsl(215, 20%, 55%)';
    ctx.font = '11px Inter';
    ctx.fillText('Range (km)', width / 2 - 30, height - 5);
    
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Depth (m)', -height / 2 - 20, 15);
    ctx.restore();

    // Tick marks
    ctx.font = '9px JetBrains Mono';
    ctx.fillStyle = 'hsl(215, 20%, 45%)';
    
    // Range ticks
    for (let r = 0; r <= 10; r += 2) {
      const x = 50 + (r / 10) * (width - 100);
      ctx.fillText(`${r}`, x, height - 18);
    }
    
    // Depth ticks
    for (let d = 0; d <= 500; d += 100) {
      const y = (d / 500) * (height - 30);
      ctx.fillText(`${d}`, 25, y + 12);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[300px] rounded-lg"
      style={{ imageRendering: 'auto' }}
    />
  );
}
