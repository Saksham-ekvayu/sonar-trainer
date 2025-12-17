import { create } from 'zustand';

export interface Platform {
  id: string;
  type: 'ship' | 'submarine' | 'auv';
  name: string;
  position: { x: number; y: number; depth: number };
  speed: number;
  heading: number;
}

export interface Target {
  id: string;
  type: 'submarine' | 'ship' | 'torpedo' | 'auv';
  name: string;
  position: { x: number; y: number; depth: number };
  speed: number;
  course: number;
  targetStrength: number;
}

export interface Environment {
  bathymetry: number[];
  soundSpeedProfile: { depth: number; speed: number }[];
  seabedType: 'sand' | 'rock' | 'mud' | 'gravel';
  ambientNoise: {
    shipping: number;
    wind: number;
    biological: number;
    thermal: number;
  };
  waterDepth: number;
  surfaceCondition: number;
}

export interface Transmitter {
  frequency: number;
  bandwidth: number;
  pulseWidth: number;
  waveform: 'CW' | 'LFM' | 'SFM';
  sourceLevel: number;
  beamwidth: number;
}

export interface Receiver {
  arrayType: 'linear' | 'planar' | 'cylindrical';
  numElements: number;
  elementSpacing: number;
  directivityIndex: number;
  faultSimulation: boolean;
  faultyElements: number[];
}

export interface SonarEquation {
  sourceLevel: number;
  transmissionLoss: number;
  targetStrength: number;
  noiseLevel: number;
  receivedLevel: number;
  directivityIndex: number;
  signalToNoiseRatio: number;
  echoLevel: number;
  figureOfMerit: number;
  detectionThreshold: number;
  isDetected: boolean;
}

export interface SimulationState {
  isRunning: boolean;
  currentTime: number;
  mode: 'active' | 'passive';
  pingMode: 'single' | 'multi';
}

interface SonarState {
  // Scenario
  scenarioName: string;
  platform: Platform;
  targets: Target[];
  
  // Environment
  environment: Environment;
  
  // Equipment
  transmitter: Transmitter;
  receiver: Receiver;
  
  // Calculations
  sonarEquation: SonarEquation;
  
  // Simulation
  simulation: SimulationState;
  
  // Actions
  setScenarioName: (name: string) => void;
  setPlatform: (platform: Partial<Platform>) => void;
  addTarget: (target: Target) => void;
  removeTarget: (id: string) => void;
  updateTarget: (id: string, updates: Partial<Target>) => void;
  setEnvironment: (env: Partial<Environment>) => void;
  setTransmitter: (tx: Partial<Transmitter>) => void;
  setReceiver: (rx: Partial<Receiver>) => void;
  setSonarEquation: (eq: Partial<SonarEquation>) => void;
  setSimulation: (sim: Partial<SimulationState>) => void;
  runSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
}

const initialPlatform: Platform = {
  id: 'platform-1',
  type: 'submarine',
  name: 'SSN-789',
  position: { x: 0, y: 0, depth: 100 },
  speed: 8,
  heading: 45,
};

const initialEnvironment: Environment = {
  bathymetry: [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500],
  soundSpeedProfile: [
    { depth: 0, speed: 1520 },
    { depth: 50, speed: 1515 },
    { depth: 100, speed: 1500 },
    { depth: 200, speed: 1485 },
    { depth: 300, speed: 1480 },
    { depth: 500, speed: 1485 },
    { depth: 800, speed: 1490 },
    { depth: 1000, speed: 1500 },
  ],
  seabedType: 'sand',
  ambientNoise: {
    shipping: 65,
    wind: 55,
    biological: 45,
    thermal: 40,
  },
  waterDepth: 500,
  surfaceCondition: 3,
};

const initialTransmitter: Transmitter = {
  frequency: 3500,
  bandwidth: 500,
  pulseWidth: 100,
  waveform: 'LFM',
  sourceLevel: 220,
  beamwidth: 15,
};

const initialReceiver: Receiver = {
  arrayType: 'cylindrical',
  numElements: 96,
  elementSpacing: 0.15,
  directivityIndex: 25,
  faultSimulation: false,
  faultyElements: [],
};

const initialSonarEquation: SonarEquation = {
  sourceLevel: 220,
  transmissionLoss: 75,
  targetStrength: 15,
  noiseLevel: 65,
  receivedLevel: 85,
  directivityIndex: 25,
  signalToNoiseRatio: 12,
  echoLevel: 85,
  figureOfMerit: 95,
  detectionThreshold: 10,
  isDetected: true,
};

const initialSimulation: SimulationState = {
  isRunning: false,
  currentTime: 0,
  mode: 'active',
  pingMode: 'single',
};

export const useSonarStore = create<SonarState>((set, get) => ({
  scenarioName: 'Deep Water ASW Exercise',
  platform: initialPlatform,
  targets: [
    {
      id: 'target-1',
      type: 'submarine',
      name: 'Unknown Contact',
      position: { x: 5000, y: 3000, depth: 150 },
      speed: 6,
      course: 225,
      targetStrength: 15,
    },
  ],
  environment: initialEnvironment,
  transmitter: initialTransmitter,
  receiver: initialReceiver,
  sonarEquation: initialSonarEquation,
  simulation: initialSimulation,

  setScenarioName: (name) => set({ scenarioName: name }),
  
  setPlatform: (platform) =>
    set((state) => ({
      platform: { ...state.platform, ...platform },
    })),

  addTarget: (target) =>
    set((state) => ({
      targets: [...state.targets, target],
    })),

  removeTarget: (id) =>
    set((state) => ({
      targets: state.targets.filter((t) => t.id !== id),
    })),

  updateTarget: (id, updates) =>
    set((state) => ({
      targets: state.targets.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  setEnvironment: (env) =>
    set((state) => ({
      environment: { ...state.environment, ...env },
    })),

  setTransmitter: (tx) =>
    set((state) => ({
      transmitter: { ...state.transmitter, ...tx },
    })),

  setReceiver: (rx) =>
    set((state) => ({
      receiver: { ...state.receiver, ...rx },
    })),

  setSonarEquation: (eq) =>
    set((state) => ({
      sonarEquation: { ...state.sonarEquation, ...eq },
    })),

  setSimulation: (sim) =>
    set((state) => ({
      simulation: { ...state.simulation, ...sim },
    })),

  runSimulation: () =>
    set((state) => ({
      simulation: { ...state.simulation, isRunning: true },
    })),

  pauseSimulation: () =>
    set((state) => ({
      simulation: { ...state.simulation, isRunning: false },
    })),

  resetSimulation: () =>
    set((state) => ({
      simulation: { ...state.simulation, isRunning: false, currentTime: 0 },
    })),
}));
