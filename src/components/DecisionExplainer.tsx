import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { OptimizationResult } from '@/lib/optimizationEngine';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  TrendingUp,
  Settings,
  Lightbulb
} from 'lucide-react';

interface DecisionExplainerProps {
  results: OptimizationResult[];
  selectedTrainId?: string;
  onTrainSelect: (trainId: string) => void;
}

export function DecisionExplainer({ results, selectedTrainId, onTrainSelect }: DecisionExplainerProps) {
  const [activeTab, setActiveTab] = useState('reasoning');
  
  const selectedResult = results.find(r => r.trainId === selectedTrainId);
  const conflictResults = results.filter(r => r.conflicts.length > 0);
  const highConfidenceResults = results.filter(r => r.confidence >= 80);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* AI Decision Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Decision Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
              <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="reasoning" className="space-y-4">
              {selectedResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{selectedResult.trainId}</h3>
                    <Badge variant={selectedResult.recommendedStatus === 'service' ? 'default' : 'secondary'}>
                      {selectedResult.recommendedStatus}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confidence Level</span>
                      <span className={`font-medium ${getConfidenceColor(selectedResult.confidence)}`}>
                        {selectedResult.confidence}%
                      </span>
                    </div>
                    <Progress 
                      value={selectedResult.confidence} 
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Decision Factors
                    </h4>
                    {selectedResult.reasoning.map((reason, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{reason}</span>
                      </div>
                    ))}
                  </div>

                  {selectedResult.conflicts.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        Conflicts Detected
                      </h4>
                      {selectedResult.conflicts.map((conflict, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-700">{conflict}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a train from the fleet to see detailed AI reasoning</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="conflicts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Conflict Analysis</h3>
                <Badge variant="destructive">{conflictResults.length} Issues</Badge>
              </div>
              
              {conflictResults.length > 0 ? (
                <div className="space-y-3">
                  {conflictResults.map((result) => (
                    <Card key={result.trainId} className="border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Button
                            variant="link"
                            className="p-0 h-auto font-medium"
                            onClick={() => onTrainSelect(result.trainId)}
                          >
                            {result.trainId}
                          </Button>
                          <Badge variant="destructive">
                            {result.conflicts.length} conflicts
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {result.conflicts.map((conflict, index) => (
                            <div key={index} className="text-sm text-red-600 flex items-center gap-2">
                              <AlertTriangle className="w-3 h-3" />
                              {conflict}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>No conflicts detected in current optimization</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <h4 className="font-medium">High Confidence Decisions</h4>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {highConfidenceResults.length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Trains with &gt;80% confidence rating
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="w-4 h-4 text-blue-500" />
                      <h4 className="font-medium">Optimization Impact</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Service Readiness</span>
                        <span className="font-medium">
                          {results.filter(r => r.recommendedStatus === 'service').length}/25
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Maintenance Required</span>
                        <span className="font-medium">
                          {results.filter(r => r.recommendedStatus === 'maintenance').length}/25
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>IBL Scheduled</span>
                        <span className="font-medium">
                          {results.filter(r => r.recommendedStatus === 'ibl').length}/25
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-orange-500" />
                      <h4 className="font-medium">Key Recommendations</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>• Prioritize fitness certificate renewals for 3 trainsets</p>
                      <p>• Schedule deep cleaning for 5 trainsets during low-demand hours</p>
                      <p>• Balance mileage distribution to extend component lifecycle</p>
                      <p>• Optimize stabling positions to reduce shunting by 15%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}