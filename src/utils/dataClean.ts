import { AdultDataRow } from './csvLoader';

export function cleanData(data: AdultDataRow[]): AdultDataRow[] {
  return data.map(row => ({
    ...row,
    // Remove leading/trailing spaces
    workclass: row.workclass?.trim() || 'Unknown',
    education: row.education?.trim() || 'Unknown',
    occupation: row.occupation?.trim() || 'Unknown',
    'marital-status': row['marital-status']?.trim() || 'Unknown',
    relationship: row.relationship?.trim() || 'Unknown',
    race: row.race?.trim() || 'Unknown',
    sex: row.sex?.trim() || 'Unknown',
    'native-country': row['native-country']?.trim() || 'Unknown',
    income: row.income?.trim() || '<=50K',
    
    // Fix numerical values
    age: Math.max(0, Number(row.age) || 0),
    'education-num': Math.max(0, Number(row['education-num']) || 0),
    'capital-gain': Math.max(0, Number(row['capital-gain']) || 0),
    'capital-loss': Math.max(0, Number(row['capital-loss']) || 0),
    'hours-per-week': Math.max(0, Number(row['hours-per-week']) || 0),
    fnlwgt: Math.max(0, Number(row.fnlwgt) || 0),
  }));
}