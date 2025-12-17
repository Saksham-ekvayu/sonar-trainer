import { useRef, useEffect } from 'react';
import { ppiData } from '@/data/mockSimulationData';
import { useSonarStore } from '@/app/store/sonarStore';

interface PPIDisplayProps {
  showNoise: boolean;
  showReverberation: boolean;
}

export function PPIDisplay({ showNoise, showReverberation }: PPIDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { platform, simulation } = useSonarStore();
  const animationRef = useRef<number>();
  const sweepAngleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 500;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);

    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size / 2 - 40;

    const draw = () => {
      // Clear with fade effect for trailing
      ctx.fillStyle = 'hsla(222, 47%, 6%, 0.15)';
      ctx.fillRect(0, 0, size, size);

      // Draw range rings
      ctx.strokeStyle = 'hsl(222, 30%, 20%)';
      ctx.lineWidth = 0.5;
      for (let r = 1; r <= 5; r++) {
        const radius = (r / 5) * maxRadius;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Range labels
        ctx.fillStyle = 'hsl(215, 20%, 40%)';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(`${r * 2}km`, centerX + 5, centerY - radius + 12);
      }

      // Draw bearing lines
      for (let angle = 0; angle < 360; angle += 30) {
        const rad = (angle * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + maxRadius * Math.sin(rad),
          centerY - maxRadius * Math.cos(rad)
        );
        ctx.stroke();

        // Bearing labels
        const labelRadius = maxRadius + 15;
        ctx.fillStyle = 'hsl(215, 20%, 50%)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          `${angle.toString().padStart(3, '0')}°`,
          centerX + labelRadius * Math.sin(rad),
          centerY - labelRadius * Math.cos(rad)
        );
      }

      // Draw noise field if enabled
      if (showNoise) {
        ppiData.noiseField.forEach((sector) => {
          const startAngle = ((sector.bearing - 5) * Math.PI) / 180;
          const endAngle = ((sector.bearing + 5) * Math.PI) / 180;
          const intensity = (sector.level - 40) / 40;

          ctx.fillStyle = `hsla(222, 60%, ${30 + intensity * 20}%, ${
            0.1 + intensity * 0.15
          })`;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, maxRadius, startAngle - Math.PI / 2, endAngle - Math.PI / 2);
          ctx.closePath();
          ctx.fill();
        });
      }

      // Draw reverberation rings if enabled
      if (showReverberation) {
        for (let r = 0.2; r <= 1; r += 0.2) {
          const radius = r * maxRadius;
          const alpha = 0.1 * (1 - r);
          ctx.strokeStyle = `hsla(187, 100%, 42%, ${alpha})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Draw sweep line
      if (simulation.isRunning) {
        const sweepRad = (sweepAngleRef.current * Math.PI) / 180;
        
        // Sweep glow
        const gradient = ctx.createLinearGradient(
          centerX,
          centerY,
          centerX + maxRadius * Math.sin(sweepRad),
          centerY - maxRadius * Math.cos(sweepRad)
        );
        gradient.addColorStop(0, 'hsla(187, 100%, 42%, 0.8)');
        gradient.addColorStop(1, 'hsla(187, 100%, 42%, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + maxRadius * Math.sin(sweepRad),
          centerY - maxRadius * Math.cos(sweepRad)
        );
        ctx.stroke();

        // Sweep trail
        for (let i = 1; i <= 30; i++) {
          const trailRad = ((sweepAngleRef.current - i) * Math.PI) / 180;
          ctx.strokeStyle = `hsla(187, 100%, 42%, ${0.02 * (30 - i) / 30})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(
            centerX + maxRadius * Math.sin(trailRad),
            centerY - maxRadius * Math.cos(trailRad)
          );
          ctx.stroke();
        }

        sweepAngleRef.current = (sweepAngleRef.current + 2) % 360;
      }

      // Draw contacts
      ppiData.contacts.forEach((contact) => {
        const rad = (contact.bearing * Math.PI) / 180;
        const normalizedRange = contact.range / 10000;
        const x = centerX + normalizedRange * maxRadius * Math.sin(rad);
        const y = centerY - normalizedRange * maxRadius * Math.cos(rad);

        // Contact blip
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        
        const contactColor =
          contact.type === 'submarine'
            ? 'hsl(0, 72%, 51%)'
            : contact.type === 'ship'
            ? 'hsl(38, 92%, 50%)'
            : 'hsl(270, 60%, 60%)';

        ctx.fillStyle = contactColor;
        ctx.fill();

        // Blip glow
        ctx.shadowColor = contactColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Contact label
        ctx.fillStyle = 'hsl(210, 40%, 96%)';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(contact.id, x + 10, y - 5);
        ctx.font = '9px JetBrains Mono';
        ctx.fillText(`${contact.bearing}° ${(contact.range / 1000).toFixed(1)}km`, x + 10, y + 7);
      });

      // Draw own ship
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(187, 100%, 42%)';
      ctx.fill();

      // Own ship heading indicator
      const headingRad = (platform.heading * Math.PI) / 180;
      ctx.strokeStyle = 'hsl(187, 100%, 60%)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + 30 * Math.sin(headingRad),
        centerY - 30 * Math.cos(headingRad)
      );
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [platform.heading, simulation.isRunning, showNoise, showReverberation]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-[500px] h-[500px] mx-auto rounded-full border border-border"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}
