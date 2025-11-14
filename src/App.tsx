import React, { useState, useEffect } from 'react';
import { BarChart3Icon, DatabaseIcon, TargetIcon, AwardIcon } from './assets/icons';
import { PredictionForm } from './components/PredictionForm';
import { PredictionResult } from './components/PredictionResult';
import { Charts } from './components/Charts';
import { StatsCard } from './components/StatsCard';
import { DataAnalyzer } from './components/DataAnalyzer';
import { loadAndAnalyzeCSV, AdultDataRow } from './utils/csvLoader';
import { cleanData } from './utils/dataClean';
import { predictIncome } from './utils/predictionEngine';
import { statsData } from './data/chartData';
import { PredictionFormData, PredictionResult as PredictionResultType } from './types';

function App() {
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<AdultDataRow[]>([]);
  const [csvAnalysis, setCsvAnalysis] = useState<any>(null);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    loadAndAnalyzeCSV()
      .then(({ data, analysis }) => {
        const cleanedData = cleanData(data);
        setCsvData(cleanedData);
        setCsvAnalysis(analysis);
      })
      .catch(error => {
        console.error('Error loading CSV:', error);
        setDataError(error.message);
      });
  }, []);

  const handlePrediction = async (data: PredictionFormData) => {
    setIsLoading(true);
    try {
      // small UX delay so spinner is visible for quick requests
      await new Promise((r) => setTimeout(r, 300));
      const result = await predictIncome(data);
      setPredictionResult(result as PredictionResultType);
    } catch (err) {
      console.error('Prediction failed in UI:', err);
      setPredictionResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BarChart3Icon className="w-12 h-12 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-3">
            Income Predictor Pro
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Advanced ML-powered income prediction based on US Census data. Analyze demographics and predict earning potential with 85% accuracy.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <StatsCard
            title="Dataset Size"
            value={statsData.datasetSize.toLocaleString()}
            subtitle="Census records analyzed"
            icon={<DatabaseIcon className="w-6 h-6" />}
          />
          <StatsCard
            title="Model Accuracy"
            value={`${statsData.modelAccuracy}%`}
            subtitle="Prediction accuracy rate"
            icon={<TargetIcon className="w-6 h-6" />}
          />
          <StatsCard
            title="Key Features"
            value={statsData.keyFeatures.length}
            subtitle={statsData.keyFeatures.join(', ')}
            icon={<AwardIcon className="w-6 h-6" />}
          />
          <StatsCard
            title="Income Threshold"
            value="$50K"
            subtitle="Annual income cutoff"
            icon={<BarChart3Icon className="w-6 h-6" />}
          />
        </div>

        <div className="space-y-6 mb-8 sm:mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Enter Demographics
            </h2>
            <div className="max-w-3xl mx-auto">
              <PredictionForm onSubmit={handlePrediction} isLoading={isLoading} />
            </div>
          </div>

          {predictionResult ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
              <PredictionResult result={predictionResult} />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col items-center justify-center text-center">
              <TargetIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Fill out the form and click "Predict Income" to see your results
              </p>
            </div>
          )}
        </div>

        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Dataset Analysis
          </h2>
          {dataError ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
              {dataError}
            </div>
          ) : !csvAnalysis ? (
            <div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg h-64"></div>
          ) : (
            <DataAnalyzer data={csvData} analysis={csvAnalysis} />
          )}
        </div>

        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Data Insights
          </h2>
          <Charts />
        </div>

        <footer className="text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-8">
          <p>
            Based on US Census Bureau data. Model trained on 32,561 records with 85% accuracy.
          </p>
          <p className="mt-2">
            For educational and demonstration purposes only.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
