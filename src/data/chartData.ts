import { ChartDataPoint } from '../types';

export const educationIncomeData: ChartDataPoint[] = [
  { name: 'Doctorate', highIncome: 75, lowIncome: 25, percentage: 75 },
  { name: 'Masters', highIncome: 58, lowIncome: 42, percentage: 58 },
  { name: 'Bachelors', highIncome: 42, lowIncome: 58, percentage: 42 },
  { name: 'Some-college', highIncome: 23, lowIncome: 77, percentage: 23 },
  { name: 'HS-grad', highIncome: 18, lowIncome: 82, percentage: 18 }
];

export const ageDistributionData: ChartDataPoint[] = [
  { name: '16-25', value: 3420 },
  { name: '26-35', value: 8945 },
  { name: '36-45', value: 9812 },
  { name: '46-55', value: 6734 },
  { name: '56-65', value: 2890 },
  { name: '66+', value: 760 }
];

export const genderPayGapData: ChartDataPoint[] = [
  { name: 'Male', highIncome: 31, lowIncome: 69 },
  { name: 'Female', highIncome: 11, lowIncome: 89 }
];

export const statsData = {
  datasetSize: 32561,
  modelAccuracy: 85,
  keyFeatures: ['Education', 'Hours/Week', 'Age', 'Occupation']
};
