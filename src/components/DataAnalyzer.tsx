import React from 'react';
import { AdultDataRow } from '../utils/csvLoader';

interface DataAnalyzerProps {
  data: AdultDataRow[];
  analysis: {
    totalRows: number;
    missingValues: Record<keyof AdultDataRow, number>;
    uniqueValues: Record<keyof AdultDataRow, Set<string | number>>;
    numericalStats: Record<string, { min: number; max: number; avg: number }>;
  };
}

export function DataAnalyzer({ data, analysis }: DataAnalyzerProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Data Analysis</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Dataset Overview</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Total rows: {analysis.totalRows}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Missing Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(analysis.missingValues)
              .filter(([_, count]) => count > 0)
              .map(([field, count]) => (
                <div key={field} className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{field}:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{count}</span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Numerical Statistics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white">Field</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white">Min</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white">Max</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white">Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {Object.entries(analysis.numericalStats).map(([field, stats]) => (
                  <tr key={field}>
                    <td className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">{field}</td>
                    <td className="px-4 py-2 text-sm text-slate-900 dark:text-white">{stats.min.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-slate-900 dark:text-white">{stats.max.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-slate-900 dark:text-white">{stats.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Categorical Fields</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(analysis.uniqueValues)
              .filter(([field]) => !analysis.numericalStats[field])
              .map(([field, values]) => (
                <div key={field}>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{field}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {Array.from(values).slice(0, 5).join(', ')}
                    {values.size > 5 ? ` ... (${values.size} total)` : ''}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}