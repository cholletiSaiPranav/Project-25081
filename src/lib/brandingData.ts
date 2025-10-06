export interface Brand {
  id: string;
  name: string;
  logo: string;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  registrationDate: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: 'premium' | 'standard' | 'local';
  priority: 'high' | 'medium' | 'low';
}

export interface BrandContract {
  id: string;
  brandId: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  totalValue: number;
  paidAmount: number;
  pendingAmount: number;
  contractedHours: number;
  completedHours: number;
  remainingHours: number;
  slaCompliance: number;
  penaltyAmount: number;
  status: 'active' | 'completed' | 'breached' | 'pending';
  trainAllocations: string[]; // Train IDs
}

export interface BrandExposure {
  id: string;
  brandId: string;
  trainId: string;
  date: string;
  startTime: string;
  endTime: string;
  route: string;
  exposureHours: number;
  passengerCount: number;
  revenue: number;
  wrapCondition: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface BrandWrap {
  id: string;
  brandId: string;
  trainId: string;
  installationDate: string;
  expectedRemovalDate: string;
  actualRemovalDate?: string;
  wrapType: 'full' | 'partial' | 'interior' | 'exterior';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  maintenanceHistory: WrapMaintenance[];
  cost: number;
  status: 'active' | 'scheduled' | 'removed' | 'damaged';
}

export interface WrapMaintenance {
  date: string;
  type: 'cleaning' | 'repair' | 'replacement';
  cost: number;
  notes: string;
}

export interface BrandingMetrics {
  totalBrands: number;
  activeBrands: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageCompliance: number;
  totalPenalties: number;
  exposureHours: number;
  wrapUtilization: number;
}

// Mock data
export const mockBrands: Brand[] = [
  {
    id: 'brand-001',
    name: 'Coca-Cola',
    logo: '/api/placeholder/100/100',
    status: 'active',
    registrationDate: '2023-01-15',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh.kumar@coca-cola.com',
    phone: '+91-9876543210',
    category: 'premium',
    priority: 'high'
  },
  {
    id: 'brand-002',
    name: 'Samsung',
    logo: '/api/placeholder/100/100',
    status: 'active',
    registrationDate: '2023-02-20',
    contactPerson: 'Priya Sharma',
    email: 'priya.sharma@samsung.com',
    phone: '+91-9876543211',
    category: 'premium',
    priority: 'high'
  },
  {
    id: 'brand-003',
    name: 'Reliance Jio',
    logo: '/api/placeholder/100/100',
    status: 'active',
    registrationDate: '2023-03-10',
    contactPerson: 'Amit Patel',
    email: 'amit.patel@jio.com',
    phone: '+91-9876543212',
    category: 'premium',
    priority: 'medium'
  },
  {
    id: 'brand-004',
    name: 'Tata Motors',
    logo: '/api/placeholder/100/100',
    status: 'active',
    registrationDate: '2023-04-05',
    contactPerson: 'Sunita Menon',
    email: 'sunita.menon@tatamotors.com',
    phone: '+91-9876543213',
    category: 'standard',
    priority: 'medium'
  },
  {
    id: 'brand-005',
    name: 'Airtel',
    logo: '/api/placeholder/100/100',
    status: 'pending',
    registrationDate: '2024-01-10',
    contactPerson: 'Vikram Singh',
    email: 'vikram.singh@airtel.com',
    phone: '+91-9876543214',
    category: 'premium',
    priority: 'high'
  },
  {
    id: 'brand-006',
    name: 'Kerala Tourism',
    logo: '/api/placeholder/100/100',
    status: 'expired',
    registrationDate: '2022-06-15',
    contactPerson: 'Maya Nair',
    email: 'maya.nair@keralatourism.org',
    phone: '+91-9876543215',
    category: 'local',
    priority: 'low'
  }
];

export const mockBrandContracts: BrandContract[] = [
  {
    id: 'contract-001',
    brandId: 'brand-001',
    contractNumber: 'KMRL-CC-2024-001',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    totalValue: 5000000,
    paidAmount: 3000000,
    pendingAmount: 2000000,
    contractedHours: 2000,
    completedHours: 1200,
    remainingHours: 800,
    slaCompliance: 95.5,
    penaltyAmount: 25000,
    status: 'active',
    trainAllocations: ['KMRL-001', 'KMRL-005', 'KMRL-012']
  },
  {
    id: 'contract-002',
    brandId: 'brand-002',
    contractNumber: 'KMRL-SM-2024-002',
    startDate: '2024-02-01',
    endDate: '2024-11-30',
    totalValue: 4500000,
    paidAmount: 4500000,
    pendingAmount: 0,
    contractedHours: 1800,
    completedHours: 950,
    remainingHours: 850,
    slaCompliance: 98.2,
    penaltyAmount: 0,
    status: 'active',
    trainAllocations: ['KMRL-003', 'KMRL-008', 'KMRL-015']
  },
  {
    id: 'contract-003',
    brandId: 'brand-003',
    contractNumber: 'KMRL-RJ-2024-003',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    totalValue: 6000000,
    paidAmount: 2000000,
    pendingAmount: 4000000,
    contractedHours: 2400,
    completedHours: 800,
    remainingHours: 1600,
    slaCompliance: 88.7,
    penaltyAmount: 75000,
    status: 'active',
    trainAllocations: ['KMRL-007', 'KMRL-011', 'KMRL-018', 'KMRL-022']
  }
];

export const mockBrandExposures: BrandExposure[] = Array.from({ length: 50 }, (_, i) => ({
  id: `exposure-${String(i + 1).padStart(3, '0')}`,
  brandId: mockBrands[Math.floor(Math.random() * mockBrands.length)].id,
  trainId: `KMRL-${String(Math.floor(Math.random() * 25) + 1).padStart(3, '0')}`,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  startTime: `${Math.floor(Math.random() * 12) + 6}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  endTime: `${Math.floor(Math.random() * 6) + 18}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  route: ['Aluva-Pettah', 'Pettah-Aluva', 'Aluva-Maharajas', 'Maharajas-Aluva'][Math.floor(Math.random() * 4)],
  exposureHours: Math.floor(Math.random() * 8) + 4,
  passengerCount: Math.floor(Math.random() * 5000) + 1000,
  revenue: Math.floor(Math.random() * 10000) + 2000,
  wrapCondition: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as BrandExposure['wrapCondition']
}));

export const mockBrandingMetrics: BrandingMetrics = {
  totalBrands: 6,
  activeBrands: 4,
  totalRevenue: 15500000,
  monthlyRevenue: 1250000,
  averageCompliance: 94.1,
  totalPenalties: 100000,
  exposureHours: 4950,
  wrapUtilization: 87.3
};