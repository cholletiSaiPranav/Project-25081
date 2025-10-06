export interface TrainSet {
  id: string;
  name: string;
  status: 'service' | 'standby' | 'maintenance' | 'ibl';
  fitnessStatus: {
    rollingStock: { valid: boolean; expiryDate: string; };
    signalling: { valid: boolean; expiryDate: string; };
    telecom: { valid: boolean; expiryDate: string; };
  };
  jobCards: {
    open: number;
    critical: number;
    lastUpdated: string;
  };
  branding: {
    advertiser: string;
    contractHours: number;
    completedHours: number;
    priority: 'high' | 'medium' | 'low';
  };
  mileage: {
    totalKm: number;
    lastService: number;
    nextServiceDue: number;
  };
  cleaning: {
    lastCleaned: string;
    deepCleanDue: boolean;
    estimatedTime: number;
  };
  stablingBay: number;
  lastInduction: string;
  predictedAvailability: number; // 0-100%
}

export interface SystemMetrics {
  fleetAvailability: number;
  punctualityKPI: number;
  maintenanceCost: number;
  brandingCompliance: number;
  energyEfficiency: number;
  safetyScore: number;
}

export interface OptimizationConstraints {
  minServiceTrains: number;
  maxMaintenanceTrains: number;
  brandingPriorities: boolean;
  mileageBalancing: boolean;
  cleaningSchedule: boolean;
  stablingOptimization: boolean;
}

export interface DataSource {
  name: string;
  status: 'online' | 'offline' | 'warning';
  lastUpdate: string;
  reliability: number;
}

// Mock data for 25 trainsets
export const mockTrainSets: TrainSet[] = Array.from({ length: 25 }, (_, i) => ({
  id: `KMRL-${String(i + 1).padStart(3, '0')}`,
  name: `Trainset ${i + 1}`,
  status: ['service', 'standby', 'maintenance', 'ibl'][Math.floor(Math.random() * 4)] as TrainSet['status'],
  fitnessStatus: {
    rollingStock: { 
      valid: Math.random() > 0.1, 
      expiryDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
    },
    signalling: { 
      valid: Math.random() > 0.05, 
      expiryDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
    },
    telecom: { 
      valid: Math.random() > 0.05, 
      expiryDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
    },
  },
  jobCards: {
    open: Math.floor(Math.random() * 5),
    critical: Math.floor(Math.random() * 2),
    lastUpdated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
  },
  branding: {
    advertiser: ['Coca-Cola', 'Samsung', 'Reliance', 'Tata', 'Airtel'][Math.floor(Math.random() * 5)],
    contractHours: 200,
    completedHours: Math.floor(Math.random() * 200),
    priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as TrainSet['branding']['priority'],
  },
  mileage: {
    totalKm: Math.floor(Math.random() * 100000) + 50000,
    lastService: Math.floor(Math.random() * 5000),
    nextServiceDue: Math.floor(Math.random() * 2000) + 500,
  },
  cleaning: {
    lastCleaned: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deepCleanDue: Math.random() > 0.7,
    estimatedTime: Math.floor(Math.random() * 4) + 2,
  },
  stablingBay: Math.floor(Math.random() * 30) + 1,
  lastInduction: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  predictedAvailability: Math.floor(Math.random() * 40) + 60,
}));

export const mockSystemMetrics: SystemMetrics = {
  fleetAvailability: 92.5,
  punctualityKPI: 99.2,
  maintenanceCost: 2.3,
  brandingCompliance: 87.8,
  energyEfficiency: 94.1,
  safetyScore: 98.7,
};

export const mockDataSources: DataSource[] = [
  { name: 'IBM Maximo', status: 'online', lastUpdate: '2 minutes ago', reliability: 98.5 },
  { name: 'IoT Fitness Sensors', status: 'online', lastUpdate: '30 seconds ago', reliability: 99.2 },
  { name: 'UNS Stream', status: 'warning', lastUpdate: '5 minutes ago', reliability: 95.8 },
  { name: 'Rolling Stock Dept', status: 'online', lastUpdate: '1 minute ago', reliability: 97.3 },
  { name: 'Signalling Dept', status: 'online', lastUpdate: '3 minutes ago', reliability: 98.9 },
  { name: 'Telecom Dept', status: 'offline', lastUpdate: '15 minutes ago', reliability: 89.2 },
];