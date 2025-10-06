import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  mockBrands, 
  mockBrandContracts, 
  mockBrandExposures, 
  mockBrandingMetrics,
  Brand, 
  BrandContract 
} from '@/lib/brandingData';
import { 
  Building2, 
  Search, 
  Plus, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  IndianRupee,
  Clock,
  Users,
  Settings,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';

export function BrandingDashboard() {
  const [brands] = useState<Brand[]>(mockBrands);
  const [contracts] = useState<BrandContract[]>(mockBrandContracts);
  const [exposures] = useState(mockBrandExposures);
  const [metrics] = useState(mockBrandingMetrics);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || brand.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getBrandContract = (brandId: string) => {
    return contracts.find(contract => contract.brandId === brandId);
  };

  const getBrandExposures = (brandId: string) => {
    return exposures.filter(exposure => exposure.brandId === brandId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'expired': return 'text-red-600';
      case 'inactive': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
          <p className="text-gray-600">Manage advertising brands, contracts, and performance tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Brands"
          value={metrics.totalBrands}
          trend="up"
          trendValue="+2 this month"
          icon={<Building2 className="w-4 h-4" />}
        />
        <MetricCard
          title="Active Brands"
          value={metrics.activeBrands}
          trend="stable"
          trendValue="No change"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          title="Monthly Revenue"
          value={`₹${(metrics.monthlyRevenue / 100000).toFixed(1)}L`}
          trend="up"
          trendValue="+12.5%"
          icon={<IndianRupee className="w-4 h-4" />}
        />
        <MetricCard
          title="SLA Compliance"
          value={metrics.averageCompliance}
          unit="%"
          trend="up"
          trendValue="+2.3%"
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      <Tabs defaultValue="brands" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="brands">Brand Registry</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="exposure">Exposure Tracking</TabsTrigger>
          <TabsTrigger value="wraps">Wrap Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Brand Registry Tab */}
        <TabsContent value="brands" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brand Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => {
              const contract = getBrandContract(brand.id);
              const brandExposures = getBrandExposures(brand.id);
              const totalExposureHours = brandExposures.reduce((sum, exp) => sum + exp.exposureHours, 0);

              return (
                <Card key={brand.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{brand.name}</CardTitle>
                          <p className="text-sm text-gray-600">{brand.category}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={brand.status} />
                        <Badge className={getPriorityColor(brand.priority)}>
                          {brand.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Contact</p>
                        <p className="font-medium">{brand.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Registered</p>
                        <p className="font-medium">{brand.registrationDate}</p>
                      </div>
                    </div>

                    {contract && (
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Contract Value</span>
                          <span className="font-medium">₹{(contract.totalValue / 100000).toFixed(1)}L</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Completion</span>
                          <span className="font-medium">
                            {((contract.completedHours / contract.contractedHours) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">SLA Compliance</span>
                          <span className={`font-medium ${contract.slaCompliance >= 95 ? 'text-green-600' : 'text-red-600'}`}>
                            {contract.slaCompliance}%
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-6">
          <div className="grid gap-4">
            {contracts.map((contract) => {
              const brand = brands.find(b => b.id === contract.brandId);
              const completionRate = (contract.completedHours / contract.contractedHours) * 100;
              const paymentRate = (contract.paidAmount / contract.totalValue) * 100;

              return (
                <Card key={contract.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          {brand?.name} - {contract.contractNumber}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {contract.startDate} to {contract.endDate}
                        </p>
                      </div>
                      <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                        {contract.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-gray-600">Financial</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total Value</span>
                            <span className="font-medium">₹{(contract.totalValue / 100000).toFixed(1)}L</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Paid</span>
                            <span className="font-medium text-green-600">₹{(contract.paidAmount / 100000).toFixed(1)}L</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Pending</span>
                            <span className="font-medium text-orange-600">₹{(contract.pendingAmount / 100000).toFixed(1)}L</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${paymentRate}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-gray-600">Exposure Hours</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Contracted</span>
                            <span className="font-medium">{contract.contractedHours}h</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Completed</span>
                            <span className="font-medium text-blue-600">{contract.completedHours}h</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Remaining</span>
                            <span className="font-medium text-orange-600">{contract.remainingHours}h</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-gray-600">Performance</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>SLA Compliance</span>
                            <span className={`font-medium ${contract.slaCompliance >= 95 ? 'text-green-600' : 'text-red-600'}`}>
                              {contract.slaCompliance}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Penalties</span>
                            <span className="font-medium text-red-600">₹{contract.penaltyAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Trains Allocated</span>
                            <span className="font-medium">{contract.trainAllocations.length}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-gray-600">Actions</h4>
                        <div className="space-y-2">
                          <Button size="sm" variant="outline" className="w-full">
                            <Eye className="w-3 h-3 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <Edit className="w-3 h-3 mr-2" />
                            Edit Contract
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <Download className="w-3 h-3 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>

                    {contract.slaCompliance < 90 && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-700">SLA Compliance Alert</span>
                        </div>
                        <p className="text-sm text-red-600 mt-1">
                          Contract is below 90% SLA compliance. Review performance and take corrective action.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Exposure Tracking Tab */}
        <TabsContent value="exposure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exposure Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exposures.slice(0, 10).map((exposure) => {
                  const brand = brands.find(b => b.id === exposure.brandId);
                  return (
                    <div key={exposure.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{brand?.name}</div>
                          <div className="text-sm text-gray-600">
                            {exposure.trainId} • {exposure.route} • {exposure.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{exposure.exposureHours}h</div>
                        <div className="text-sm text-gray-600">₹{exposure.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wrap Management Tab */}
        <TabsContent value="wraps" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">Train KMRL-{String(i + 1).padStart(3, '0')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Brand</span>
                      <span className="font-medium">{brands[i % brands.length]?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Wrap Type</span>
                      <span className="font-medium">Full Exterior</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Condition</span>
                      <Badge variant="outline">Good</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Installed</span>
                      <span className="font-medium">2024-01-15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Revenue</span>
                    <span className="text-2xl font-bold text-green-600">₹{(metrics.totalRevenue / 10000000).toFixed(1)}Cr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Average</span>
                    <span className="text-lg font-medium">₹{(metrics.monthlyRevenue / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth Rate</span>
                    <span className="text-lg font-medium text-green-600">+12.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average SLA Compliance</span>
                    <span className="text-2xl font-bold text-blue-600">{metrics.averageCompliance}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Penalties</span>
                    <span className="text-lg font-medium text-red-600">₹{(metrics.totalPenalties / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Wrap Utilization</span>
                    <span className="text-lg font-medium">{metrics.wrapUtilization}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}