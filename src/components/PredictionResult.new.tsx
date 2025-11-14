import React, { useState } from 'react';
import { TrendingUpIcon, TrendingDownIcon, BarChart3Icon } from '../assets/icons';
import { PredictionResult as PredictionResultType, ModelPlots as ModelPlotsType } from '../types';
import { ModelPlots } from './ModelPlots';
import Plot from 'react-plotly.js';

interface PredictionResultProps {
  result: PredictionResultType;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  const isHighIncome = result.prediction === '>50K';
  const [plots, setPlots] = useState<ModelPlotsType | null>(null);
  const [isGeneratingPlots, setIsGeneratingPlots] = useState(false);
  const [showPlots, setShowPlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlots = () => {
    // Toggle plots visibility if they're already shown
    if (showPlots) {
      setShowPlots(false);
      return;
    }

    // If we have plots data, just show it
    if (plots) {
      setShowPlots(true);
      return;
    }

    // Create mock visualization data from the prediction result
    const mockPlots = {
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

    setPlots(mockPlots);
    setShowPlots(true);
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Prediction Result</h3>
        {isHighIncome ? (
          <TrendingUpIcon className="w-6 h-6 text-teal-600" />
        ) : (
          <TrendingDownIcon className="w-6 h-6 text-amber-600" />
        )}
      </div>

      <div className="space-y-4">
        {/* Model Predictions */}
        {result.modelPredictions && (
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Model Predictions</p>
            <div className="space-y-2">
              {result.modelPredictions.map((prediction, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    {prediction.model}:
                  </span>
                  <span className={`text-sm font-medium ${
                    prediction.probability > 0.5
                      ? 'text-teal-600'
                      : 'text-amber-600'
                  }`}>
                    {Math.round(prediction.probability * 100)}% confident
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visualization Section */}
        <div className="mt-8 border-t border-slate-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Model Visualizations</h3>
            <div className="space-x-4">
              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}
              <button
                onClick={generatePlots}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium 
                  ${showPlots
                    ? 'bg-slate-600 text-white hover:bg-slate-700'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
              >
                <BarChart3Icon className="w-4 h-4 mr-2" />
                {showPlots ? 'Hide Plots' : 'Show Plots'}
              </button>
            </div>
          </div>

          {showPlots && plots && (
            <ModelPlots plots={plots} />
          )}
        </div>
      </div>
    </div>
  );
};