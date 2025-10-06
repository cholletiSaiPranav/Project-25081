import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OptimizationConstraints, OptimizationResult, OptimizationSummary } from '@/lib/optimizationEngine';
import { 
  Settings, 
  Play, 
  BarChart3, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

interface OptimizationPanelProps {
  onOptimize: (constraints: OptimizationConstraints) => void;
  results?: OptimizationResult[];
  summary?: OptimizationSummary;
  isOptimizing?: boolean;
}

export function OptimizationPanel({ 
  onOptimize, 
  results, 
  summary, 
  isOptimizing = false 
}: OptimizationPanelProps) {
  const [constraints, setConstraints] = useState<OptimizationConstraints>({
    minServiceTrains: 18,
    maxMaintenanceTrains: 5,
    brandingPriorities: true,
    mileageBalancing: true,
    cleaningSchedule: true,
    stablingOptimization: true,
  });

  const handleOptimize = () => {
    onOptimize(constraints);
  };

  const updateConstraint = (key: keyof OptimizationConstraints, value: number | boolean) => {
    setConstraints(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Constraints Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Optimization Constraints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Requirements */}
          <div className="space-y-4">
            <h4 className="font-medium">Service Requirements</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Minimum Service Trains</label>
                <div className="w-32">
                  <Slider
                    value={[constraints.minServiceTrains]}
                    onValueChange={([value]) => updateConstraint('minServiceTrains', value)}
                    max={22}
                    min={15}
                    step={1}
                  />
                  <div className="text-xs text-center mt-1">{constraints.minServiceTrains}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Maximum Maintenance Trains</label>
                <div className="w-32">
                  <Slider
                    value={[constraints.maxMaintenanceTrains]}
                    onValueChange={([value]) => updateConstraint('maxMaintenanceTrains', value)}
                    max={8}
                    min={2}
                    step={1}
                  />
                  <div className="text-xs text-center mt-1">{constraints.maxMaintenanceTrains}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Optimization Features */}
          <div className="space-y-4">
            <h4 className="font-medium">Optimization Features</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Branding Priorities</label>
                  <p className="text-xs text-muted-foreground">Prioritize trains with high-value advertising contracts</p>
                </div>
                <Switch
                  checked={constraints.brandingPriorities}
                  onCheckedChange={(checked) => updateConstraint('brandingPriorities', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Mileage Balancing</label>
                  <p className="text-xs text-muted-foreground">Balance wear across fleet for optimal lifecycle</p>
                </div>
                <Switch
                  checked={constraints.mileageBalancing}
                  onCheckedChange={(checked) => updateConstraint('mileageBalancing', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Cleaning Schedule</label>
                  <p className="text-xs text-muted-foreground">Optimize cleaning bay utilization</p>
                </div>
                <Switch
                  checked={constraints.cleaningSchedule}
                  onCheckedChange={(checked) => updateConstraint('cleaningSchedule', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Stabling Optimization</label>
                  <p className="text-xs text-muted-foreground">Minimize shunting operations and energy costs</p>
                </div>
                <Switch
                  checked={constraints.stablingOptimization}
                  onCheckedChange={(checked) => updateConstraint('stablingOptimization', checked)}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleOptimize} 
            className="w-full" 
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Optimization
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Optimization Summary */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Optimization Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.serviceReady}</div>
                <div className="text-xs text-muted-foreground">Service Ready</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.standbyCount}</div>
                <div className="text-xs text-muted-foreground">Standby</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{summary.maintenanceRequired}</div>
                <div className="text-xs text-muted-foreground">Maintenance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.iblScheduled}</div>
                <div className="text-xs text-muted-foreground">IBL</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">{summary.estimatedEfficiency.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Fleet Efficiency</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-500" />
                <div>
                  <div className="text-sm font-medium">₹{summary.potentialSavings.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Daily Savings</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Recommendations */}
      {results && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Priority Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.slice(0, 5).map((result) => (
                <div key={result.trainId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.conflicts.length > 0 ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <div className="font-medium">{result.trainId}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.reasoning[0]}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={result.recommendedStatus === 'service' ? 'default' : 'secondary'}
                    >
                      {result.recommendedStatus}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {result.confidence}% confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}