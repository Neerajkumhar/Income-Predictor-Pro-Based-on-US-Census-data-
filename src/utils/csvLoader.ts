import Papa from 'papaparse';

export interface AdultDataRow {
  age: number;
  workclass: string;
  fnlwgt: number;
  education: string;
  'education-num': number;
  'marital-status': string;
  occupation: string;
  relationship: string;
  race: string;
  sex: string;
  'capital-gain': number;
  'capital-loss': number;
  'hours-per-week': number;
  'native-country': string;
  income: string;
}

export async function loadAndAnalyzeCSV(): Promise<{
  data: AdultDataRow[];
  analysis: {
    totalRows: number;
    missingValues: Record<keyof AdultDataRow, number>;
    uniqueValues: Record<keyof AdultDataRow, Set<string | number>>;
    numericalStats: Record<string, { min: number; max: number; avg: number }>;
  };
}> {
  const response = await fetch('/data/adult.csv');
  const csvText = await response.text();
  
  const result = Papa.parse<AdultDataRow>(csvText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  const data = result.data;
  const analysis = {
    totalRows: data.length,
    missingValues: {} as Record<keyof AdultDataRow, number>,
    uniqueValues: {} as Record<keyof AdultDataRow, Set<string | number>>,
    numericalStats: {} as Record<string, { min: number; max: number; avg: number }>,
  };

  // Initialize analysis objects
  Object.keys(data[0]).forEach((key) => {
    analysis.missingValues[key as keyof AdultDataRow] = 0;
    analysis.uniqueValues[key as keyof AdultDataRow] = new Set();
  });

  // Analyze each row
  data.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      // Count missing values
      if (value === null || value === undefined || value === '') {
        analysis.missingValues[key as keyof AdultDataRow]++;
      }

      // Track unique values
      analysis.uniqueValues[key as keyof AdultDataRow].add(value as string | number);

      // Calculate numerical stats
      if (typeof value === 'number') {
        if (!analysis.numericalStats[key]) {
          analysis.numericalStats[key] = {
            min: value,
            max: value,
            avg: 0,
          };
        }
        const stats = analysis.numericalStats[key];
        stats.min = Math.min(stats.min, value);
        stats.max = Math.max(stats.max, value);
      }
    });
  });

  // Calculate averages for numerical fields
  Object.entries(analysis.numericalStats).forEach(([key, stats]) => {
    const sum = data.reduce((acc, row) => acc + (row[key as keyof AdultDataRow] as number || 0), 0);
    stats.avg = sum / data.length;
  });

  return { data, analysis };
}