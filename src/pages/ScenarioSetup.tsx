import { useSonarStore, Target } from '@/app/store/sonarStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Ship,
  Anchor,
  Plus,
  Trash2,
  Navigation,
  Gauge,
  Target as TargetIcon,
} from 'lucide-react';
import { useState } from 'react';

export default function ScenarioSetup() {
  const {
    scenarioName,
    setScenarioName,
    platform,
    setPlatform,
    targets,
    addTarget,
    removeTarget,
    updateTarget,
    simulation,
    setSimulation,
  } = useSonarStore();

  const [newTargetName, setNewTargetName] = useState('');

  const handleAddTarget = () => {
    const id = `target-${Date.now()}`;
    addTarget({
      id,
      type: 'submarine',
      name: newTargetName || `Contact ${targets.length + 1}`,
      position: { x: 5000, y: 3000, depth: 100 },
      speed: 5,
      course: 180,
      targetStrength: 15,
    });
    setNewTargetName('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Scenario Setup</h2>
        <p className="text-muted-foreground">
          Configure platform, targets, and simulation parameters
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scenario Info */}
        <Card className="data-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Scenario Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scenario-name">Scenario Name</Label>
              <Input
                id="scenario-name"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ping Mode</Label>
                <Select
                  value={simulation.pingMode}
                  onValueChange={(value: 'single' | 'multi') =>
                    setSimulation({ pingMode: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Ping</SelectItem>
                    <SelectItem value="multi">Multi Ping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sonar Mode</Label>
                <Select
                  value={simulation.mode}
                  onValueChange={(value: 'active' | 'passive') =>
                    setSimulation({ mode: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active Sonar</SelectItem>
                    <SelectItem value="passive">Passive Sonar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Configuration */}
        <Card className="data-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Anchor className="h-5 w-5 text-primary" />
              Platform Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform Type</Label>
                <Select
                  value={platform.type}
                  onValueChange={(value: 'ship' | 'submarine' | 'auv') =>
                    setPlatform({ type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ship">Surface Ship</SelectItem>
                    <SelectItem value="submarine">Submarine</SelectItem>
                    <SelectItem value="auv">AUV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input
                  id="platform-name"
                  value={platform.name}
                  onChange={(e) => setPlatform({ name: e.target.value })}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>X Position (m)</Label>
                <Input
                  type="number"
                  value={platform.position.x}
                  onChange={(e) =>
                    setPlatform({
                      position: { ...platform.position, x: Number(e.target.value) },
                    })
                  }
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Y Position (m)</Label>
                <Input
                  type="number"
                  value={platform.position.y}
                  onChange={(e) =>
                    setPlatform({
                      position: { ...platform.position, y: Number(e.target.value) },
                    })
                  }
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Depth (m)</Label>
                <Input
                  type="number"
                  value={platform.position.depth}
                  onChange={(e) =>
                    setPlatform({
                      position: { ...platform.position, depth: Number(e.target.value) },
                    })
                  }
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Speed: {platform.speed} knots</Label>
              <Slider
                value={[platform.speed]}
                onValueChange={([value]) => setPlatform({ speed: value })}
                min={0}
                max={30}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <Label>Heading: {platform.heading}°</Label>
              <Slider
                value={[platform.heading]}
                onValueChange={([value]) => setPlatform({ heading: value })}
                min={0}
                max={359}
                step={1}
                className="py-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target Configuration */}
      <Card className="data-panel">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TargetIcon className="h-5 w-5 text-primary" />
              Target Configuration
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Target name..."
                value={newTargetName}
                onChange={(e) => setNewTargetName(e.target.value)}
                className="w-48 h-9"
              />
              <Button size="sm" onClick={handleAddTarget} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Target
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {targets.map((target) => (
              <TargetCard
                key={target.id}
                target={target}
                onUpdate={(updates) => updateTarget(target.id, updates)}
                onRemove={() => removeTarget(target.id)}
              />
            ))}
            {targets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No targets configured. Add a target to begin simulation.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TargetCard({
  target,
  onUpdate,
  onRemove,
}: {
  target: Target;
  onUpdate: (updates: Partial<Target>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Ship className="h-5 w-5 text-primary" />
          <Input
            value={target.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="font-mono w-48 h-8"
          />
          <Badge variant="outline" className="capitalize">
            {target.type}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="space-y-1">
          <Label className="text-xs">Type</Label>
          <Select
            value={target.type}
            onValueChange={(value: Target['type']) => onUpdate({ type: value })}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="submarine">Submarine</SelectItem>
              <SelectItem value="ship">Ship</SelectItem>
              <SelectItem value="torpedo">Torpedo</SelectItem>
              <SelectItem value="auv">AUV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">X (m)</Label>
          <Input
            type="number"
            value={target.position.x}
            onChange={(e) =>
              onUpdate({
                position: { ...target.position, x: Number(e.target.value) },
              })
            }
            className="h-8 font-mono"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Y (m)</Label>
          <Input
            type="number"
            value={target.position.y}
            onChange={(e) =>
              onUpdate({
                position: { ...target.position, y: Number(e.target.value) },
              })
            }
            className="h-8 font-mono"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Depth (m)</Label>
          <Input
            type="number"
            value={target.position.depth}
            onChange={(e) =>
              onUpdate({
                position: { ...target.position, depth: Number(e.target.value) },
              })
            }
            className="h-8 font-mono"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Speed (kts)</Label>
          <Input
            type="number"
            value={target.speed}
            onChange={(e) => onUpdate({ speed: Number(e.target.value) })}
            className="h-8 font-mono"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Course (°)</Label>
          <Input
            type="number"
            value={target.course}
            onChange={(e) => onUpdate({ course: Number(e.target.value) })}
            className="h-8 font-mono"
          />
        </div>
      </div>
    </div>
  );
}
