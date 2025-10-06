import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TrainSet } from '@/lib/trainData';
import { 
  AlertTriangle, 
  Clock, 
  Wrench, 
  MapPin, 
  Calendar,
  TrendingUp 
} from 'lucide-react';

interface TrainFleetGridProps {
  trains: TrainSet[];
  onStatusChange: (trainId: string, newStatus: TrainSet['status']) => void;
}

export function TrainFleetGrid({ trains, onStatusChange }: TrainFleetGridProps) {
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);

  const getFitnessScore = (train: TrainSet) => {
    const validCerts = [
      train.fitnessStatus.rollingStock.valid,
      train.fitnessStatus.signalling.valid,
      train.fitnessStatus.telecom.valid,
    ].filter(Boolean).length;
    return (validCerts / 3) * 100;
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {trains.map((train) => {
        const fitnessScore = getFitnessScore(train);
        const isSelected = selectedTrain === train.id;
        
        return (
          <Card 
            key={train.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedTrain(isSelected ? null : train.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{train.name}</CardTitle>
                <StatusBadge status={train.status} />
              </div>
              <div className="text-sm text-muted-foreground">{train.id}</div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Fitness Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Fitness</span>
                </div>
                <span className={`text-sm font-medium ${getHealthColor(fitnessScore)}`}>
                  {fitnessScore.toFixed(0)}%
                </span>
              </div>

              {/* Job Cards */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  <span className="text-sm">Job Cards</span>
                </div>
                <div className="flex gap-1">
                  {train.jobCards.critical > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {train.jobCards.critical} Critical
                    </Badge>
                  )}
                  {train.jobCards.open > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {train.jobCards.open} Open
                    </Badge>
                  )}
                </div>
              </div>

              {/* Branding */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Branding</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{train.branding.advertiser}</div>
                  <div className="text-xs">
                    {train.branding.completedHours}/{train.branding.contractHours}h
                  </div>
                </div>
              </div>

              {/* Mileage */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Mileage</span>
                </div>
                <div className="text-right">
                  <div className="text-xs">{train.mileage.lastService.toLocaleString()} km</div>
                  <div className="text-xs text-muted-foreground">
                    Next: {train.mileage.nextServiceDue.toLocaleString()} km
                  </div>
                </div>
              </div>

              {/* Last Cleaning */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Cleaned</span>
                </div>
                <div className="text-right">
                  <div className="text-xs">{train.cleaning.lastCleaned}</div>
                  {train.cleaning.deepCleanDue && (
                    <Badge variant="outline" className="text-xs">Due</Badge>
                  )}
                </div>
              </div>

              {/* Stabling Bay */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Bay {train.stablingBay}</span>
                <div className="text-sm font-medium text-blue-600">
                  {train.predictedAvailability}% Ready
                </div>
              </div>

              {/* Quick Actions */}
              {isSelected && (
                <div className="pt-2 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(train.id, 'service');
                      }}
                    >
                      Service
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(train.id, 'standby');
                      }}
                    >
                      Standby
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(train.id, 'maintenance');
                      }}
                    >
                      Maintenance
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(train.id, 'ibl');
                      }}
                    >
                      IBL
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}