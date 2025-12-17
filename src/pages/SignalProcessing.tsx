import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Activity } from 'lucide-react';
import { useState } from 'react';
import { BeamPatternChart } from '@/components/charts/BeamPatternChart';
import { MatchedFilterChart } from '@/components/charts/MatchedFilterChart';
import { DopplerChart } from '@/components/charts/DopplerChart';

export default function SignalProcessing() {
  const [beamformingMethod, setBeamformingMethod] = useState<'delay-sum' | 'mvdr'>(
    'delay-sum'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Signal Processing</h2>
        <p className="text-muted-foreground">
          Beamforming, matched filtering, and Doppler analysis
        </p>
      </div>

      {/* Beamforming Section */}
      <Card className="data-panel">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Beamforming
            </div>
            <div className="flex items-center gap-4">
              <Label className="text-sm">Algorithm:</Label>
              <Select
                value={beamformingMethod}
                onValueChange={(value: 'delay-sum' | 'mvdr') =>
                  setBeamformingMethod(value)
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delay-sum">Delay-and-Sum</SelectItem>
                  <SelectItem value="mvdr">MVDR (Capon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="font-medium mb-4 flex items-center gap-2">
                Beam Pattern
                <Badge variant="outline" className="text-xs">
                  {beamformingMethod === 'delay-sum'
                    ? 'Conventional'
                    : 'Adaptive'}
                </Badge>
              </h4>
              <BeamPatternChart />
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Algorithm Properties</h4>
              <div className="space-y-3">
                <div className="rounded-lg bg-secondary/30 p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Method
                  </div>
                  <div className="font-mono text-primary">
                    {beamformingMethod === 'delay-sum'
                      ? 'Delay-and-Sum (Conventional)'
                      : 'Minimum Variance Distortionless Response'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/30 p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Main Lobe Width
                    </div>
                    <div className="font-mono text-xl font-bold text-primary">
                      {beamformingMethod === 'delay-sum' ? '12.5°' : '8.2°'}
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/30 p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Sidelobe Level
                    </div>
                    <div className="font-mono text-xl font-bold text-primary">
                      {beamformingMethod === 'delay-sum' ? '-13.2 dB' : '-25.4 dB'}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/30 p-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    Characteristics
                  </div>
                  <ul className="text-sm space-y-1">
                    {beamformingMethod === 'delay-sum' ? (
                      <>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Simple implementation
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Robust to model errors
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Fixed beam pattern
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Adaptive null steering
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Superior interference rejection
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Requires covariance estimation
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Matched Filter */}
        <Card className="data-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Matched Filter Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MatchedFilterChart />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary/30 p-3">
                <div className="text-xs text-muted-foreground">Peak Time</div>
                <div className="font-mono text-lg font-bold text-primary">
                  6.672 s
                </div>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <div className="text-xs text-muted-foreground">
                  Processing Gain
                </div>
                <div className="font-mono text-lg font-bold text-primary">
                  17.0 dB
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doppler Analysis */}
        <Card className="data-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Doppler Shift Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DopplerChart />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary/30 p-3">
                <div className="text-xs text-muted-foreground">
                  Doppler Shift
                </div>
                <div className="font-mono text-lg font-bold text-primary">
                  +152 Hz
                </div>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <div className="text-xs text-muted-foreground">
                  Target Velocity
                </div>
                <div className="font-mono text-lg font-bold text-primary">
                  6.5 m/s
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
