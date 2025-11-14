export interface PredictionFormData {
  age: number;
  education: string;
  occupation: string;
  hoursPerWeek: number;
  region: string;
  expectedMinSalary: number;  // in INR
  expectedMaxSalary: number;  // in INR
}

export interface ModelPrediction {
  model: string;
  probability: number;
}

export interface ModelPlots {
  confusion_matrices: { [key: string]: string };
  roc_curves: { [key: string]: string };
  feature_importance: string;
}

export interface PredictionResult {
  prediction: '>50K' | '<=50K';
  confidence: number;
  explanation: string;
  detailedPrediction: {
    baseSalary: number;
    totalSalary: number;
    salaryRange: {
      min: number;
      max: number;
    };
    factors: {
      education: number;
      occupation: number;
      experience: number;
      hours: number;
      region: number;
    };
    breakdown: string[];
  };
  modelPredictions?: ModelPrediction[];
  featureImportance?: { [key: string]: number };
  plots?: {
    confusion_matrices: { [key: string]: string };
    roc_curves: { [key: string]: string };
    feature_importance: string;
  };
}

export interface ChartDataPoint {
  name: string;
  value: number;
  percentage?: number;
  highIncome?: number;
  lowIncome?: number;
}
