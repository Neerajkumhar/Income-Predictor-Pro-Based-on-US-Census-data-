import React from 'react';
import Plot from 'react-plotly.js';

interface ModelPlotsProps {
  plots: {
    confusion_matrices: { [key: string]: string };
    roc_curves: { [key: string]: string };
    feature_importance: string;
  };
}

export const ModelPlots: React.FC<ModelPlotsProps> = ({ plots }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Model Performance Visualization</h3>
        
        {/* Feature Importance Plot */}
        <div className="mb-8">
          <h4 className="text-md font-medium mb-2">Feature Importance</h4>
          <div className="bg-white p-4 rounded-lg shadow">
            <Plot
              data={JSON.parse(plots.feature_importance).data}
              layout={JSON.parse(plots.feature_importance).layout}
              config={{ responsive: true }}
            />
          </div>
        </div>

        {/* Confusion Matrices */}
        <div className="mb-8">
          <h4 className="text-md font-medium mb-2">Confusion Matrices</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(plots.confusion_matrices).map(([model, plotJson]) => (
              <div key={model} className="bg-white p-4 rounded-lg shadow">
                <Plot
                  data={JSON.parse(plotJson).data}
                  layout={JSON.parse(plotJson).layout}
                  config={{ responsive: true }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ROC Curves */}
        <div>
          <h4 className="text-md font-medium mb-2">ROC Curves</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(plots.roc_curves).map(([model, plotJson]) => (
              <div key={model} className="bg-white p-4 rounded-lg shadow">
                <Plot
                  data={JSON.parse(plotJson).data}
                  layout={JSON.parse(plotJson).layout}
                  config={{ responsive: true }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};