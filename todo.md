KMRL Train Induction Planning System - MVP Implementation
Core Features to Implement:
1. Main Dashboard (src/pages/Index.tsx)
Overview of all 25 trainsets with status indicators
Real-time system health and KPI metrics
Quick action buttons for emergency overrides
2. Train Fleet Management (src/components/TrainFleetGrid.tsx)
Grid view of all trainsets with current status
Color-coded status indicators (Service Ready, Standby, Maintenance, IBL)
Quick status change capabilities
3. Optimization Engine Interface (src/components/OptimizationPanel.tsx)
Multi-objective optimization controls
Constraint configuration (fitness certificates, job cards, branding, mileage)
Generate optimized induction schedule
4. Decision Explanation (src/components/DecisionExplainer.tsx)
LIME/SHAP-style explanations for AI decisions
Conflict alerts and warnings
Reasoning breakdown for each trainset assignment
5. What-If Simulator (src/components/WhatIfSimulator.tsx)
Scenario planning interface
Parameter adjustment sliders
Impact prediction visualization
6. Data Integration Dashboard (src/components/DataSources.tsx)
Real-time data feed status from Maximo, IoT sensors, UNS
Data quality indicators
Manual override capabilities
7. Analytics & Reporting (src/components/Analytics.tsx)
Historical performance metrics
Mileage balancing charts
Branding exposure tracking
Maintenance cost analysis
8. Utility Components:
src/lib/trainData.ts - Mock data and types
src/lib/optimizationEngine.ts - Simulation of optimization algorithms
src/components/ui/StatusBadge.tsx - Custom status indicators
src/components/ui/MetricCard.tsx - KPI display cards
File Structure:
8 main component files
2 utility/data files
Custom UI components for domain-specific needs
Implementation Priority:
Data structures and mock data
Main dashboard layout
Train fleet grid with status management
Optimization panel with basic algorithms
Decision explanation interface
What-if simulator
Analytics dashboard
Data integration status panel
Editor