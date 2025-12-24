import { useEffect, useRef, useState } from 'react';
import {
  CameraController,
  EDrawMeshAs,
  GradientColorPalette,
  MouseWheelZoomModifier3D,
  NumberRange,
  NumericAxis3D,
  OrbitModifier3D,
  ResetCamera3DModifier,
  SciChart3DSurface,
  SurfaceMeshRenderableSeries3D,
  UniformGridDataSeries3D,
  Vector3,
  zeroArray2D,
} from 'scichart';
import { Loader2 } from 'lucide-react';

// Initialize SciChart with community license
SciChart3DSurface.UseCommunityLicense();

interface SurfaceMesh3DChartProps {
  isAnimating?: boolean;
}

export function SurfaceMesh3DChart({ isAnimating = true }: SurfaceMesh3DChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const sciChartRef = useRef<{
    sciChartSurface: SciChart3DSurface;
    controls: { startUpdate: () => void; stopUpdate: () => void };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return;

      try {
        // Create a SciChart3DSurface
        const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(
          chartRef.current,
          {
            theme: {
              type: 'Custom',
              axisBandsFill: 'transparent',
              axisTitleColor: '#C5A047',
              axisPlaneBackgroundFill: 'rgba(10, 25, 47, 0.8)',
              gridBackgroundBrush: 'rgba(10, 25, 47, 0.9)',
              gridBorderBrush: '#1a3a5c',
              loadingAnimationForeground: '#C5A047',
              loadingAnimationBackground: '#0a192f',
              majorGridLineBrush: 'rgba(197, 160, 71, 0.2)',
              minorGridLineBrush: 'rgba(197, 160, 71, 0.1)',
              tickTextBrush: '#8aa4c8',
              labelForegroundBrush: '#C5A047',
              labelBackgroundBrush: 'transparent',
              labelBorderBrush: 'transparent',
              cursorLineBrush: '#C5A047',
              annotationsGripsBorderBrush: '#C5A047',
              annotationsGripsBackgroundBrush: 'rgba(197, 160, 71, 0.3)',
              sciChartBackground: '#0a192f',
            },
          }
        );

        // Create and position the camera
        sciChart3DSurface.camera = new CameraController(wasmContext, {
          position: new Vector3(-150, 200, 150),
          target: new Vector3(0, 50, 0),
        });

        // Set world dimensions
        sciChart3DSurface.worldDimensions = new Vector3(200, 100, 200);

        // Add X, Y, Z Axes with navy theme colors
        sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
          axisTitle: 'Range (m)',
          axisTitleStyle: { color: '#C5A047', fontSize: 14 },
          labelStyle: { color: '#8aa4c8', fontSize: 11 },
          majorTickLineStyle: { color: '#C5A047' },
        });

        sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
          axisTitle: 'Amplitude (dB)',
          visibleRange: new NumberRange(-0.5, 0.5),
          axisTitleStyle: { color: '#C5A047', fontSize: 14 },
          labelStyle: { color: '#8aa4c8', fontSize: 11 },
          majorTickLineStyle: { color: '#C5A047' },
        });

        sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
          axisTitle: 'Frequency (Hz)',
          axisTitleStyle: { color: '#C5A047', fontSize: 14 },
          labelStyle: { color: '#8aa4c8', fontSize: 11 },
          majorTickLineStyle: { color: '#C5A047' },
        });

        // Create 2D array for heightmap data
        const zSize = 48;
        const xSize = 48;
        const heightmapArray = zeroArray2D([zSize, xSize]);

        // Create UniformGridDataSeries3D
        const dataSeries = new UniformGridDataSeries3D(wasmContext, {
          yValues: heightmapArray,
          xStep: 1,
          zStep: 1,
          dataSeriesName: 'Sonar Signal Surface',
        });

        // Color palette matching Indian Navy theme (navy blue to gold)
        const colorPalette = new GradientColorPalette(wasmContext, {
          gradientStops: [
            { offset: 0, color: '#0a192f' },     // Deep navy
            { offset: 0.2, color: '#1a3a5c' },   // Navy blue
            { offset: 0.4, color: '#2a5a8c' },   // Medium blue
            { offset: 0.6, color: '#8aa4c8' },   // Light blue
            { offset: 0.8, color: '#C5A047' },   // Gold
            { offset: 1, color: '#E8D08C' },     // Light gold
          ],
        });

        // Create surface mesh series
        const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
          dataSeries,
          minimum: -0.5,
          maximum: 0.5,
          opacity: 0.95,
          cellHardnessFactor: 1.0,
          shininess: 30,
          lightingFactor: 0.8,
          highlight: 1.0,
          stroke: '#C5A047',
          strokeThickness: 1.5,
          contourStroke: '#C5A047',
          contourInterval: 0.1,
          contourOffset: 0,
          contourStrokeThickness: 1,
          drawSkirt: false,
          drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME,
          meshColorPalette: colorPalette,
        });

        sciChart3DSurface.renderableSeries.add(series);

        // Add camera controls
        sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
        sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
        sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());

        // Animation function for realtime sonar signal visualization
        let frame = 0;
        let timer: ReturnType<typeof setInterval>;

        const setData = (i: number) => {
          const f = i / 10;
          for (let z = 0; z < zSize; z++) {
            for (let x = 0; x < xSize; x++) {
              // Simulate sonar signal processing data
              const xVal = (x - xSize / 2) / xSize;
              const zVal = (z - zSize / 2) / zSize;
              const distance = Math.sqrt(xVal * xVal + zVal * zVal);
              
              // Create wave patterns simulating sonar returns
              const mainPulse = Math.sin(distance * 20 - f) * Math.exp(-distance * 3);
              const secondaryEcho = Math.sin(distance * 15 - f * 0.8) * Math.exp(-distance * 4) * 0.5;
              const noise = (Math.random() - 0.5) * 0.05;
              
              heightmapArray[z][x] = mainPulse + secondaryEcho + noise;
            }
          }
          dataSeries.setYValues(heightmapArray);
        };

        const updateFunc = () => {
          setData(frame);
          frame++;
        };

        updateFunc(); // Initial render

        const startUpdate = () => {
          frame = 0;
          timer = setInterval(updateFunc, 33); // ~30fps
        };

        const stopUpdate = () => {
          clearInterval(timer);
        };

        sciChartRef.current = {
          sciChartSurface: sciChart3DSurface,
          controls: { startUpdate, stopUpdate },
        };

        if (isAnimating) {
          startUpdate();
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing SciChart3D:', error);
        setIsLoading(false);
      }
    };

    initChart();

    return () => {
      if (sciChartRef.current) {
        sciChartRef.current.controls.stopUpdate();
        sciChartRef.current.sciChartSurface.delete();
      }
    };
  }, []);

  useEffect(() => {
    if (sciChartRef.current) {
      if (isAnimating) {
        sciChartRef.current.controls.startUpdate();
      } else {
        sciChartRef.current.controls.stopUpdate();
      }
    }
  }, [isAnimating]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-border bg-navy-dark">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground font-mono">
              Initializing 3D Surface...
            </span>
          </div>
        </div>
      )}
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}
