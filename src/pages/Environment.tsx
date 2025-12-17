import { useSonarStore } from '@/app/store/sonarStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Waves, Volume2, Thermometer, Ship, Wind } from 'lucide-react';
import { SSPChart } from '@/components/charts/SSPChart';
import { NoiseSpectrumChart } from '@/components/charts/NoiseSpectrumChart';

export default function Environment() {
  const { environment, setEnvironment } = useSonarStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Environment</h2>
        <p className="text-muted-foreground">
          Configure oceanographic parameters and ambient noise conditions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sound Speed Profile */}
        <Card className="data-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              Sound Speed Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SSPChart />
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-secondary/30 p-3">
                <span className="text-muted-foreground">Surface Speed:</span>
                <span className="ml-2 font-mono text-primary">
                  {environment.soundSpeedProfile[0]?.speed || 1520} m/s
                </span>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <span className="text-muted-foreground">Min Speed:</span>
                <span className="ml-2 font-mono text-primary">
                  {Math.min(...environment.soundSpeedProfile.map((p) => p.speed))} m/s
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bathymetry & Seabed */}
        <Card className="data-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-primary" />
              Bathymetry & Seabed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Water Depth: {environment.waterDepth}m</Label>
              <Slider
                value={[environment.waterDepth]}
                onValueChange={([value]) => setEnvironment({ waterDepth: value })}
                min={50}
                max={5000}
                step={50}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Shallow (50m)</span>
                <span>Deep (5000m)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Seabed Type</Label>
              <Select
                value={environment.seabedType}
                onValueChange={(value: 'sand' | 'rock' | 'mud' | 'gravel') =>
                  setEnvironment({ seabedType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sand">Sand</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="mud">Mud</SelectItem>
                  <SelectItem value="gravel">Gravel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Surface Condition (Sea State): {environment.surfaceCondition}</Label>
              <Slider
                value={[environment.surfaceCondition]}
                onValueChange={([value]) =>
                  setEnvironment({ surfaceCondition: value })
                }
                min={0}
                max={9}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Calm (0)</span>
                <span>Severe (9)</span>
              </div>
            </div>

            <div className="rounded-lg bg-secondary/30 p-4 space-y-2">
              <h4 className="font-medium text-sm">Seabed Properties</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Bottom Loss:</span>
                  <span className="ml-2 font-mono text-primary">
                    {environment.seabedType === 'rock'
                      ? '2-5 dB'
                      : environment.seabedType === 'sand'
                      ? '5-10 dB'
                      : environment.seabedType === 'mud'
                      ? '10-20 dB'
                      : '3-8 dB'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Reflectivity:</span>
                  <span className="ml-2 font-mono text-primary">
                    {environment.seabedType === 'rock'
                      ? 'High'
                      : environment.seabedType === 'sand'
                      ? 'Medium'
                      : environment.seabedType === 'mud'
                      ? 'Low'
                      : 'Medium-High'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ambient Noise */}
        <Card className="data-panel lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Ambient Noise Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Ship className="h-4 w-4 text-muted-foreground" />
                    <Label>
                      Shipping Noise: {environment.ambientNoise.shipping} dB
                    </Label>
                  </div>
                  <Slider
                    value={[environment.ambientNoise.shipping]}
                    onValueChange={([value]) =>
                      setEnvironment({
                        ambientNoise: { ...environment.ambientNoise, shipping: value },
                      })
                    }
                    min={40}
                    max={90}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-muted-foreground" />
                    <Label>Wind Noise: {environment.ambientNoise.wind} dB</Label>
                  </div>
                  <Slider
                    value={[environment.ambientNoise.wind]}
                    onValueChange={([value]) =>
                      setEnvironment({
                        ambientNoise: { ...environment.ambientNoise, wind: value },
                      })
                    }
                    min={30}
                    max={80}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Biological Noise: {environment.ambientNoise.biological} dB
                  </Label>
                  <Slider
                    value={[environment.ambientNoise.biological]}
                    onValueChange={([value]) =>
                      setEnvironment({
                        ambientNoise: { ...environment.ambientNoise, biological: value },
                      })
                    }
                    min={20}
                    max={70}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Thermal Noise: {environment.ambientNoise.thermal} dB</Label>
                  <Slider
                    value={[environment.ambientNoise.thermal]}
                    onValueChange={([value]) =>
                      setEnvironment({
                        ambientNoise: { ...environment.ambientNoise, thermal: value },
                      })
                    }
                    min={20}
                    max={60}
                    step={1}
                  />
                </div>

                <div className="rounded-lg bg-secondary/30 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Ambient Noise Level
                    </span>
                    <span className="font-mono text-xl font-bold text-primary">
                      {Math.round(
                        10 *
                          Math.log10(
                            Math.pow(10, environment.ambientNoise.shipping / 10) +
                              Math.pow(10, environment.ambientNoise.wind / 10) +
                              Math.pow(10, environment.ambientNoise.biological / 10) +
                              Math.pow(10, environment.ambientNoise.thermal / 10)
                          )
                      )}{' '}
                      dB
                    </span>
                  </div>
                </div>
              </div>

              <NoiseSpectrumChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
