import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Target } from 'lucide-react';
import { useState } from 'react';
import { TSPolarChart } from '@/components/charts/TSPolarChart';
import { TSFrequencyChart } from '@/components/charts/TSFrequencyChart';

export default function TargetStrength() {
  const [targetType, setTargetType] = useState<'submarine' | 'ship' | 'torpedo'>(
    'submarine'
  );
  const [frequency, setFrequency] = useState(3500);
  const [aspectAngle, setAspectAngle] = useState(90);

  const targetProperties = {
    submarine: {
      length: 110,
      beam: 12,
      typicalTS: '10-25 dB',
      description: 'Nuclear-powered attack submarine',
    },
    ship: {
      length: 150,
      beam: 20,
      typicalTS: '15-35 dB',
      description: 'Surface combatant vessel',
    },
    torpedo: {
      length: 6,
      beam: 0.53,
      typicalTS: '0-10 dB',
      description: 'Heavyweight torpedo',
    },
  };

  const currentTarget = targetProperties[targetType];

  // Calculate TS based on aspect angle (simplified model)
  const calculateTS = (angle: number): number => {
    const angleRad = (angle * Math.PI) / 180;
    const baseTS = targetType === 'submarine' ? 15 : targetType === 'ship' ? 25 : 5;
    const aspectFactor = Math.abs(Math.sin(angleRad));
    return baseTS + aspectFactor * 10;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Target Strength</h2>
        <p className="text-muted-foreground">
          Analyze acoustic reflectivity of underwater targets
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Target Selection */}
        <Card className="data-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Target Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Target Type</Label>
              <Select
                value={targetType}
                onValueChange={(value: 'submarine' | 'ship' | 'torpedo') =>
                  setTargetType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submarine">Submarine</SelectItem>
                  <SelectItem value="ship">Surface Ship</SelectItem>
                  <SelectItem value="torpedo">Torpedo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Frequency: {frequency} Hz</Label>
              <Slider
                value={[frequency]}
                onValueChange={([value]) => setFrequency(value)}
                min={500}
                max={10000}
                step={100}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>500 Hz</span>
                <span>10 kHz</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Aspect Angle: {aspectAngle}°</Label>
              <Slider
                value={[aspectAngle]}
                onValueChange={([value]) => setAspectAngle(value)}
                min={0}
                max={180}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Bow (0°)</span>
                <span>Beam (90°)</span>
                <span>Stern (180°)</span>
              </div>
            </div>

            <div className="rounded-lg bg-secondary/30 p-4 space-y-2">
              <h4 className="font-medium text-sm">Target Properties</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Length:</span>
                  <span className="ml-1 font-mono text-primary">
                    {currentTarget.length}m
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Beam:</span>
                  <span className="ml-1 font-mono text-primary">
                    {currentTarget.beam}m
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Typical TS:</span>
                  <span className="ml-1 font-mono text-primary">
                    {currentTarget.typicalTS}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {currentTarget.description}
              </p>
            </div>

            <div className="rounded-lg bg-primary/10 border border-primary/30 p-4">
              <div className="text-sm text-muted-foreground">
                Calculated Target Strength
              </div>
              <div className="font-mono text-3xl font-bold text-primary sonar-glow-text">
                {calculateTS(aspectAngle).toFixed(1)} dB
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                at {aspectAngle}° aspect, {frequency} Hz
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Polar Plot */}
        <Card className="data-panel lg:col-span-2">
          <CardHeader>
            <CardTitle>Aspect Angle vs Target Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <TSPolarChart targetType={targetType} />
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-8 rounded"
                  style={{ backgroundColor: 'hsl(187 100% 42%)' }}
                />
                <span className="text-xs text-muted-foreground">
                  Port Side (0° - 180°)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-8 rounded"
                  style={{ backgroundColor: 'hsl(160 84% 39%)' }}
                />
                <span className="text-xs text-muted-foreground">
                  Starboard (180° - 360°)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Frequency Dependency */}
      <Card className="data-panel">
        <CardHeader>
          <CardTitle>Frequency Dependency</CardTitle>
        </CardHeader>
        <CardContent>
          <TSFrequencyChart targetType={targetType} />
        </CardContent>
      </Card>
    </div>
  );
}
