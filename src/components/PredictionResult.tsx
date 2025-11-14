import { useState } from 'react';
import { TrendingUpIcon, TrendingDownIcon, BarChart3Icon } from '../assets/icons';
import { PredictionResult as PredictionResultType, ModelPlots as ModelPlotsType } from '../types';
import { ModelPlots } from './ModelPlots';
import Plot from 'react-plotly.js';

interface PredictionResultProps {
  result: PredictionResultType;
}

export const PredictionResult = ({ result }: PredictionResultProps): JSX.Element => {
  const isHighIncome = result.prediction === '>50K';
  const [plots, setPlots] = useState<ModelPlotsType | null>(null);
  const [showPlots, setShowPlots] = useState(false);
  const [showSalaryPlot, setShowSalaryPlot] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePlots = () => {
    try {
      // If plots are already shown, just hide them
      if (showPlots) {
        setShowPlots(false);
        return;
      }
    
      // If we already have plots data, show it without regenerating
      if (plots) {
        setShowPlots(true);
        return;
      }

      // Create local visualization data
      const localPlots = {
        confusion_matrices: {},
        roc_curves: {},
        feature_importance: JSON.stringify({
          data: [{
            type: 'bar',
            x: Object.values(result.featureImportance || {}),
            y: Object.keys(result.featureImportance || {}),
            orientation: 'h'
          }],
          layout: {
            title: 'Feature Importance',
            margin: { l: 150 }
          }
        })
      };
      
      setPlots(localPlots);
      setShowPlots(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate visualization';
      setError(message);
      console.error('Error generating plots:', err);
      setShowPlots(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Prediction Result</h3>
        {isHighIncome ? (
          <TrendingUpIcon className="w-6 h-6 text-teal-600" />
        ) : (
          <TrendingDownIcon className="w-6 h-6 text-amber-600" />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Predicted Annual Income</p>
          <div className="space-y-2">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-lg text-2xl font-bold ${
                isHighIncome
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
              }`}
              role="button"
              tabIndex={0}
              onClick={() => setShowSalaryPlot((s) => !s)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowSalaryPlot((s) => !s); }}
              style={{ cursor: 'pointer' }}
            >
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(result?.detailedPrediction?.totalSalary ?? 0)}
            </span>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Range: {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(result?.detailedPrediction?.salaryRange?.min ?? 0)} - {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(result?.detailedPrediction?.salaryRange?.max ?? 0)}
            </div>
          </div>
        </div>

        {/* Inline prediction graph toggled by clicking the amount above */}
        {showSalaryPlot && (
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow mt-4">
            <Plot
              data={[
                {
                  x: ['Min', 'Predicted', 'Max'],
                  y: [
                    result?.detailedPrediction?.salaryRange?.min ?? 0,
                    result?.detailedPrediction?.totalSalary ?? 0,
                    result?.detailedPrediction?.salaryRange?.max ?? 0,
                  ],
                  type: 'bar',
                  marker: { color: ['#94a3b8', '#14b8a6', '#94a3b8'] },
                },
              ]}
              layout={{
                title: { text: 'Predicted Salary vs Range' },
                width: 480,
                height: 260,
                margin: { t: 40, l: 60, r: 20, b: 40 },
                yaxis: { title: { text: 'INR' } },
              }}
              config={{ responsive: true }}
            />
          </div>
        )}

        {/* CNN and GNN illustrative visualizations */}
        {showSalaryPlot && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* CNN schematic: stacked heatmaps to illustrate conv layers */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
              <h4 className="text-sm font-medium mb-2">CNN (schematic)</h4>
              <Plot
                data={[
                  {
                    z: [
                      [0.1, 0.2, 0.3, 0.2],
                      [0.2, 0.6, 0.8, 0.3],
                      [0.1, 0.7, 0.9, 0.4],
                      [0.05, 0.2, 0.3, 0.1],
                    ],
                    type: 'heatmap',
                    colorscale: 'Viridis',
                    showscale: false,
                    name: 'Input',
                    xgap: 2,
                    ygap: 2,
                  },
                  {
                    z: [
                      [0.2, 0.4],
                      [0.6, 0.3],
                    ],
                    type: 'heatmap',
                    colorscale: 'Cividis',
                    showscale: false,
                    opacity: 0.9,
                    xaxis: 'x2',
                    yaxis: 'y2',
                    name: 'Feature Map',
                  },
                ]}
                layout={{
                  grid: { rows: 1, columns: 2, pattern: 'independent' },
                  annotations: [
                    { text: 'Input', x: 0.18, y: 1.05, showarrow: false, xref: 'paper', yref: 'paper' },
                    { text: 'Feature Map', x: 0.82, y: 1.05, showarrow: false, xref: 'paper', yref: 'paper' },
                  ],
                  width: 480,
                  height: 260,
                  margin: { t: 40, l: 40, r: 20, b: 40 },
                }}
                config={{ responsive: true }}
              />
            </div>

            {/* GNN graph: nodes + edges, color indicates contribution/high-income likelihood */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
              <h4 className="text-sm font-medium mb-2">GNN (node graph)</h4>
              <Plot
                data={[
                  // edges as lines
                  {
                    type: 'scatter',
                    mode: 'lines',
                    x: [0, 1, null, 1, 2, null, 0, 2],
                    y: [0, 1, null, 0, 1, null, 0, 1],
                    line: { color: '#cbd5e1', width: 2 },
                    hoverinfo: 'none',
                    showlegend: false,
                  },
                  // nodes
                  {
                    type: 'scatter',
                      mode: 'text+markers' as const,
                    x: [0, 1, 2, 1],
                    y: [0, 1, 1, 0],
                    marker: {
                      size: 36,
                      color: [
                        (result?.featureImportance?.education ?? 0) * 100 + 50,
                        (result?.featureImportance?.occupation ?? 0) * 100 + 50,
                        (result?.featureImportance?.experience ?? 0) * 100 + 50,
                        (result?.featureImportance?.hours ?? 0) * 100 + 50,
                      ],
                      colorscale: 'RdYlGn',
                      showscale: false,
                    },
                    text: ['Education', 'Occupation', 'Experience', 'Hours'],
                    textposition: 'bottom center',
                    hoverinfo: 'text' as const,
                    hovertext: [
                      `Education importance: ${(result?.featureImportance?.education ?? 0).toFixed(2)}`,
                      `Occupation importance: ${(result?.featureImportance?.occupation ?? 0).toFixed(2)}`,
                      `Experience importance: ${(result?.featureImportance?.experience ?? 0).toFixed(2)}`,
                      `Hours importance: ${(result?.featureImportance?.hours ?? 0).toFixed(2)}`,
                    ],
                  },
                ]}
                layout={{
                  xaxis: { visible: false },
                  yaxis: { visible: false },
                  width: 480,
                  height: 260,
                  margin: { t: 30, l: 20, r: 20, b: 20 },
                }}
                config={{ responsive: true }}
              />
            </div>
          </div>
        )}

        {result.modelPredictions && (
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">ML Model Predictions</p>
            <div className="space-y-2">
              {result.modelPredictions.map((prediction, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {prediction.model.replace('_', ' ').charAt(0).toUpperCase() + prediction.model.slice(1)}:
                  </span>
                  <span className={`text-sm font-medium ${
                    prediction.probability > 0.5
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {Math.round(prediction.probability * 100)}% high income
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visualization Section - Placed at bottom */}
        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Model Visualizations</h3>
            <div className="space-x-4">
              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              <button
                onClick={togglePlots}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium 
                  ${showPlots
                    ? 'bg-slate-600 text-white hover:bg-slate-700'
                    : 'bg-teal-600 text-white hover:bg-teal-700'}`}
              >
                <BarChart3Icon className="w-4 h-4 mr-2" />
                {showPlots ? 'Hide Plots' : 'Show Plots'}
              </button>
            </div>
          </div>

          {showPlots && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Salary Prediction Plot */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium mb-4">Predicted Salary Range</h4>
                <Plot
                  data={[
                    {
                      x: ['Min', 'Predicted', 'Max'],
                      y: [
                        result?.detailedPrediction?.salaryRange?.min ?? 0,
                        result?.detailedPrediction?.totalSalary ?? 0,
                        result?.detailedPrediction?.salaryRange?.max ?? 0,
                      ],
                      type: 'bar',
                      marker: { color: ['#94a3b8', '#14b8a6', '#94a3b8'] },
                    },
                  ]}
                  layout={{
                    autosize: true,
                    margin: { t: 10, l: 50, r: 20, b: 40 },
                    yaxis: { title: { text: 'INR' }, automargin: true },
                  }}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '300px' }}
                  config={{ responsive: true }}
                />
              </div>

              {/* CNN Visualization */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium mb-4">CNN Feature Maps</h4>
                <Plot
                  data={[
                    {
                      z: [
                        [0.1, 0.2, 0.3, 0.2],
                        [0.2, 0.6, 0.8, 0.3],
                        [0.1, 0.7, 0.9, 0.4],
                        [0.05, 0.2, 0.3, 0.1],
                      ],
                      type: 'heatmap',
                      colorscale: 'Viridis',
                      showscale: false,
                    },
                  ]}
                  layout={{
                    autosize: true,
                    margin: { t: 10, l: 40, r: 20, b: 40 },
                  }}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '300px' }}
                  config={{ responsive: true }}
                />
              </div>

              {/* GNN Visualization */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium mb-4">Feature Importance Graph</h4>
                <Plot
                  data={[
                    {
                      type: 'scatter',
                      mode: 'lines',
                      x: [0, 1, null, 1, 2, null, 0, 2],
                      y: [0, 1, null, 0, 1, null, 0, 1],
                      line: { color: '#cbd5e1', width: 2 },
                      hoverinfo: 'none',
                      showlegend: false,
                    },
                    {
                      type: 'scatter',
                      mode: 'text+markers' as const,
                      x: [0, 1, 2, 1],
                      y: [0, 1, 1, 0],
                      marker: {
                        size: 40,
                        color: [
                          (result?.featureImportance?.education ?? 0) * 100 + 50,
                          (result?.featureImportance?.occupation ?? 0) * 100 + 50,
                          (result?.featureImportance?.experience ?? 0) * 100 + 50,
                          (result?.featureImportance?.hours ?? 0) * 100 + 50,
                        ],
                        colorscale: 'RdYlGn' as const,
                        showscale: false,
                        line: { color: '#1f2937', width: 1 }
                      },
                      text: ['Education', 'Occupation', 'Experience', 'Hours'],
                      textposition: 'bottom center',
                      hoverinfo: 'text' as const,
                      hovertext: [
                        `Education importance: ${(result?.featureImportance?.education ?? 0).toFixed(2)}`,
                        `Occupation importance: ${(result?.featureImportance?.occupation ?? 0).toFixed(2)}`,
                        `Experience importance: ${(result?.featureImportance?.experience ?? 0).toFixed(2)}`,
                        `Hours importance: ${(result?.featureImportance?.hours ?? 0).toFixed(2)}`,
                      ],
                    },
                  ]}
                  layout={{
                    autosize: true,
                    showlegend: false,
                    xaxis: { visible: false, showgrid: false },
                    yaxis: { visible: false, showgrid: false },
                    margin: { t: 10, l: 10, r: 10, b: 10 },
                  }}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '300px' }}
                  config={{ responsive: true }}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Salary Breakdown</p>
          <div className="space-y-2">
            {(result?.detailedPrediction?.breakdown || []).map((factor, index) => (
              <div key={index} className="text-sm text-slate-600 dark:text-slate-400">
                {factor}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                INR Amount
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0
                }).format(result?.detailedPrediction?.totalSalary ?? 0)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">per year</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                USD Equivalent
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format((result?.detailedPrediction?.totalSalary ?? 0) / 83.12)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">per year</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
