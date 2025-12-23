import { useSonarStore } from '@/app/store/sonarStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  RotateCcw,
  Radio,
  Ear,
  Clock,
} from 'lucide-react';

export function Header() {
  const {
    scenarioName,
    simulation,
    runSimulation,
    pauseSimulation,
    resetSimulation,
    setSimulation,
  } = useSonarStore();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-6">
        {/* Project Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold tracking-tight">
            <span className="text-primary font-mono sonar-glow-text">SONAR</span>
            <span className="text-foreground/70 ml-2">DEMONSTRATOR</span>
          </h1>
          <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary">
            {scenarioName}
          </Badge>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Mode Toggle */}
          <div className="flex items-center gap-1 rounded-lg bg-secondary border border-primary/20 p-1">
            <Button
              variant={simulation.mode === 'active' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
              onClick={() => setSimulation({ mode: 'active' })}
            >
              <Radio className="h-4 w-4" />
              Active
            </Button>
            <Button
              variant={simulation.mode === 'passive' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
              onClick={() => setSimulation({ mode: 'passive' })}
            >
              <Ear className="h-4 w-4" />
              Passive
            </Button>
          </div>

          {/* Time Display */}
          <div className="flex items-center gap-2 font-mono text-sm px-3 py-1.5 rounded-lg bg-secondary/50 border border-primary/20">
            <Clock className="h-4 w-4 text-primary/70" />
            <span className="text-primary">
              T+{simulation.currentTime.toFixed(1)}s
            </span>
          </div>

          {/* Simulation Controls */}
          <div className="flex items-center gap-2">
            {simulation.isRunning ? (
              <Button
                variant="outline"
                size="sm"
                onClick={pauseSimulation}
                className="gap-2 border-primary/30 hover:bg-primary/10"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={runSimulation}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Run
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulation}
              className="gap-2 border-primary/30 hover:bg-primary/10"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-primary/20">
            <div
              className={`h-2 w-2 rounded-full ${
                simulation.isRunning
                  ? 'bg-detection-positive animate-pulse'
                  : 'bg-muted-foreground'
              }`}
            />
            <span className="text-xs font-mono text-foreground/70">
              {simulation.isRunning ? 'RUNNING' : 'IDLE'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
