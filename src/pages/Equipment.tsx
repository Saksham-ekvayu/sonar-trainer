import { useSonarStore } from '@/app/store/sonarStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Radio, Mic, AlertTriangle, Zap, Waves } from 'lucide-react';
import { BeamPatternChart } from '@/components/charts/BeamPatternChart';

export default function Equipment() {
  const { transmitter, setTransmitter, receiver, setReceiver, simulation } =
    useSonarStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Equipment</h2>
        <p className="text-muted-foreground">
          Configure sonar transmitter and receiver parameters
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Transmitter Settings */}
        <Card className="data-panel">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-primary" />
                Transmitter (Projector)
              </div>
              {simulation.mode === 'passive' && (
                <Badge variant="secondary" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Inactive in Passive Mode
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frequency (Hz)</Label>
                <Input
                  type="number"
                  value={transmitter.frequency}
                  onChange={(e) =>
                    setTransmitter({ frequency: Number(e.target.value) })
                  }
                  className="font-mono"
                  disabled={simulation.mode === 'passive'}
                />
              </div>
              <div className="space-y-2">
                <Label>Bandwidth (Hz)</Label>
                <Input
                  type="number"
                  value={transmitter.bandwidth}
                  onChange={(e) =>
                    setTransmitter({ bandwidth: Number(e.target.value) })
                  }
                  className="font-mono"
                  disabled={simulation.mode === 'passive'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pulse Width (ms)</Label>
                <Input
                  type="number"
                  value={transmitter.pulseWidth}
                  onChange={(e) =>
                    setTransmitter({ pulseWidth: Number(e.target.value) })
                  }
                  className="font-mono"
                  disabled={simulation.mode === 'passive'}
                />
              </div>
              <div className="space-y-2">
                <Label>Waveform</Label>
                <Select
                  value={transmitter.waveform}
                  onValueChange={(value: 'CW' | 'LFM' | 'SFM') =>
                    setTransmitter({ waveform: value })
                  }
                  disabled={simulation.mode === 'passive'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CW">CW (Continuous Wave)</SelectItem>
                    <SelectItem value="LFM">LFM (Linear FM)</SelectItem>
                    <SelectItem value="SFM">SFM (Stepped FM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Source Level: {transmitter.sourceLevel} dB re 1μPa @ 1m</Label>
              <Slider
                value={[transmitter.sourceLevel]}
                onValueChange={([value]) => setTransmitter({ sourceLevel: value })}
                min={180}
                max={240}
                step={1}
                disabled={simulation.mode === 'passive'}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low Power</span>
                <span>High Power</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Beamwidth: {transmitter.beamwidth}°</Label>
              <Slider
                value={[transmitter.beamwidth]}
                onValueChange={([value]) => setTransmitter({ beamwidth: value })}
                min={1}
                max={90}
                step={1}
                disabled={simulation.mode === 'passive'}
              />
            </div>

            <div className="rounded-lg bg-secondary/30 p-4 space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Waveform Properties
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Range Resolution:</span>
                  <span className="ml-2 font-mono text-primary">
                    {transmitter.waveform === 'CW'
                      ? `${((1500 * transmitter.pulseWidth) / 2000).toFixed(1)} m`
                      : `${((1500 / transmitter.bandwidth) / 2).toFixed(1)} m`}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Processing Gain:</span>
                  <span className="ml-2 font-mono text-primary">
                    {transmitter.waveform === 'CW'
                      ? '0 dB'
                      : `${(10 * Math.log10(transmitter.bandwidth * transmitter.pulseWidth / 1000)).toFixed(1)} dB`}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receiver Settings */}
        <Card className="data-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              Receiver (Hydrophone Array)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Array Type</Label>
                <Select
                  value={receiver.arrayType}
                  onValueChange={(value: 'linear' | 'planar' | 'cylindrical') =>
                    setReceiver({ arrayType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear Array</SelectItem>
                    <SelectItem value="planar">Planar Array</SelectItem>
                    <SelectItem value="cylindrical">Cylindrical Array</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Number of Elements</Label>
                <Input
                  type="number"
                  value={receiver.numElements}
                  onChange={(e) =>
                    setReceiver({ numElements: Number(e.target.value) })
                  }
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Element Spacing: {receiver.elementSpacing}m</Label>
              <Slider
                value={[receiver.elementSpacing * 100]}
                onValueChange={([value]) =>
                  setReceiver({ elementSpacing: value / 100 })
                }
                min={5}
                max={50}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.05m</span>
                <span>0.50m</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Directivity Index: {receiver.directivityIndex} dB</Label>
              <Slider
                value={[receiver.directivityIndex]}
                onValueChange={([value]) => setReceiver({ directivityIndex: value })}
                min={10}
                max={40}
                step={1}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label>Fault Simulation</Label>
                <p className="text-xs text-muted-foreground">
                  Simulate faulty hydrophone elements
                </p>
              </div>
              <Switch
                checked={receiver.faultSimulation}
                onCheckedChange={(checked) =>
                  setReceiver({ faultSimulation: checked })
                }
              />
            </div>

            {receiver.faultSimulation && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4">
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>3 elements simulated as faulty</span>
                </div>
              </div>
            )}

            <div className="rounded-lg bg-secondary/30 p-4 space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Waves className="h-4 w-4 text-primary" />
                Array Properties
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Array Length:</span>
                  <span className="ml-2 font-mono text-primary">
                    {((receiver.numElements - 1) * receiver.elementSpacing).toFixed(2)} m
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Beamwidth:</span>
                  <span className="ml-2 font-mono text-primary">
                    {(
                      (57.3 * 1500) /
                      (transmitter.frequency * (receiver.numElements - 1) * receiver.elementSpacing)
                    ).toFixed(1)}°
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Beam Pattern */}
        <Card className="data-panel lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              Beam Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BeamPatternChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
