Server for Income Predictor

Endpoints:
- GET /health — health check
- POST /train — multipart file upload (CSV). The CSV should contain features and a numeric target column named one of: salary, income, target, label or a numeric last column. Returns metrics and Plotly JSON plots.
- POST /predict — JSON body: {"data": {<feature_name>: value, ...}} returns {"prediction": <float>}

Install and run (recommended in a virtualenv):

```powershell
cd server
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8080
```

Usage:
- POST /train with form field `csv_file` as a file upload.
- After successful training, POST /predict with JSON body {"data": {...}}
