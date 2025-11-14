import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { educationIncomeData, ageDistributionData, genderPayGapData } from '../data/chartData';

export const Charts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'education' | 'age' | 'gender'>('education');

  const tabs = [
    { id: 'education' as const, label: 'Education vs Income' },
    { id: 'age' as const, label: 'Age Distribution' },
    { id: 'gender' as const, label: 'Gender Pay Gap' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 font-medium text-sm rounded-t-lg transition-all ${
              activeTab === tab.id
                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-b-2 border-teal-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="h-80">
        {activeTab === 'education' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={educationIncomeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="highIncome" fill="#0d9488" name="High Income (>50K)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="lowIncome" fill="#f59e0b" name="Low Income (<=50K)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'age' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value" fill="#0d9488" name="People Count" radius={[8, 8, 0, 0]}>
                {ageDistributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${173 - index * 10}, 70%, 45%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'gender' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={genderPayGapData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="highIncome" fill="#0d9488" name="High Income (>50K)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="lowIncome" fill="#f59e0b" name="Low Income (<=50K)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
