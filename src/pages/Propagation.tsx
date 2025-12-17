import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSonarStore } from '@/app/store/sonarStore';
import { Activity, Play, Pause, RefreshCw } from 'lucide-react';
import { RayPathVisualization } from '@/components/visualization/RayPathVisualization';
import { TLHeatmap } from '@/components/visualization/TLHeatmap';

export default function Propagation() {
  const { simulation, runSimulation, pauseSimulation, resetSimulation } =
    useSonarStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Propagation</h2>
          <p className="text-muted-foreground">
            Visualize sound ray paths and transmission loss distribution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={simulation.isRunning ? 'default' : 'secondary'}
            className="gap-1"
          >
            <div
              className={`h-2 w-2 rounded-full ${
                simulation.isRunning ? 'bg-accent animate-pulse' : 'bg-muted-foreground'
              }`}
            />
            {simulation.isRunning ? 'Simulating' : 'Idle'}
          </Badge>
          {simulation.isRunning ? (
            <Button variant="outline" size="sm" onClick={pauseSimulation}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={runSimulation}>
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={resetSimulation}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Ray Path Visualization */}
      <Card className="data-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Sound Ray Paths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RayPathVisualization />
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-8 rounded" style={{ backgroundColor: 'hsl(187 100% 42%)' }} />
              <span className="text-xs text-muted-foreground">Direct Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-8 rounded" style={{ backgroundColor: 'hsl(160 84% 39%)' }} />
              <span className="text-xs text-muted-foreground">Surface Reflected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-8 rounded" style={{ backgroundColor: 'hsl(38 92% 50%)' }} />
              <span className="text-xs text-muted-foreground">Bottom Reflected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-8 rounded" style={{ backgroundColor: 'hsl(270 60% 60%)' }} />
              <span className="text-xs text-muted-foreground">Convergence Zone</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transmission Loss Heatmap */}
      <Card className="data-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Transmission Loss Distribution (Range vs Depth)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TLHeatmap />
        </CardContent>
      </Card>

      {/* Multipath Info */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="data-panel">
          <CardContent className="pt-4">
            <div className="stat-label">Direct Path</div>
            <div className="stat-value">65.2 dB</div>
            <div className="text-xs text-muted-foreground mt-1">Arrival: 6.67s</div>
          </CardContent>
        </Card>
        <Card className="data-panel">
          <CardContent className="pt-4">
            <div className="stat-label">Surface Reflected</div>
            <div className="stat-value">68.5 dB</div>
            <div className="text-xs text-muted-foreground mt-1">Arrival: 6.72s</div>
          </CardContent>
        </Card>
        <Card className="data-panel">
          <CardContent className="pt-4">
            <div className="stat-label">Bottom Reflected</div>
            <div className="stat-value">72.1 dB</div>
            <div className="text-xs text-muted-foreground mt-1">Arrival: 6.85s</div>
          </CardContent>
        </Card>
        <Card className="data-panel">
          <CardContent className="pt-4">
            <div className="stat-label">Convergence Zone</div>
            <div className="stat-value">58.3 dB</div>
            <div className="text-xs text-muted-foreground mt-1">Arrival: 7.12s</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
