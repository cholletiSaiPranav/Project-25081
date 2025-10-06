import { TrainSet, OptimizationConstraints } from './trainData';

export interface OptimizationResult {
  trainId: string;
  recommendedStatus: 'service' | 'standby' | 'maintenance' | 'ibl';
  confidence: number;
  reasoning: string[];
  conflicts: string[];
  priority: number;
}

export interface OptimizationSummary {
  totalOptimized: number;
  serviceReady: number;
  standbyCount: number;
  maintenanceRequired: number;
  iblScheduled: number;
  estimatedEfficiency: number;
  potentialSavings: number;
}

export class OptimizationEngine {
  static optimize(trains: TrainSet[], constraints: OptimizationConstraints): OptimizationResult[] {
    return trains.map(train => {
      const reasoning: string[] = [];
      const conflicts: string[] = [];
      let confidence = 100;
      let recommendedStatus: 'service' | 'standby' | 'maintenance' | 'ibl' = 'service';
      let priority = 50;

      // Fitness Certificate Analysis
      const fitnessIssues = [];
      if (!train.fitnessStatus.rollingStock.valid) {
        fitnessIssues.push('Rolling Stock certificate expired');
        conflicts.push('Invalid Rolling Stock certificate');
        confidence -= 30;
      }
      if (!train.fitnessStatus.signalling.valid) {
        fitnessIssues.push('Signalling certificate expired');
        conflicts.push('Invalid Signalling certificate');
        confidence -= 25;
      }
      if (!train.fitnessStatus.telecom.valid) {
        fitnessIssues.push('Telecom certificate expired');
        conflicts.push('Invalid Telecom certificate');
        confidence -= 20;
      }

      // Job Card Analysis
      if (train.jobCards.critical > 0) {
        reasoning.push(`${train.jobCards.critical} critical job cards require immediate attention`);
        recommendedStatus = 'maintenance';
        priority += 30;
        confidence -= 15;
      } else if (train.jobCards.open > 2) {
        reasoning.push(`${train.jobCards.open} open job cards suggest maintenance scheduling`);
        if (recommendedStatus === 'service') recommendedStatus = 'standby';
        confidence -= 10;
      }

      // Branding Priority Analysis
      if (constraints.brandingPriorities && train.branding.priority === 'high') {
        const completionRate = (train.branding.completedHours / train.branding.contractHours) * 100;
        if (completionRate < 80) {
          reasoning.push(`High priority branding contract (${train.branding.advertiser}) at ${completionRate.toFixed(1)}% completion`);
          if (recommendedStatus !== 'maintenance') recommendedStatus = 'service';
          priority += 25;
        }
      }

      // Mileage Balancing
      if (constraints.mileageBalancing) {
        if (train.mileage.lastService > train.mileage.nextServiceDue) {
          reasoning.push('Mileage threshold exceeded - maintenance required');
          recommendedStatus = 'maintenance';
          priority += 40;
          confidence -= 20;
        } else if (train.mileage.lastService > train.mileage.nextServiceDue * 0.8) {
          reasoning.push('Approaching mileage service threshold');
          confidence -= 5;
        }
      }

      // Cleaning Schedule
      if (constraints.cleaningSchedule && train.cleaning.deepCleanDue) {
        reasoning.push('Deep cleaning overdue');
        if (recommendedStatus === 'service') recommendedStatus = 'ibl';
        priority += 15;
      }

      // Stabling Optimization
      if (constraints.stablingOptimization) {
        if (train.stablingBay > 25) {
          reasoning.push('Suboptimal stabling position - high shunting cost');
          confidence -= 5;
        }
      }

      // Final decision logic
      if (fitnessIssues.length > 0) {
        recommendedStatus = 'ibl';
        reasoning.push('Fitness certificate issues require immediate attention');
        priority += 50;
      }

      // Ensure minimum reasoning
      if (reasoning.length === 0) {
        reasoning.push('All systems nominal - suitable for service');
      }

      // Adjust confidence based on conflicts
      confidence = Math.max(0, Math.min(100, confidence));

      return {
        trainId: train.id,
        recommendedStatus,
        confidence,
        reasoning,
        conflicts,
        priority,
      };
    }).sort((a, b) => b.priority - a.priority);
  }

  static generateSummary(results: OptimizationResult[]): OptimizationSummary {
    const summary = results.reduce((acc, result) => {
      acc.totalOptimized++;
      switch (result.recommendedStatus) {
        case 'service': acc.serviceReady++; break;
        case 'standby': acc.standbyCount++; break;
        case 'maintenance': acc.maintenanceRequired++; break;
        case 'ibl': acc.iblScheduled++; break;
      }
      return acc;
    }, {
      totalOptimized: 0,
      serviceReady: 0,
      standbyCount: 0,
      maintenanceRequired: 0,
      iblScheduled: 0,
      estimatedEfficiency: 0,
      potentialSavings: 0,
    });

    summary.estimatedEfficiency = (summary.serviceReady / summary.totalOptimized) * 100;
    summary.potentialSavings = summary.serviceReady * 1250 + summary.standbyCount * 300; // Mock savings calculation

    return summary;
  }

  static simulateWhatIf(trains: TrainSet[], changes: Record<string, Partial<TrainSet>>): OptimizationResult[] {
    const modifiedTrains = trains.map(train => {
      if (changes[train.id]) {
        return { ...train, ...changes[train.id] };
      }
      return train;
    });

    return this.optimize(modifiedTrains, {
      minServiceTrains: 18,
      maxMaintenanceTrains: 5,
      brandingPriorities: true,
      mileageBalancing: true,
      cleaningSchedule: true,
      stablingOptimization: true,
    });
  }
}