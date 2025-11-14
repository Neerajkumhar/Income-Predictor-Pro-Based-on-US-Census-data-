from typing import Tuple, Dict, Any
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import plotly.graph_objs as go


class IncomeRegressor:
    def __init__(self):
        self.model: RandomForestRegressor | None = None
        self.preprocessor: ColumnTransformer | None = None
        self.feature_names: list[str] = []

    def _find_target(self, df: pd.DataFrame) -> str:
        # Common target column names
        for name in ['salary', 'income', 'target', 'label', 'y']:
            if name in df.columns:
                return name
        # fallback: last numeric column
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if numeric_cols:
            return numeric_cols[-1]
        raise ValueError('No numeric target column found in CSV')

    def train_from_df(self, df: pd.DataFrame) -> Tuple[Dict[str, float], Dict[str, str]]:
        target_col = self._find_target(df)
        X = df.drop(columns=[target_col])
        y = df[target_col].astype(float)

        # Identify categorical and numeric columns
        categorical = X.select_dtypes(include=['object', 'category']).columns.tolist()
        numeric = X.select_dtypes(include=[np.number]).columns.tolist()

        # Build preprocessing pipeline
        transformers = []
        if categorical:
            transformers.append(('cat', OneHotEncoder(handle_unknown='ignore'), categorical))
        if numeric:
            transformers.append(('num', StandardScaler(), numeric))

        preprocessor = ColumnTransformer(transformers)

        # Model pipeline
        pipeline = Pipeline([
            ('pre', preprocessor),
            ('model', RandomForestRegressor(
                n_estimators=100,
                random_state=42,
                oob_score=True,  # Enable out-of-bag score calculation
                n_jobs=-1  # Use all available cores
            ))
        ])

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        pipeline.fit(X_train, y_train)

        preds = pipeline.predict(X_test)

        # Calculate prediction accuracy within different error margins
        errors = np.abs(y_test - preds)
        accuracy_5 = np.mean(errors <= 0.05 * y_test) * 100  # Within 5% error
        accuracy_10 = np.mean(errors <= 0.10 * y_test) * 100  # Within 10% error
        accuracy_20 = np.mean(errors <= 0.20 * y_test) * 100  # Within 20% error

        # Calculate overall accuracy score (weighted average of different margins)
        weights = [0.5, 0.3, 0.2]  # Higher weight for stricter margins
        overall_accuracy = (
            weights[0] * accuracy_5 +
            weights[1] * accuracy_10 +
            weights[2] * accuracy_20
        )

        metrics = {
            'rmse': float(np.sqrt(mean_squared_error(y_test, preds))),
            'mae': float(mean_absolute_error(y_test, preds)),
            'r2': float(r2_score(y_test, preds)),
            'accuracy_5': float(accuracy_5),   # Percentage of predictions within 5% error
            'accuracy_10': float(accuracy_10), # Percentage of predictions within 10% error
            'accuracy_20': float(accuracy_20), # Percentage of predictions within 20% error
            'overall_accuracy': float(overall_accuracy)  # Weighted overall accuracy score
        }

        # Save for later
        self.model = pipeline.named_steps['model']
        self.preprocessor = pipeline.named_steps['pre']

        # Derive feature importance names
        # For onehot, expand feature names
        feature_names = []
        if categorical:
            ohe = pipeline.named_steps['pre'].named_transformers_.get('cat')
            if ohe is not None:
                cat_names = ohe.get_feature_names_out(categorical).tolist()
                feature_names.extend(cat_names)
        if numeric:
            feature_names.extend(numeric)

        self.feature_names = feature_names

        # Get importances (align to feature_names)
        importances = pipeline.named_steps['model'].feature_importances_
        fi = dict(zip(feature_names, importances.tolist())) if feature_names else {}

        # Create plots as Plotly JSON strings
        plots: Dict[str, str] = {}

        # Feature importance bar
        if fi:
            names = list(fi.keys())[:20]
            vals = [fi[n] for n in names]
            fig = go.Figure(go.Bar(x=vals, y=names, orientation='h'))
            fig.update_layout(title='Feature Importances', xaxis_title='Importance')
            plots['feature_importance'] = fig.to_json()

        # Actual vs predicted
        fig2 = go.Figure()
        fig2.add_trace(go.Scatter(x=y_test, y=preds, mode='markers', name='pred_vs_actual'))
        fig2.add_trace(go.Line(x=[y_test.min(), y_test.max()], y=[y_test.min(), y_test.max()], name='ideal'))
        fig2.update_layout(title='Actual vs Predicted', xaxis_title='Actual', yaxis_title='Predicted')
        plots['actual_vs_predicted'] = fig2.to_json()

        # Accuracy metrics visualization
        fig3 = go.Figure()
        accuracy_data = [
            ('Within 5%', metrics['accuracy_5']),
            ('Within 10%', metrics['accuracy_10']),
            ('Within 20%', metrics['accuracy_20'])
        ]
        fig3.add_trace(go.Bar(
            x=[x[0] for x in accuracy_data],
            y=[x[1] for x in accuracy_data],
            text=[f'{x[1]:.1f}%' for x in accuracy_data],
            textposition='auto'
        ))
        fig3.update_layout(
            title='Prediction Accuracy',
            yaxis_title='Percentage of Predictions',
            yaxis=dict(range=[0, 100]),
            showlegend=False
        )
        plots['accuracy_metrics'] = fig3.to_json()

        # Save pipeline (preprocessor + model) using joblib
        joblib.dump(pipeline, 'server/models/pipeline.joblib')

        return metrics, plots

    def predict(self, record: Dict[str, Any]) -> Tuple[float, Dict[str, float]]:
        # Load pipeline and get metrics from the most recent training
        pipeline = joblib.load('server/models/pipeline.joblib')
        X = pd.DataFrame([record])
        pred = pipeline.predict(X)
        
        # Get the accuracy metrics
        accuracy_info = {
            'overall_accuracy': pipeline.named_steps['model'].oob_score_ * 100 if hasattr(pipeline.named_steps['model'], 'oob_score_') else None
        }
        
        return float(pred[0]), accuracy_info


regressor = IncomeRegressor()
