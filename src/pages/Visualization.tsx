import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MonitorDot, Radio, Waves, Activity } from 'lucide-react';
import { useState } from 'react';
import { PPIDisplay } from '@/components/visualization/PPIDisplay';
import { WaterfallDisplay } from '@/components/visualization/WaterfallDisplay';
import { SpectrogramDisplay } from '@/components/visualization/SpectrogramDisplay';

export default function Visualization() {
  const [showNoise, setShowNoise] = useState(true);
  const [showReverberation, setShowReverberation] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visualization</h2>
          <p className="text-muted-foreground">
            Real-time sonar displays and spectral analysis
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="noise-overlay"
              checked={showNoise}
              onCheckedChange={setShowNoise}
            />
            <Label htmlFor="noise-overlay" className="text-sm">
              Noise Overlay
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="reverb-overlay"
              checked={showReverberation}
              onCheckedChange={setShowReverberation}
            />
            <Label htmlFor="reverb-overlay" className="text-sm">
              Reverberation
            </Label>
          </div>
        </div>
      </div>

      <Tabs defaultValue="ppi" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="ppi" className="gap-2">
            <Radio className="h-4 w-4" />
            PPI Display
          </TabsTrigger>
          <TabsTrigger value="waterfall" className="gap-2">
            <Waves className="h-4 w-4" />
            Waterfall
          </TabsTrigger>
          <TabsTrigger value="spectrogram" className="gap-2">
            <Activity className="h-4 w-4" />
            Spectrogram
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ppi">
          <Card className="data-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MonitorDot className="h-5 w-5 text-primary" />
                Plan Position Indicator (PPI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PPIDisplay showNoise={showNoise} showReverberation={showReverberation} />
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">Range Scale</div>
                  <div className="font-mono text-lg font-bold text-primary">
                    10 km
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">Bearing</div>
                  <div className="font-mono text-lg font-bold text-primary">
                    0° - 360°
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">Contacts</div>
                  <div className="font-mono text-lg font-bold text-accent">3</div>
                </div>
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">Update Rate</div>
                  <div className="font-mono text-lg font-bold text-primary">
                    1 Hz
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waterfall">
          <Card className="data-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5 text-primary" />
                Waterfall Display (BTR)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WaterfallDisplay showNoise={showNoise} />
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">Time Window</div>
                  <div className="font-mono text-lg font-bold text-primary">
                    100 s
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">
                    Bearing Resolution
                  </div>
                  <div className="font-mono text-lg font-bold text-primary">1°</div>
                </div>
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">
                    Target Bearing
                  </div>
                  <div className="font-mono text-lg font-bold text-accent">045°</div>
                </div>
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">
                    Signal Strength
                  </div>
                  <div className="font-mono text-lg font-bold text-primary">
                    72 dB
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spectrogram">
          <Card className="data-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Time-Frequency Spectrogram (LOFAR)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpectrogramDisplay showNoise={showNoise} />
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">
                    Frequency Range
                  </div>
                  <div className="font-mono text-lg font-bold text-primary">
                    0-5 kHz
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">FFT Size</div>
                  <div className="font-mono text-lg font-bold text-primary">
                    4096
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">
                    Tonal Detection
                  </div>
                  <div className="font-mono text-lg font-bold text-accent">
                    2 lines
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/30 p-3">
                  <div className="text-xs text-muted-foreground">
                    Dominant Freq
                  </div>
                  <div className="font-mono text-lg font-bold text-primary">
                    2.3 kHz
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legend */}
      <Card className="data-panel">
        <CardHeader>
          <CardTitle className="text-sm">Display Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Own Ship</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-destructive" />
              <span className="text-sm text-muted-foreground">Contact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-warning" />
              <span className="text-sm text-muted-foreground">Unknown</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-accent/30" />
              <span className="text-sm text-muted-foreground">Detection Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-8 rounded"
                style={{
                  background: 'linear-gradient(90deg, hsl(240 80% 30%), hsl(60 80% 50%), hsl(0 80% 50%))',
                }}
              />
              <span className="text-sm text-muted-foreground">Signal Intensity</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
