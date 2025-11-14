from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os

app = FastAPI()


class PredictRequest(BaseModel):
    data: dict


@app.get('/health')
def health():
    return {'status': 'healthy'}


@app.post('/train')
async def train(csv_file: UploadFile = File(...)):
    """Upload a CSV file and train a regression model.

    The CSV should contain feature columns and one numeric target column
    named one of: salary, income, target, label or a numeric last column.
    """
    os.makedirs('server/data', exist_ok=True)
    os.makedirs('server/models', exist_ok=True)

    if not csv_file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail='Uploaded file must be a CSV')

    content = await csv_file.read()
    path = os.path.join('server', 'data', csv_file.filename)
    with open(path, 'wb') as f:
        f.write(content)

    # Lazy imports to keep the app start resilient when deps are missing
    try:
        import pandas as pd
    except Exception:
        raise HTTPException(status_code=500, detail=(
            'Missing dependency: pandas. Install server requirements (pip install -r requirements.txt)'
        ))

    try:
        from ml_models import regressor
    except Exception:
        raise HTTPException(status_code=500, detail=(
            'Missing or broken ml_models dependencies. Ensure scikit-learn, numpy and plotly are installed.'
        ))

    try:
        df = pd.read_csv(path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'Failed to read CSV: {e}')

    try:
        metrics, plots = regressor.train_from_df(df)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return JSONResponse({'metrics': metrics, 'plots': plots})


@app.post('/predict')
def predict(req: PredictRequest):
    try:
        from ml_models import regressor
    except Exception:
        raise HTTPException(status_code=500, detail=(
            'Missing ml_models (model code) or its dependencies. Train the model via /train first.'
        ))

    try:
        pred = regressor.predict(req.data)
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail='Model not trained. Call /train with a CSV first.')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {'prediction': pred}
