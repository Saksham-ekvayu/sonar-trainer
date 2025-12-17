import { useRef, useEffect } from 'react';
import { rayPathData } from '@/data/mockSimulationData';
import { useSonarStore } from '@/app/store/sonarStore';

export function RayPathVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { platform, targets, environment } = useSonarStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = 400 * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = 400;

    // Clear canvas
    ctx.fillStyle = 'hsl(222, 47%, 6%)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'hsl(222, 30%, 15%)';
    ctx.lineWidth = 0.5;

    // Vertical grid lines (range)
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid lines (depth)
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Scale factors
    const maxRange = 10000;
    const maxDepth = environment.waterDepth;
    const scaleX = width / maxRange;
    const scaleY = height / maxDepth;

    // Draw surface
    ctx.strokeStyle = 'hsl(200, 60%, 40%)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.stroke();

    // Draw seabed
    ctx.strokeStyle = 'hsl(30, 40%, 30%)';
    ctx.fillStyle = 'hsl(30, 40%, 15%)';
    ctx.beginPath();
    ctx.moveTo(0, maxDepth * scaleY);
    ctx.lineTo(width, maxDepth * scaleY);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();
    ctx.stroke();

    // Ray colors
    const rayColors = [
      'hsl(187, 100%, 42%)', // Direct - Cyan
      'hsl(160, 84%, 39%)', // Surface - Green
      'hsl(38, 92%, 50%)',  // Bottom - Orange
      'hsl(270, 60%, 60%)', // Convergence - Purple
    ];

    // Draw ray paths
    rayPathData.forEach((ray, index) => {
      ctx.strokeStyle = rayColors[index];
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      ray.path.forEach((point, i) => {
        const x = point.x * scaleX;
        const y = point.depth * scaleY;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    });

    // Draw platform
    const platformX = platform.position.x * scaleX;
    const platformY = platform.position.depth * scaleY;

    ctx.beginPath();
    ctx.arc(platformX, platformY, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'hsl(187, 100%, 42%)';
    ctx.fill();
    ctx.strokeStyle = 'hsl(187, 100%, 60%)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Sonar ping animation rings
    ctx.strokeStyle = 'hsl(187, 100%, 42%)';
    ctx.lineWidth = 1;
    for (let r = 20; r <= 60; r += 20) {
      ctx.globalAlpha = 1 - r / 80;
      ctx.beginPath();
      ctx.arc(platformX, platformY, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw targets
    targets.forEach((target) => {
      const targetX = target.position.x * scaleX;
      const targetY = target.position.depth * scaleY;

      ctx.beginPath();
      ctx.arc(targetX, targetY, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(0, 72%, 51%)';
      ctx.fill();
      ctx.strokeStyle = 'hsl(0, 72%, 65%)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Target label
      ctx.fillStyle = 'hsl(0, 72%, 65%)';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(target.name, targetX + 10, targetY - 5);
    });

    // Axis labels
    ctx.fillStyle = 'hsl(215, 20%, 55%)';
    ctx.font = '11px Inter';
    ctx.fillText('Range (m)', width / 2 - 30, height - 5);
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Depth (m)', -height / 2 - 30, 15);
    ctx.restore();

    // Scale indicators
    ctx.font = '9px JetBrains Mono';
    ctx.fillStyle = 'hsl(215, 20%, 45%)';
    for (let r = 0; r <= maxRange; r += 2000) {
      ctx.fillText(`${r}`, r * scaleX, height - 15);
    }
    for (let d = 0; d <= maxDepth; d += 100) {
      ctx.fillText(`${d}`, 5, d * scaleY + 12);
    }
  }, [platform, targets, environment]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[400px] rounded-lg"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}
