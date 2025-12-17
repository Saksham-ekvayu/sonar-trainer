// Mock simulation data for sonar demonstrator

export const transmissionLossData = Array.from({ length: 50 }, (_, i) => ({
  range: (i + 1) * 200,
  tl: 20 * Math.log10((i + 1) * 200) + 0.001 * (i + 1) * 200 + Math.random() * 2,
}));

export const snrVsRangeData = Array.from({ length: 50 }, (_, i) => ({
  range: (i + 1) * 200,
  snr: Math.max(0, 40 - 15 * Math.log10((i + 1) * 2) + Math.random() * 3 - 1.5),
}));

export const soundSpeedProfileData = [
  { depth: 0, speed: 1520, label: 'Surface Layer' },
  { depth: 25, speed: 1518, label: '' },
  { depth: 50, speed: 1515, label: 'Mixed Layer' },
  { depth: 75, speed: 1508, label: '' },
  { depth: 100, speed: 1500, label: 'Thermocline' },
  { depth: 150, speed: 1490, label: '' },
  { depth: 200, speed: 1485, label: '' },
  { depth: 300, speed: 1480, label: 'Deep Sound Channel' },
  { depth: 400, speed: 1482, label: '' },
  { depth: 500, speed: 1485, label: '' },
  { depth: 700, speed: 1488, label: '' },
  { depth: 1000, speed: 1495, label: 'Deep Layer' },
];

export const beamPatternData = Array.from({ length: 360 }, (_, i) => {
  const angle = (i - 180) * (Math.PI / 180);
  const mainLobe = Math.pow(Math.sin(10 * angle) / (10 * angle || 1), 2);
  const sideLobes = 0.1 * Math.pow(Math.cos(angle * 3), 2);
  return {
    angle: i - 180,
    gain: 20 * Math.log10(Math.abs(mainLobe) + sideLobes + 0.01),
  };
});

export const waterfallData = Array.from({ length: 100 }, (_, timeIndex) =>
  Array.from({ length: 360 }, (_, bearingIndex) => {
    const targetBearing = 45;
    const noise = Math.random() * 20 + 30;
    const targetSignal =
      bearingIndex >= targetBearing - 5 && bearingIndex <= targetBearing + 5
        ? 70 + Math.random() * 10
        : 0;
    return Math.max(noise, targetSignal);
  })
);

export const spectrogramData = Array.from({ length: 50 }, (_, timeIndex) =>
  Array.from({ length: 100 }, (_, freqIndex) => {
    const baseNoise = Math.random() * 30 + 20;
    const tonalLine1 = freqIndex >= 45 && freqIndex <= 47 ? 60 + Math.random() * 10 : 0;
    const tonalLine2 = freqIndex >= 72 && freqIndex <= 74 ? 55 + Math.random() * 10 : 0;
    return Math.max(baseNoise, tonalLine1, tonalLine2);
  })
);

export const rayPathData = [
  { id: 'direct', path: generateRayPath(0, 100, 10000, 150, 'direct') },
  { id: 'surface', path: generateRayPath(0, 100, 10000, 150, 'surface') },
  { id: 'bottom', path: generateRayPath(0, 100, 10000, 150, 'bottom') },
  { id: 'convergence', path: generateRayPath(0, 100, 10000, 150, 'convergence') },
];

function generateRayPath(
  startX: number,
  startDepth: number,
  endX: number,
  endDepth: number,
  type: 'direct' | 'surface' | 'bottom' | 'convergence'
): { x: number; depth: number }[] {
  const points: { x: number; depth: number }[] = [];
  const numPoints = 50;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x = startX + t * (endX - startX);
    let depth: number;

    switch (type) {
      case 'direct':
        depth = startDepth + t * (endDepth - startDepth);
        break;
      case 'surface':
        depth = startDepth - 80 * Math.sin(Math.PI * t) + t * (endDepth - startDepth);
        break;
      case 'bottom':
        depth = startDepth + 250 * Math.sin(Math.PI * t) + t * (endDepth - startDepth);
        break;
      case 'convergence':
        depth = startDepth + 150 * Math.sin(2 * Math.PI * t) + t * (endDepth - startDepth);
        break;
    }

    points.push({ x, depth: Math.max(0, Math.min(500, depth)) });
  }

  return points;
}

export const targetStrengthData = {
  submarine: Array.from({ length: 360 }, (_, i) => {
    const angle = i * (Math.PI / 180);
    const beamAspect = Math.abs(Math.sin(angle));
    const bowStern = Math.abs(Math.cos(angle));
    const ts = 15 + 10 * beamAspect - 5 * bowStern + Math.random() * 2;
    return { angle: i, ts };
  }),
  ship: Array.from({ length: 360 }, (_, i) => {
    const angle = i * (Math.PI / 180);
    const beamAspect = Math.abs(Math.sin(angle));
    const ts = 20 + 15 * beamAspect + Math.random() * 3;
    return { angle: i, ts };
  }),
  torpedo: Array.from({ length: 360 }, (_, i) => {
    const angle = i * (Math.PI / 180);
    const ts = 5 + 3 * Math.abs(Math.cos(angle)) + Math.random() * 1;
    return { angle: i, ts };
  }),
};

export const matchedFilterOutput = Array.from({ length: 200 }, (_, i) => {
  const t = (i - 100) / 10;
  const mainPeak = i === 100 ? 1 : Math.sin(Math.PI * t) / (Math.PI * t);
  const noise = (Math.random() - 0.5) * 0.1;
  return {
    time: i - 100,
    amplitude: mainPeak + noise,
  };
});

export const dopplerData = Array.from({ length: 200 }, (_, i) => {
  const freq = (i - 100) * 10;
  const targetDoppler = Math.exp(-Math.pow((freq - 150) / 30, 2)) * 0.8;
  const noise = Math.random() * 0.1;
  return {
    frequency: freq,
    power: targetDoppler + noise,
  };
});

export const ppiData = {
  ownShip: { x: 0, y: 0, heading: 45 },
  contacts: [
    { id: 'C1', bearing: 45, range: 5000, type: 'submarine', confidence: 0.85 },
    { id: 'C2', bearing: 120, range: 8000, type: 'ship', confidence: 0.72 },
    { id: 'C3', bearing: 270, range: 3000, type: 'unknown', confidence: 0.45 },
  ],
  noiseField: Array.from({ length: 36 }, (_, i) => ({
    bearing: i * 10,
    level: 50 + Math.random() * 20,
  })),
};

export const transmissionLossHeatmap = Array.from({ length: 50 }, (_, depthIdx) =>
  Array.from({ length: 100 }, (_, rangeIdx) => {
    const range = (rangeIdx + 1) * 100;
    const depth = depthIdx * 10;
    const sphericalLoss = 20 * Math.log10(range);
    const absorptionLoss = 0.001 * range;
    const depthEffect = Math.sin((depth / 500) * Math.PI) * 5;
    return sphericalLoss + absorptionLoss + depthEffect + Math.random() * 3;
  })
);

export const ambientNoiseSpectrum = Array.from({ length: 100 }, (_, i) => {
  const freq = Math.pow(10, 1 + (i / 100) * 3); // 10 Hz to 10 kHz
  const shippingNoise = freq < 500 ? 70 - 20 * Math.log10(freq / 10) : 40;
  const windNoise = 50 - 17 * Math.log10(freq / 1000);
  const thermalNoise = -15 + 20 * Math.log10(freq / 1000);
  return {
    frequency: freq,
    shipping: Math.max(20, shippingNoise),
    wind: Math.max(20, windNoise + Math.random() * 5),
    thermal: Math.max(20, thermalNoise),
    total: Math.max(shippingNoise, windNoise, thermalNoise) + Math.random() * 3,
  };
});
