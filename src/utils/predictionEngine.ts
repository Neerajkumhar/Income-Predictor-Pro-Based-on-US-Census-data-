import { PredictionFormData, PredictionResult, ModelPrediction } from '../types';
import { predictDetailedIncome } from './detailedPrediction';

const API_URL = 'http://localhost:8080';

const checkServerStatus = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

export const predictIncome = async (data: PredictionFormData): Promise<PredictionResult> => {
  try {
    // Check if server is available
    const isServerAvailable = await checkServerStatus();
    if (!isServerAvailable) {
      throw new Error('ML service is not available. Please ensure the server is running at http://localhost:8080');
    }

    // Get ML model predictions
    const mlResponse = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: data.age,
        education: data.education,
        occupation: data.occupation,
        hoursPerWeek: data.hoursPerWeek,
        region: data.region
      })
    });

    if (!mlResponse.ok) {
      // Try to parse server error details for a clearer message
      let errMsg = `Failed to get ML predictions: ${mlResponse.status} ${mlResponse.statusText}`;
      try {
        const errBody = await mlResponse.json();
        if (errBody && errBody.detail) errMsg = `Failed to get ML predictions: ${errBody.detail}`;
      } catch (e) {
        // ignore JSON parse errors
      }
      throw new Error(errMsg);
    }

    const mlData = await mlResponse.json();
    const modelPredictions: ModelPrediction[] = Object.entries(mlData.predictions).map(([model, probability]) => ({
      model,
      probability: probability as number
    }));

    // Calculate ensemble prediction (average probability)
    const avgProbability = modelPredictions.reduce((sum, pred) => sum + pred.probability, 0) / modelPredictions.length;
    
    // Get detailed income prediction for salary ranges
    const detailedPrediction = predictDetailedIncome({
      age: data.age,
      education: data.education,
      occupation: data.occupation,
      hoursPerWeek: data.hoursPerWeek,
      region: data.region || 'Urban-Med',
      expectedMinSalary: data.expectedMinSalary,
      expectedMaxSalary: data.expectedMaxSalary
    });

    // Determine final prediction based on ensemble
    const prediction: '>50K' | '<=50K' = avgProbability > 0.5 ? '>50K' : '<=50K';
    
    // Convert probability to confidence percentage
    const confidence = Math.round(Math.abs(avgProbability - 0.5) * 200);

    // Generate explanation using model predictions and feature importance
    const topModel = modelPredictions.reduce((a, b) => 
      Math.abs(b.probability - 0.5) > Math.abs(a.probability - 0.5) ? b : a
    );

    const topFeatures = Object.entries(mlData.feature_importance)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 2)
      .map(([feature]) => feature);

    const explanation = prediction === '>50K'
      ? `High income predicted with ${confidence}% confidence. ${topModel.model} model shows strongest prediction. Key factors: ${topFeatures.join(', ')}.`
      : `Standard income predicted with ${confidence}% confidence. ${topModel.model} model shows strongest prediction. Key factors: ${topFeatures.join(', ')}.`;

    return { 
      prediction, 
      confidence, 
      explanation,
      detailedPrediction,
      modelPredictions,
      featureImportance: mlData.feature_importance,
      plots: mlData.plots
    };
  } catch (error) {
    console.error('Prediction error:', error);
    // Fallback to basic prediction if ML service fails
    const detailedPrediction = predictDetailedIncome({
      age: data.age,
      education: data.education,
      occupation: data.occupation,
      hoursPerWeek: data.hoursPerWeek,
      region: data.region || 'Urban-Med',
      expectedMinSalary: data.expectedMinSalary,
      expectedMaxSalary: data.expectedMaxSalary
    });

    const prediction: '>50K' | '<=50K' = detailedPrediction.totalSalary > 50000 ? '>50K' : '<=50K';
    const confidence = 70; // Default confidence for fallback prediction

    return { 
      prediction, 
      confidence, 
      explanation: 'Using basic prediction model (ML service unavailable)',
      detailedPrediction
    };
  }
};


