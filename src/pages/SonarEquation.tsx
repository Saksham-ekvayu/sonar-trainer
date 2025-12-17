import { useSonarStore } from '@/app/store/sonarStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Calculator, Info, CheckCircle2, XCircle } from 'lucide-react';

export default function SonarEquation() {
  const { sonarEquation, simulation } = useSonarStore();

  const equations = {
    active: {
      formula: 'SE = SL - 2TL + TS - (NL - DI)',
      description:
        'Signal Excess for active sonar equals Source Level minus two-way Transmission Loss plus Target Strength minus effective Noise Level',
    },
    passive: {
      formula: 'SE = SL - TL - (NL - DI)',
      description:
        'Signal Excess for passive sonar equals Source Level minus one-way Transmission Loss minus effective Noise Level',
    },
  };

  const currentEquation = equations[simulation.mode];

  const terms = [
    {
      symbol: 'SL',
      name: 'Source Level',
      value: sonarEquation.sourceLevel,
      unit: 'dB re 1μPa @ 1m',
      description:
        'The acoustic intensity of the sonar transmitter at 1 meter from the source',
      positive: true,
    },
    {
      symbol: 'TL',
      name: 'Transmission Loss',
      value: sonarEquation.transmissionLoss,
      unit: 'dB',
      description:
        'Sound energy lost due to spreading and absorption as it travels through water',
      positive: false,
      multiplier: simulation.mode === 'active' ? 2 : 1,
    },
    {
      symbol: 'TS',
      name: 'Target Strength',
      value: sonarEquation.targetStrength,
      unit: 'dB',
      description:
        'Measure of the acoustic reflectivity of the target (only for active sonar)',
      positive: true,
      activeOnly: true,
    },
    {
      symbol: 'NL',
      name: 'Noise Level',
      value: sonarEquation.noiseLevel,
      unit: 'dB',
      description:
        'Ambient acoustic noise in the ocean from shipping, biologics, weather, etc.',
      positive: false,
    },
    {
      symbol: 'DI',
      name: 'Directivity Index',
      value: sonarEquation.directivityIndex,
      unit: 'dB',
      description:
        'Array gain from the receiver hydrophone array spatial filtering',
      positive: true,
    },
  ];

  const results = [
    {
      name: 'Received Level (RL)',
      value: sonarEquation.receivedLevel,
      description: 'Signal strength at the receiver',
    },
    {
      name: 'Echo Level (EL)',
      value: sonarEquation.echoLevel,
      description: 'Level of the echo returned from target (active only)',
    },
    {
      name: 'Signal-to-Noise Ratio (SNR)',
      value: sonarEquation.signalToNoiseRatio,
      description: 'Ratio of signal power to noise power',
      highlight: true,
    },
    {
      name: 'Figure of Merit (FOM)',
      value: sonarEquation.figureOfMerit,
      description: 'Maximum allowable TL for detection',
    },
    {
      name: 'Detection Threshold (DT)',
      value: sonarEquation.detectionThreshold,
      description: 'Minimum SNR required for detection',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sonar Equation</h2>
        <p className="text-muted-foreground">
          Real-time calculation of sonar performance parameters
        </p>
      </div>

      {/* Equation Display */}
      <Card className="data-panel">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              {simulation.mode === 'active' ? 'Active' : 'Passive'} Sonar Equation
            </div>
            <Badge variant="outline" className="font-mono">
              {simulation.mode.toUpperCase()} MODE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-secondary/30 p-6 text-center">
            <div className="font-mono text-2xl text-primary sonar-glow-text mb-4">
              {currentEquation.formula}
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {currentEquation.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Equation Terms */}
      <Card className="data-panel">
        <CardHeader>
          <CardTitle>Equation Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {terms.map((term) => {
              if (term.activeOnly && simulation.mode === 'passive') return null;

              return (
                <div
                  key={term.symbol}
                  className="rounded-lg border border-border bg-secondary/20 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="equation-term">{term.symbol}</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          {term.description}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Badge
                      variant={term.positive ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {term.positive ? '+' : '-'}
                      {term.multiplier ? `×${term.multiplier}` : ''}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {term.name}
                  </div>
                  <div className="font-mono text-2xl font-bold text-primary">
                    {term.value.toFixed(1)}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {term.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="data-panel">
          <CardHeader>
            <CardTitle>Calculated Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.name}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.highlight
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-secondary/30'
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{result.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {result.description}
                    </div>
                  </div>
                  <div
                    className={`font-mono text-xl font-bold ${
                      result.highlight ? 'text-primary sonar-glow-text' : ''
                    }`}
                  >
                    {result.value.toFixed(1)} dB
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detection Result */}
        <Card className="data-panel">
          <CardHeader>
            <CardTitle>Detection Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`rounded-lg p-6 text-center ${
                sonarEquation.isDetected
                  ? 'bg-accent/10 border border-accent/30'
                  : 'bg-destructive/10 border border-destructive/30'
              }`}
            >
              {sonarEquation.isDetected ? (
                <>
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-accent" />
                  <div className="text-2xl font-bold detection-positive">
                    TARGET DETECTED
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    SNR exceeds detection threshold
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
                  <div className="text-2xl font-bold detection-negative">
                    NO DETECTION
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    SNR below detection threshold
                  </p>
                </>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Signal-to-Noise Ratio</span>
                <span className="font-mono text-primary">
                  {sonarEquation.signalToNoiseRatio.toFixed(1)} dB
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Detection Threshold</span>
                <span className="font-mono">
                  {sonarEquation.detectionThreshold.toFixed(1)} dB
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Margin</span>
                <span
                  className={`font-mono font-bold ${
                    sonarEquation.signalToNoiseRatio -
                      sonarEquation.detectionThreshold >=
                    0
                      ? 'text-accent'
                      : 'text-destructive'
                  }`}
                >
                  {(
                    sonarEquation.signalToNoiseRatio -
                    sonarEquation.detectionThreshold
                  ).toFixed(1)}{' '}
                  dB
                </span>
              </div>
            </div>

            {/* Detection Probability Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Detection Probability</span>
                <span className="font-mono">
                  {Math.min(
                    100,
                    Math.max(
                      0,
                      50 +
                        (sonarEquation.signalToNoiseRatio -
                          sonarEquation.detectionThreshold) *
                          5
                    )
                  ).toFixed(0)}
                  %
                </span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    sonarEquation.isDetected ? 'bg-accent' : 'bg-destructive'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        50 +
                          (sonarEquation.signalToNoiseRatio -
                            sonarEquation.detectionThreshold) *
                            5
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
