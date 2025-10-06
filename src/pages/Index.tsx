import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TrainFleetGrid } from '@/components/TrainFleetGrid';
import { OptimizationPanel } from '@/components/OptimizationPanel';
import { DecisionExplainer } from '@/components/DecisionExplainer';
import { 
  mockTrainSets, 
  mockSystemMetrics, 
  mockDataSources,
  TrainSet,
  SystemMetrics,
  DataSource
} from '@/lib/trainData';
import { 
  OptimizationEngine, 
  OptimizationConstraints, 
  OptimizationResult, 
  OptimizationSummary 
} from '@/lib/optimizationEngine';
import { 
  Train, 
  BarChart3, 
  Settings, 
  Brain, 
  Database, 
  AlertTriangle,
  Clock,
  Users,
  Zap,
  TrendingUp,
  Shield,
  Building2,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KMRLDashboard() {
  const [trains, setTrains] = useState<TrainSet[]>(mockTrainSets);
  const [systemMetrics] = useState<SystemMetrics>(mockSystemMetrics);
  const [dataSources] = useState<DataSource[]>(mockDataSources);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [optimizationSummary, setOptimizationSummary] = useState<OptimizationSummary>();
  const [selectedTrainId, setSelectedTrainId] = useState<string>();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setTrains(prev => prev.map(train => ({
        ...train,
        predictedAvailability: Math.max(0, Math.min(100, train.predictedAvailability + (Math.random() - 0.5) * 5))
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleOptimization = async (constraints: OptimizationConstraints) => {
    setIsOptimizing(true);
    
    // Simulate optimization processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = OptimizationEngine.optimize(trains, constraints);
    const summary = OptimizationEngine.generateSummary(results);
    
    setOptimizationResults(results);
    setOptimizationSummary(summary);
    setIsOptimizing(false);
  };

  const handleTrainStatusChange = (trainId: string, newStatus: TrainSet['status']) => {
    setTrains(prev => prev.map(train => 
      train.id === trainId ? { ...train, status: newStatus } : train
    ));
  };

  const getStatusCounts = () => {
    return trains.reduce((acc, train) => {
      acc[train.status] = (acc[train.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();
  const currentTime = new Date().toLocaleTimeString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    hour12: false 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Train className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">KMRL Induction Planning</h1>
                <p className="text-sm text-gray-600">AI-Driven Train Scheduling System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/branding">
                <Button variant="outline" size="sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  Brand Management
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </Link>
              <div className="text-right">
                <div className="text-sm font-medium">IST {currentTime}</div>
                <div className="text-xs text-gray-600">Last Updated: 2 min ago</div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="fleet" className="flex items-center gap-2">
              <Train className="w-4 h-4" />
              Fleet
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Optimization
            </TabsTrigger>
            <TabsTrigger value="decisions" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Decisions
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data Sources
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <MetricCard
                title="Fleet Availability"
                value={systemMetrics.fleetAvailability}
                unit="%"
                trend="up"
                trendValue="+2.1%"
                icon={<Train className="w-4 h-4" />}
              />
              <MetricCard
                title="Punctuality KPI"
                value={systemMetrics.punctualityKPI}
                unit="%"
                trend="stable"
                trendValue="±0.1%"
                icon={<Clock className="w-4 h-4" />}
              />
              <MetricCard
                title="Maintenance Cost"
                value={systemMetrics.maintenanceCost}
                unit="Cr/month"
                trend="down"
                trendValue="-8.3%"
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <MetricCard
                title="Branding Compliance"
                value={systemMetrics.brandingCompliance}
                unit="%"
                trend="up"
                trendValue="+5.2%"
                icon={<Users className="w-4 h-4" />}
              />
              <MetricCard
                title="Energy Efficiency"
                value={systemMetrics.energyEfficiency}
                unit="%"
                trend="up"
                trendValue="+1.8%"
                icon={<Zap className="w-4 h-4" />}
              />
              <MetricCard
                title="Safety Score"
                value={systemMetrics.safetyScore}
                unit="%"
                trend="stable"
                trendValue="±0.0%"
                icon={<Shield className="w-4 h-4" />}
              />
            </div>

            {/* Fleet Status Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <StatusBadge status="service" />
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{statusCounts.service || 0}</div>
                        <div className="text-xs text-muted-foreground">In Service</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status="standby" />
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{statusCounts.standby || 0}</div>
                        <div className="text-xs text-muted-foreground">Standby</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status="maintenance" />
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">{statusCounts.maintenance || 0}</div>
                        <div className="text-xs text-muted-foreground">Maintenance</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status="ibl" />
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">{statusCounts.ibl || 0}</div>
                        <div className="text-xs text-muted-foreground">IBL</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>System Alerts</CardTitle>
                    <Link to="/branding">
                      <Button variant="outline" size="sm">
                        <Building2 className="w-4 h-4 mr-2" />
                        Manage Brands
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-red-700">Critical: Telecom Dept Offline</div>
                        <div className="text-sm text-red-600">Connection lost 15 minutes ago</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-700">Warning: UNS Stream Delayed</div>
                        <div className="text-sm text-yellow-600">Data lag detected in real-time feeds</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <Building2 className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-purple-700">Branding: 2 SLA Alerts</div>
                        <div className="text-sm text-purple-600">Contracts require attention - check brand management</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-700">Info: 3 Trainsets Due for Service</div>
                        <div className="text-sm text-blue-600">Scheduled maintenance window approaching</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fleet Management Tab */}
          <TabsContent value="fleet" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Train Fleet Management</h2>
              <div className="flex items-center gap-4">
                <Link to="/branding">
                  <Button variant="outline" size="sm">
                    <Building2 className="w-4 h-4 mr-2" />
                    Brand Assignments
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Total: {trains.length} trainsets</span>
                </div>
              </div>
            </div>
            <TrainFleetGrid 
              trains={trains} 
              onStatusChange={handleTrainStatusChange}
            />
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <OptimizationPanel
              onOptimize={handleOptimization}
              results={optimizationResults}
              summary={optimizationSummary}
              isOptimizing={isOptimizing}
            />
          </TabsContent>

          {/* AI Decisions Tab */}
          <TabsContent value="decisions" className="space-y-6">
            {optimizationResults.length > 0 ? (
              <DecisionExplainer
                results={optimizationResults}
                selectedTrainId={selectedTrainId}
                onTrainSelect={setSelectedTrainId}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Optimization Results</h3>
                  <p className="text-muted-foreground mb-4">
                    Run the optimization engine to see AI-driven decision explanations
                  </p>
                  <Button onClick={() => setActiveTab('optimization')}>
                    Go to Optimization
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">Data Integration Status</h2>
              {dataSources.map((source) => (
                <Card key={source.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={source.status} />
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Last update: {source.lastUpdate}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{source.reliability}%</div>
                        <div className="text-xs text-muted-foreground">Reliability</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}