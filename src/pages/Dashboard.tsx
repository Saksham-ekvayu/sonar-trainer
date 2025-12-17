import { useSonarStore } from '@/app/store/sonarStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Anchor,
  Target,
  Waves,
  Radio,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { TLChart } from '@/components/charts/TLChart';
import { SNRChart } from '@/components/charts/SNRChart';

export default function Dashboard() {
  const { scenarioName, platform, targets, environment, simulation, sonarEquation } =
    useSonarStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Real-time overview of sonar simulation parameters and detection status
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Current Scenario */}
        <Card className="data-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Scenario
            </CardTitle>
            <Anchor className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="stat-value text-lg">{scenarioName}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="font-mono text-xs">
                {platform.type.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {platform.name}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Environment Summary */}
        <Card className="data-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Environment
            </CardTitle>
            <Waves className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="stat-value text-lg">{environment.waterDepth}m</div>
            <p className="text-xs text-muted-foreground mt-1">
              Water Depth • {environment.seabedType} seabed
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                Sea State {environment.surfaceCondition}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sonar Mode */}
        <Card className="data-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sonar Type
            </CardTitle>
            <Radio className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="stat-value text-lg capitalize">{simulation.mode}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {simulation.mode === 'active' ? 'Transmit & Receive' : 'Listen Only'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={simulation.isRunning ? 'default' : 'secondary'}
                className="text-xs"
              >
                {simulation.isRunning ? 'ACTIVE' : 'STANDBY'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Detection Status */}
        <Card className="data-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Detection Status
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {sonarEquation.isDetected ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                  <span className="stat-value text-lg detection-positive">
                    DETECTED
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-destructive" />
                  <span className="stat-value text-lg detection-negative">
                    NOT DETECTED
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              SNR: {sonarEquation.signalToNoiseRatio.toFixed(1)} dB •{' '}
              {targets.length} target(s)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Parameters */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <ParameterCard label="Source Level" value={sonarEquation.sourceLevel} unit="dB" />
        <ParameterCard
          label="Transmission Loss"
          value={sonarEquation.transmissionLoss}
          unit="dB"
        />
        <ParameterCard
          label="Target Strength"
          value={sonarEquation.targetStrength}
          unit="dB"
        />
        <ParameterCard label="Noise Level" value={sonarEquation.noiseLevel} unit="dB" />
        <ParameterCard
          label="Directivity Index"
          value={sonarEquation.directivityIndex}
          unit="dB"
        />
        <ParameterCard label="Figure of Merit" value={sonarEquation.figureOfMerit} unit="dB" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="data-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Transmission Loss vs Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TLChart />
          </CardContent>
        </Card>

        <Card className="data-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              SNR vs Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SNRChart />
          </CardContent>
        </Card>
      </div>

      {/* Target List */}
      <Card className="data-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Active Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {targets.map((target) => (
              <div
                key={target.id}
                className="rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-semibold text-primary">
                    {target.name}
                  </span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {target.type}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Position:</span>
                    <span className="ml-1 font-mono">
                      ({target.position.x}, {target.position.y})
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Depth:</span>
                    <span className="ml-1 font-mono">{target.position.depth}m</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Speed:</span>
                    <span className="ml-1 font-mono">{target.speed} kts</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Course:</span>
                    <span className="ml-1 font-mono">{target.course}°</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ParameterCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <Card className="data-panel">
      <CardContent className="pt-4">
        <div className="stat-label">{label}</div>
        <div className="mt-1">
          <span className="font-mono text-xl font-bold text-primary">
            {value.toFixed(1)}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}
